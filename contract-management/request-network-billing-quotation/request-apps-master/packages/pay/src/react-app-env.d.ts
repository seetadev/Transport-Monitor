/// <reference types="react-scripts" />

declare interface Window {
  ethereum?: Ethereum;
}

interface Ethereum {
  sendAsync: (
    { method: string },
    callback?: (err: any, result: any) => void
  ) => any;
  enable: () => Promise<string[]>;
  on?: (method: string, listener: (...args: any[]) => void) => void;
  removeListener?: (method: string, listener: (...args: any[]) => void) => void;
}
