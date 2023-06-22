import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useEnsName } from "request-shared";
import { providers } from "ethers";

interface IContext {
  loading: boolean;
  name?: string;
  account?: string;
}

const UserContext = React.createContext<IContext | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const { account } = useWeb3React<providers.Web3Provider>();

  const [name, { loading }] = useEnsName(account, { timeout: 500 });

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
