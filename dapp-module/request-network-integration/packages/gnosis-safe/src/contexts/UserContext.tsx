import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ENS } from "request-shared";

interface IContext {
  loading: boolean;
  name?: string;
  account?: string;
}

const UserContext = React.createContext<IContext | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { account, library } = useWeb3React();
  const [name, setName] = useState<string>();

  const load = async (account?: string) => {
    if (account) {
      const ens = await ENS.fromAddress(account, library);
      if (ens) {
        setName(ens.name);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!account) {
      const t = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(t);
    } else {
      load(account);
    }
  }, [account]);

  return (
    <UserContext.Provider
      value={{ loading, name, account: account || undefined }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useConnectedUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("This hook must be used inside a UserProvider");
  }
  return context;
};
