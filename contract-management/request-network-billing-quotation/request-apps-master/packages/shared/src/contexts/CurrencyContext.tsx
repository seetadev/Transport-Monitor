import React, { PropsWithChildren } from "react";
import {
  CurrencyDefinition,
  CurrencyInput,
  CurrencyManager,
} from "@requestnetwork/currency";

interface IContext {
  currencyList: CurrencyDefinition[];
  // setCurrencyList: React.Dispatch<SetStateAction<CurrencyDefinition[]>>;
}

const CurrencyContext = React.createContext<IContext | null>(null);

// const getCurrencies = (network: number) => {
//   if (network === 4) {
//     return {
//       FAU: currencies.DaiIcon,
//       ETH: currencies.EthIcon,
//     };
//   } else {
//     return {
//       DAI: currencies.DaiIcon,
//       ETH: currencies.EthIcon,
//       // USDT: UsdtIcon,
//       USDC: currencies.UsdcIcon,
//       PAX: currencies.PaxIcon,
//       // BUSD: BusdIcon,
//       TUSD: currencies.TusdIcon,
//     };
//   }
// };

export function CurrencyProvider<TMeta>({
  children,
  currencies,
}: PropsWithChildren<{
  currencies: (CurrencyInput & {
    id?: string;
    meta?: TMeta;
  })[];
}>) {
  const currencyList = currencies.map(CurrencyManager.fromInput);

  return (
    <CurrencyContext.Provider value={{ currencyList }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = React.useContext(CurrencyContext);
  if (!context) {
    throw new Error("This hook must be used inside a CurrencyProvider");
  }

  const { currencyList } = context;
  const currencyManager = new CurrencyManager(currencyList);
  return React.useMemo(() => ({ currencyList, currencyManager }), []);
};
