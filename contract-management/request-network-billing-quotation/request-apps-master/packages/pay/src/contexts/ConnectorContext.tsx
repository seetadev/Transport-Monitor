import React, { useState, useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";

// import {
//   WalletConnectConnector,
//   URI_AVAILABLE,
//   UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
// } from "@web3-react/walletconnect-connector";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError as UserRejectedRequestErrorInjected } from "@web3-react/injected-connector";
import { usePrevious } from "../hooks/usePrevious";
import { useRequest, getProviderName } from "request-shared";
import { getConnectors } from "../connectors";

interface IContext {
  /** name of the active connector */
  connectorName: string | undefined;
  /** set the active connector */
  activateConnector: (name: string) => void;
  /** for walletconnect only, the connection URL */
  // walletConnectUrl?: string;
  /** true when connectors are loaded. Avoids flashing UIs */
  ready: boolean;
  /** name of the connected provider (metamask,...) if available */
  providerName: string;
}

/**
 * This context manages the active web3 Connector based on the current Request as well as the user's choice.
 * It relies on both Web3ReactContext for the web3 context, and the RequestContext for the current request.
 */
export const ConnectorContext = React.createContext<IContext | null>(null);

/**
 * This provider reacts to changes on the request
 */
export const ConnectorProvider: React.FC = ({ children }) => {
  const [connectors, setConnectors] = useState<
    Record<string, AbstractConnector>
  >();
  const [connectorName, setConnectorName] = useState<string>();
  //  const [walletConnectUrl, setWalletConnectUrl] = useState("");
  const [ready, setReady] = useState(false);

  const { request, loading } = useRequest();
  const { activate, deactivate, active, error } = useWeb3React();

  const prevActive = usePrevious(active);

  // load available connectors for request
  useEffect(() => {
    if (loading) {
      return;
    }
    if (request) {
      setConnectors(getConnectors(request));
    } else {
      setConnectors({});
    }
  }, [request, loading]);

  // handle errors and connector deactivation
  useEffect(() => {
    if (
      error &&
      error instanceof UserRejectedRequestErrorInjected
      // ||error instanceof UserRejectedRequestErrorWalletConnect
    ) {
      setConnectorName("");
      deactivate();
    }
    if (connectorName && prevActive && !active && !error) {
      setConnectorName("");
    }
  }, [error, active, prevActive, connectorName, deactivate]);

  // handle connector activation
  useEffect(() => {
    if (connectors && connectorName && connectors[connectorName]) {
      console.log(connectorName);
      activate(connectors[connectorName], undefined, false);
    }
  }, [connectors, connectorName, activate]);

  // Try activate the previously used connector silently
  useEffect(() => {
    if (!connectors) return;
    if (Object.keys(connectors).length === 0) {
      setReady(true);
      return;
    }

    const injected = connectors.injected as InjectedConnector;
    const walletconnect = connectors.walletconnect;

    if (injected && walletconnect) {
      // try getting walletconnect URL
      // walletconnect.on(URI_AVAILABLE, setWalletConnectUrl);
      // try activating Injected connector
      injected.isAuthorized().then(async isAuthorized => {
        if (isAuthorized) {
          try {
            await activate(injected, undefined, true);
            setConnectorName("injected");
            setReady(true);
            return;
          } catch (e) {
            console.log(e);
            setConnectorName("");
          }
        }

        if (localStorage.getItem("walletconnect")) {
          try {
            // try activating WalletConnect connector
            await activate(walletconnect, undefined, true);
            setConnectorName("walletconnect");
          } catch (e) {
            console.log(e);
            setConnectorName("");
          }
        }
      });
    }
    setReady(true);

    // return () => {
    //   walletconnect?.off(URI_AVAILABLE, setWalletConnectUrl);
    // };
  }, [connectors, activate]);

  return (
    <ConnectorContext.Provider
      value={{
        connectorName,
        activateConnector: setConnectorName,
        // walletConnectUrl,
        ready,
        providerName: getProviderName(connectorName),
      }}
    >
      {children}
    </ConnectorContext.Provider>
  );
};

/** Utility to use the Connector context */
export const useConnector = () => {
  const context = React.useContext(ConnectorContext);
  if (!context) {
    throw new Error("This hook must be used inside a ConnectorProvider");
  }
  return context;
};
