import { CurrencyDefinition } from "@requestnetwork/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useCurrency } from "../contexts/CurrencyContext";

export const useRequestClient = (
  network: string,
  signatureProvider?: Types.SignatureProvider.ISignatureProvider
) => {
  const { currencyList } = useCurrency();
  return getRequestClient(network, signatureProvider, currencyList);
};

export const getRequestClient = (
  network: string,
  signatureProvider?: Types.SignatureProvider.ISignatureProvider,
  currencyList?: CurrencyDefinition[]
) => {
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: `https://${network}.gateway.request.network/`,
    },
    signatureProvider,
    currencies: currencyList,
    httpConfig: {
      getConfirmationRetryDelay: 0,
      getConfirmationExponentialBackoffDelay: 1000,
    },
  });

  return requestNetwork;
};
