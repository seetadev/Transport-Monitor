import { CurrencyInput, CurrencyManager } from "@requestnetwork/currency";
import { RequestLogicTypes } from "@requestnetwork/types";

const defaultCurrencies = CurrencyManager.getDefaultList();
export const getCurrencies = (): CurrencyInput[] => [
  ...defaultCurrencies.filter(
    (x) =>
      x.type === RequestLogicTypes.CURRENCY.ETH ||
      ["DAI-mainnet", "USDC-mainnet", "USDT-mainnet", "FAU-goerli"].includes(
        x.id
      )
  ),
  {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    network: "matic",
    decimals: 6,
    symbol: "USDC",
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    network: "matic",
    decimals: 6,
    symbol: "USDT",
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
  {
    address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    network: "xdai",
    decimals: 6,
    symbol: "USDC",
    type: RequestLogicTypes.CURRENCY.ERC20,
  },
];
