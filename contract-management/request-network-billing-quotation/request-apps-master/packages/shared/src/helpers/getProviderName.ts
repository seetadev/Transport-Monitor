/** attempt to get the connected wallet. Falls back to the connector name (injected, walletconnect...) */
export const getProviderName = (connectorName?: string): string => {
  const provider = (window as any).ethereum;
  if (provider) {
    if (provider.isMetaMask) return "metamask";
    if (provider.isTrust) return "trust";
    if (provider.isGoWallet) return "goWallet";
    if (provider.isAlphaWallet) return "alphaWallet";
    if (provider.isStatus) return "status";
    if (provider.isToshi) return "coinbase";
    if (provider.isGSNProvider) return "GSN";
    if (provider.constructor?.name === "EthereumProvider") return "mist";
    if (provider.constructor?.name === "Web3FrameProvider") return "parity";
    if (provider.host?.indexOf("infura") !== -1) return "infura";
    if (provider.connection?.url.indexOf("infura") !== -1) return "infura";
    if (provider.host?.indexOf("localhost") !== -1) return "localhost";
    if (provider.host?.indexOf("127.0.0.1") !== -1) return "localhost";
  }
  if (connectorName) return connectorName;
  return "unknown";
};
