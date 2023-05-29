import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../connectors";

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

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    isAuthorized().then(authorized => {
      if (authorized) {
        activate(injected).catch(e => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
    // eslint-disable-next-line
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
