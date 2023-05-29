import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Request } from "@requestnetwork/request-client.js";
import { CurrencyDefinition } from "@requestnetwork/currency";

import { useRate } from "../hooks/useRate";
import { parseRequest } from "../helpers/parseRequest";
import { IParsedRequest } from "../";
import { chainIdToName } from "../helpers/chainIdToName";
import { useCurrency } from "./CurrencyContext";
import { getRequestClient } from "../helpers/client";

interface IContext {
  /** true if first fetch is ongoing */
  loading: boolean;
  /** the fetched request */
  request?: IParsedRequest;
  /** the counter fiat currency, for display */
  counterCurrency: CurrencyDefinition;
  /** the request's expected amount in counter currency */
  counterValue?: string;
  /**
   * set the pending status for UX purposes
   * Pending means the payment is being processed and takes a long time.
   */
  setPending: (val: boolean) => void;
  update: () => Promise<void>;
}

/**
 * This context loads the request, based on ID in the URL.
 * It also handles rate conversion of the request's amount in a counter currency,
 * as well as the pending state, that exists for UX reasons.
 */
export const RequestContext = React.createContext<IContext | null>(null);

/** Gets a request from a gateway. Tries mainnet then goerli */
const loadRequest = async (
  requestId: string,
  network?: string | number
): Promise<{ network: string; request: Request } | null> => {
  if (!network) {
    return (
      (await loadRequest(requestId, "xdai")) ||
      (await loadRequest(requestId, "mainnet")) ||
      (await loadRequest(requestId, "goerli"))
    );
  }
  network = chainIdToName(network);
  try {
    const rn = getRequestClient(network);
    return {
      network,
      request: await rn.fromRequestId(requestId),
    };
  } catch (error) {
    return null;
  }
};

/** Loads the request and converts the amount to counter currency */
export const RequestProvider: React.FC<{ chainId?: string | number }> = ({
  children,
  chainId,
}) => {
  const { currencyManager } = useCurrency();

  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(true);
  const [parsedRequest, setParsedRequest] = useState<IParsedRequest>();
  const counterCurrency = currencyManager.from("USD")!;
  const [counterValue, setCounterValue] = useState<string>("");
  const [pending, setPending] = useState(false);

  // gets counter currency rate
  const rate = useRate(parsedRequest?.currency, counterCurrency);

  useEffect(() => {
    setLoading(true);
    setParsedRequest(undefined);
  }, [chainId]);

  const fetchRequest = async (
    id: string | undefined,
    chainId: string | number | undefined,
    pending: boolean
  ) => {
    if (!id) {
      return;
    }
    const result = await loadRequest(id, chainId);
    if (result) {
      const parseResult = await parseRequest({
        requestId: result.request.requestId,
        data: result.request.getData(),
        network: result.network,
        pending,
        currencyManager,
      });
      parseResult.loaded = true;
      setParsedRequest(parseResult);
    }
  };

  // load request and handle pending state change.
  useEffect(() => {
    fetchRequest(id, chainId, pending).finally(() => setLoading(false));
  }, [id, pending, chainId]);

  // handle rate conversion
  useEffect(() => {
    if (rate && parsedRequest?.amount)
      setCounterValue((rate * parsedRequest.amount).toFixed(2));
    else {
      setCounterValue("");
    }
  }, [rate, parsedRequest]);

  return (
    <RequestContext.Provider
      value={{
        loading,
        request: parsedRequest,
        counterCurrency,
        counterValue,
        setPending,
        update: useCallback(
          () => fetchRequest(id, chainId, pending),
          [id, chainId, pending]
        ),
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

/** Utility to use the Request context */
export const useRequest = () => {
  const context = React.useContext(RequestContext);
  if (!context) {
    throw new Error("This hook must be used inside a RequestProvider");
  }
  return context;
};
