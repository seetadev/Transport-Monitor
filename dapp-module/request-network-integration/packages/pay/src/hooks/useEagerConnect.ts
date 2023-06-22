import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { IParsedRequest } from "request-shared";

import { getConnectors } from "../connectors";

const isAuthorized = async (): Promise<boolean> => {
  if (!window.ethereum) {
    return false;
  }

  try {
    const result = await new Promise<any>((resolve, reject) =>
      window.ethereum!.sendAsync({ method: "eth_accounts" }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
    if (result?.result?.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

export function useEagerConnect(request?: IParsedRequest) {
  const [connector, setConnector] = useState<AbstractConnector>();
  const { activate, active, error, setError } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (request) {
      setConnector(getConnectors(request).injected);
    }
  }, [request]);

  useEffect(() => {
    if (connector) {
      isAuthorized().then(authorized => {
        if (authorized) {
          activate(connector, undefined, true).catch(e => {
            setError(e);
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
  }, [connector, activate, setError]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  useEffect((): any => {
    if (!connector) return;
    const { ethereum } = window as any;

    if (ethereum && ethereum.on) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(connector);
        setError(null as any);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(connector);
        setError(null as any);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(connector);
          setError(null as any);
        }
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [active, error, tried, activate, setError, connector]);
}
