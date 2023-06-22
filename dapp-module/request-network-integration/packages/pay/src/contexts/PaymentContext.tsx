import {
  payRequest,
  getErc20Balance,
  hasErc20Approval,
  approveErc20,
} from "@requestnetwork/payment-processor";
import { useCallback, useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useRequest } from "request-shared";
import { Web3Provider, TransactionResponse } from "@ethersproject/providers";
import { Types } from "@requestnetwork/request-client.js";
import React from "react";
import { ethers, BigNumber } from "ethers";
import axios from "axios";

export class NotEnoughForGasError extends Error {
  constructor() {
    super("Not Enough funds for gas");
    this.name = "NotEnoughForGasError";
  }
}
export class NotEnoughForRequestError extends Error {
  constructor() {
    super("Not Enough funds for request");
    this.name = "NotEnoughForRequestError";
  }
}
export class RequiresApprovalError extends Error {
  constructor() {
    super("Requires Approval");
    this.name = "RequiresApprovalError";
  }
}
export class FiatRequestNotSupportedError extends Error {
  constructor() {
    super("Fiat requests are not supported");
    this.name = "FiatRequestNotSupportedError";
  }
}

/** runs some verification on a request, throw errors if some expectation aren't met  */
const runChecks = async (
  request: Types.IRequestData,
  account: string,
  library: Web3Provider,
  approved: boolean
) => {
  switch (request.currencyInfo.type) {
    case "ERC20":
      const erc20balance = await getErc20Balance(
        request,
        account,
        library as any
      );
      if (BigNumber.from(erc20balance as any).lt(request.expectedAmount)) {
        return new NotEnoughForRequestError();
      }
      const ethBalance = await library.getBalance(account);
      if (ethBalance.isZero()) {
        return new NotEnoughForGasError();
      }
      if (!approved) {
        const approval = await hasErc20Approval(
          request,
          account,
          library as any
        );
        if (!approval) {
          return new RequiresApprovalError();
        }
      }

      break;
    case "ETH":
      const balance = await library.getBalance(account);
      if (balance.lt(request.expectedAmount)) {
        return new NotEnoughForRequestError();
      }
      if (balance.eq(request.expectedAmount)) {
        return new NotEnoughForGasError();
      }

      break;
  }
};

export interface IPaymentContext {
  /** true when initial checks have run */
  ready: boolean;
  /** see runChecks  */
  error?: Error;
  /** true if the request is being paid */
  paying: boolean;
  /** triggers the pay action */
  pay: () => void;
  /** true if the request is being approved */
  approving: boolean;
  /** triggers the approve action */
  approve: () => void;
  /** true if the transaction is being broadcasting */
  broadcasting: boolean;
  /** the transaction hash of the ongoing transaction */
  txHash?: string;
}

