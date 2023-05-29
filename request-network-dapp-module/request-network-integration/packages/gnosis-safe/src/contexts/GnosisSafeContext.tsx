import React, { useState, useEffect } from "react";
import { ENS } from "request-shared";

import initSdk, { SafeInfo, SdkInstance } from "@gnosis.pm/safe-apps-sdk";

interface IGnosisSafeInfo {
  loading: boolean;
  name?: string;
  safeInfo?: SafeInfo;
  appsSdk?: SdkInstance;
}

const GnosisSafeContext = React.createContext<IGnosisSafeInfo | null>(null);

export const GnosisSafeProvider: React.FC = ({ children }) => {
  // TODO: put the right URL here for production
  const [appsSdk] = useState(initSdk([/https?:\/\/localhost/]));
  const [safeInfo, setSafeInfo] = useState({} as any);
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appsSdk.addListeners({
      onSafeInfo: setSafeInfo,
    });
    return () => appsSdk.removeListeners();
  }, [appsSdk]);

  const load = async (address?: string) => {
    if (address) {
      const ens = await ENS.fromAddress(address);
      if (ens) {
        setName(ens.name);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!safeInfo?.safeAddress) {
      const t = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(t);
    } else {
      load(safeInfo!.safeAddress);
    }
  }, [safeInfo]);

  return (
    <GnosisSafeContext.Provider value={{ loading, name, safeInfo, appsSdk }}>
      {children}
    </GnosisSafeContext.Provider>
  );
};

export const useGnosisSafe = () => {
  const context = React.useContext(GnosisSafeContext);
  if (!context) {
    throw new Error("This hook must be used inside a GnosisSafeProvider");
  }
  return context;
};
