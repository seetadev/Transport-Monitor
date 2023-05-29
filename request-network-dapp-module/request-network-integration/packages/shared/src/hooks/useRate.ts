import { CurrencyDefinition } from "@requestnetwork/currency";
import { useState, useEffect } from "react";

/** Load rate conversion between two currencies */
export const useRate = (
  currency: CurrencyDefinition | undefined,
  counterCurrency: CurrencyDefinition | undefined
) => {
  const [rate, setRate] = useState<number>();
  useEffect(() => {
    if (currency && counterCurrency) {
      let curr = currency.symbol;
      fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${curr}&tsyms=${counterCurrency}`
      )
        .then(res => res.json())
        .then(res => {
          setRate(res[counterCurrency.symbol]);
        });
    }
  }, [currency, counterCurrency]);

  return rate;
};
