import React from "react";
import { RAlert, Severity } from "request-ui";
import { Link } from "@material-ui/core";

import { UnsupportedChainIdError } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { addEthereumChain, chainInfos, IParsedRequest } from "request-shared";

import {
  FiatRequestNotSupportedError,
  NotEnoughForGasError,
  NotEnoughForRequestError,
  RequiresApprovalError,
} from "../contexts/PaymentContext";

const getErrorMessage = (error: Error, request: IParsedRequest) => {
  if (error instanceof NoEthereumProviderError) {
    return (
      <>
        No compatible wallet detected. Please{" "}
        <Link
          underline="always"
          style={{
            color: "#656565",
          }}
          target="_blank"
          href="https://metamask.io/download.html"
        >
          install Metamask
        </Link>{" "}
        or finish your payment using a mobile wallet.
      </>
    );
  }
  if (error instanceof FiatRequestNotSupportedError) {
    return "This is a fiat request. You can't pay it here. You must be lost 🙃";
  }
  if (error instanceof RequiresApprovalError) {
    return "Please approve the contract using your connected wallet.";
  }
  if (error instanceof UnsupportedChainIdError) {
    const prefix =
      request.currencyNetwork === "goerli" ? "This is a test request. " : "";
    const network = request.currencyNetwork || "";
    const text = `connect your wallet to ${chainInfos[network].name}`;
    return (
      <>
        {prefix}Please{" "}
        {network ? (
          <Link
            underline="always"
            onClick={() => {
              addEthereumChain(network);
            }}
            style={{ cursor: "pointer" }}
          >
            {text}
          </Link>
        ) : (
          text
        )}{" "}
        to pay this request.
      </>
    );
  }

  if (error instanceof NotEnoughForRequestError) {
    return `You do not have sufficient funds. Please add ${request.currency} to your wallet to pay this request.`;
  }
  if (error instanceof NotEnoughForGasError) {
    return `You do not have sufficient ETH to pay gas. Please add ETH to your wallet to pay this request.`;
  }

  console.error(error);
  return "An unknown error occurred.";
};

export const ErrorMessage = ({
  error,
  request,
}: {
  error: Error;
  request: IParsedRequest;
}) => {
  const severities: Record<string, Severity> = {
    FiatRequestNotSupportedError: "error",
    RequiresApprovalError: "info",
  };

  return (
    <RAlert
      severity={severities[error.name] || "warning"}
      message={getErrorMessage(error, request)}
    />
  );
};
