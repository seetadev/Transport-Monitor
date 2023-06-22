declare module "wallet-address-validator";

interface Window {
  ethereum?: Ethereum;
}

interface Ethereum {
  chainId: string;
  sendAsync: (
    { method: string },
    callback?: (err: any, result: any) => void
  ) => any;
  enable: () => Promise<string[]>;
  on?: (method: string, listener: (...args: any[]) => void) => void;
  removeListener?: (method: string, listener: (...args: any[]) => void) => void;
  isMetaMask: boolean;
}
