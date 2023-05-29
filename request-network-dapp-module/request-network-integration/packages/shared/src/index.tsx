import { CurrencyDefinition } from "@requestnetwork/currency";
import { RequestLogicTypes, ClientTypes } from "@requestnetwork/types";
import { providers, utils } from "ethers";
export type RequestStatus =
  | "paid"
  | "open"
  | "pending"
  | "canceled"
  | "overpaid"
  | "waiting";

/** Formatted request */
export interface IParsedRequest {
  requestId: string;
  amount: number;
  balance: number;
  currency: CurrencyDefinition;
  status: RequestStatus;
  createdDate: Date;
  paidDate?: Date;
  canceledDate?: Date;
  paymentAddress: string;
  paymentFrom?: string;
  paymentTxHash?: string;
  invoiceNumber?: string;
  reason?: string;
  currencyType: RequestLogicTypes.CURRENCY;
  currencySymbol: string;
  currencyNetwork: string;
  txHash?: string;
  payee: string;
  payer?: string;
  raw: ClientTypes.IRequestData;
  network: string;
  loaded?: boolean;
}

export * from "./contexts/RequestContext";
export * from "./contexts/CurrencyContext";
export * from "./hooks/useRate";
export * from "./helpers";

export type ChainInfo = {
  id: string;
  chainId: number;
  name: string;
  color?: string;
  isTest?: boolean;
  rpcUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
};

export const chainInfos: Record<string | number, ChainInfo> = {
  mainnet: { id: "mainnet", name: "Ethereum", chainId: 1, color: "#038789" },
  xdai: {
    id: "xdai",
    color: "#48a900",
    chainId: 100,
    name: "xDAI Chain",
    rpcUrls: ["https://gnosischain-rpc.gateway.pokt.network/"],
    nativeCurrency: {
      name: "xDAI",
      symbol: "xDAI",
      decimals: 18,
    },
    blockExplorerUrls: ["https://gnosischain.io/"],
  },
  matic: {
    id: "matic",
    name: "Polygon",
    chainId: 137,
    blockExplorerUrls: ["https://polygonscan.com/"],
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.matic.network/"],
  },
  goerli: {
    id: "goerli",
    name: "Goerli",
    chainId: 5,
    color: "#FFB95F",
    blockExplorerUrls: ["https://goerli.etherscan.io/"],
    nativeCurrency: {
      name: "ETH-goerli",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

export const addEthereumChain = (
  chain: string | number,
  library?: providers.Web3Provider
) => {
  const { chainId, name, blockExplorerUrls, rpcUrls, nativeCurrency } =
    chainInfos[chain] || {};
  if (!library) {
    library = new providers.Web3Provider((window as any).ethereum);
  }

  // first attempt to switch to that chain
  try {
    return library.send("wallet_switchEthereumChain", [
      { chainId: utils.hexValue(chainId) },
    ]);
  } catch {}

  if (!rpcUrls || rpcUrls.length === 0) {
    return null;
  }

  return library.send("wallet_addEthereumChain", [
    {
      chainId: utils.hexValue(chainId),
      chainName: name,
      blockExplorerUrls,
      rpcUrls: rpcUrls ? rpcUrls : [],
      nativeCurrency,
    },
  ]);
};

Object.values(chainInfos).forEach((val) => (chainInfos[val.chainId] = val));