/** exposes payment methods and information */
export const PaymentProvider: React.FC = ({ children }) => {
  const [paying, setPaying] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [loadingPendingTx, setLoadingPendingTx] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();
  const [gasPrice, setGasPrice] = useState<number>(6);
  const [autorefresh, setAutorefresh] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [updated, setUpdated] = useState(false);
  const [errorsChecked, setErrorsChecked] = useState(false);
  const [active, setActive] = useState(false);
  const { account, library } = useWeb3React<Web3Provider>();
  const { request, setPending, update } = useRequest();

  const txCallback: any = useCallback(
    async (tx: TransactionResponse) => {
      if (!tx.hash) {
        throw new Error("no tx hash");
      }
      setTxHash(tx.hash);
      setBroadcasting(true);
      const t = setTimeout(() => {
        setPending(true);
      }, 2000);
      // For ETH, use etherscan, for others, use default provider.
      // this is to match the behaviour of request payment detection.
      if (request?.currencyType === Types.RequestLogic.CURRENCY.ETH) {
        const provider = new ethers.providers.EtherscanProvider(
          request?.currencyNetwork,
          "TCVQQU5V39TAS1V6HF61P9K7IJZVEHH1D9"
        );
        await provider.waitForTransaction(tx.hash, 1);
      } else {
        await tx.wait(1);
      }
      clearTimeout(t);
      setAutorefresh(true);
    },
    [setBroadcasting, setPending, request]
  );

  useEffect(() => {
    if (txHash) {
      localStorage.setItem("txhash", txHash);
    } else {
      localStorage.removeItem("txhash");
    }
  }, [txHash]);

  useEffect(() => {
    if (!autorefresh) return;
    if (request?.status === "paid" || request?.status === "overpaid") {
      setAutorefresh(false);
      setPending(false);
      setPaying(false);
      setTxHash(undefined);
    } else {
      const i = setInterval(update, 2000);
      return () => clearInterval(i);
    }
  }, [autorefresh, request, setPending, update]);

  // Check for locally stored payment transaction hash and
  // set payment as pending while waiting for transaction to be complete.
  useEffect(() => {
    const hash = localStorage.getItem("txhash");
    if (hash) {
      if (!library) return;
      if (request?.status === "paid" || request?.status === "overpaid") {
        localStorage.removeItem("txhash");
      }
      if (request?.status === "open") {
        library.getTransaction(hash).then(async tx => {
          if (tx) {
            setTxHash(hash);
            setPending(true);
            setLoadingPendingTx(false);
            await tx.wait(1);
            setPending(false);
          }
          localStorage.removeItem("txhash");
        });
      }
    } else {
      setLoadingPendingTx(false);
    }
  }, [library, request, setPending]);

  useEffect(() => {
    const params = process.env.REACT_APP_EGS_API_KEY
      ? {
          "api-key": process.env.REACT_APP_EGS_API_KEY,
        }
      : {};

    axios
      .get("https://ethgasstation.info/json/ethgasAPI.json", {
        params,
      })
      .then(res => setGasPrice(res.data.average / 10 + 1));
  }, []);

  // Process paying a request or
  useEffect(() => {
    if (!request || !account || !library || !updated || !errorsChecked) return;
    if (broadcasting) return;
    if (!paying) return;
    if (request.status !== "open") return;

    if (active) return;
    setActive(true);

    payRequest(request.raw, library as any, undefined, {
      gasPrice: ethers.utils.parseUnits(gasPrice.toString(), "gwei") as any,
      gasLimit: 100000,
    })
      .then(txCallback)
      .catch(e => {
        setPaying(false);
        console.log(e);
      })
      .finally(() => setActive(false));
  }, [
    paying,
    request,
    account,
    library,
    txCallback,
    setPending,
    gasPrice,
    broadcasting,
    updated,
    errorsChecked,
    active,
  ]);

  // Process approving an erc20 allowance
  useEffect(() => {
    if (!request || !account || !library || !updated || !errorsChecked) return;
    if (!approving) return;
    if (approved) return;
    if (broadcasting) return;
    if (request.status !== "open") return;

    if (active) return;
    setActive(true);

    approveErc20(request.raw, library as any, {
      gasPrice: ethers.utils.parseUnits(gasPrice.toString(), "gwei") as any,
    })
      .then(async () => {
        setBroadcasting(true);
        setApproved(true);
        setBroadcasting(false);
      })
      .then(() => {
        setError(undefined);
      })
      .finally(() => {
        setApproving(false);
        setActive(false);
      });
  }, [
    request,
    account,
    library,
    update,
    errorsChecked,
    broadcasting,
    approving,
    updated,
    gasPrice,
    approved,
    active,
  ]);

  useEffect(() => {
    if (paying || approving) {
      setUpdated(false);
      setErrorsChecked(false);
      update().then(() => {
        setUpdated(true);
      });
    }
  }, [paying, approving, update]);

  // Run checks and show error messages if something is wrong.
  useEffect(() => {
    if (
      request?.currencyType === Types.RequestLogic.CURRENCY.ISO4217 &&
      request.status === "open"
    ) {
      setReady(true);
      setError(new FiatRequestNotSupportedError());
    } else if (request?.currencyType === Types.RequestLogic.CURRENCY.BTC) {
      setReady(true);
    } else {
      if (!account || !request || !library) return;
      runChecks(request.raw, account, library, approved).then(err => {
        setError(err);
        setReady(true);
        setErrorsChecked(true);
      });
    }
  }, [request, approving, paying, account, library, approved]);

  const value = {
    ready: ready && !loadingPendingTx,
    error,
    paying,
    pay: () => setPaying(true),
    approving,
    approve: () => setApproving(true),
    broadcasting,
    txHash,
  };
  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};

export const PaymentContext = React.createContext<IPaymentContext | null>(null);

export const usePayment = () => {
  const context = React.useContext(PaymentContext);
  if (!context) {
    throw new Error("This hook must be used inside a PaymentProvider");
  }
  return context;
};
