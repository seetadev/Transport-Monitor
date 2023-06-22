import { InjectedConnector } from "@web3-react/injected-connector";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { chainInfos, IParsedRequest } from "request-shared";
import { RequestLogicTypes } from "@requestnetwork/types";

/** Get available connectors based on request type and network. */
export const getConnectors = (
  request: IParsedRequest
): Record<string, AbstractConnector> => {
  if (
    !(
      request.currencyType === RequestLogicTypes.CURRENCY.ETH ||
      request.currencyType === RequestLogicTypes.CURRENCY.ERC20
    )
  ) {
    return {};
  }

  return {
    injected: new InjectedConnector({
      supportedChainIds: [chainInfos[request.currencyNetwork || ""]?.chainId],
    }),
  };
};
