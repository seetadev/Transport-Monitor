import { chainIdToName } from "./chainIdToName";
import { IdentityTypes } from "@requestnetwork/types";
import { providers } from "ethers";

import { CustomSignatureProvider } from "./CustomSignatureProvider";
import { getRequestClient } from "./client";

export const cancelRequest = async (
  requestId: string,
  account: string,
  network: string | number
) => {
  network = chainIdToName(network);
  const win = window as any;
  if (!win.ethereum) {
    throw new Error("ethereum not detected");
  }
  let signatureProvider = new CustomSignatureProvider(
    new providers.Web3Provider((window as any).ethereum).getSigner()
  );
  if (!win.ethereum.isMetamask) {
    const { Web3SignatureProvider } = require("@requestnetwork/web3-signature");
    signatureProvider = new Web3SignatureProvider(win.ethereum);
  }
  const rn = getRequestClient(network, signatureProvider);

  const request = await rn.fromRequestId(requestId);
  const cancellation = await request.cancel({
    type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
    value: account,
  });
  await new Promise(resolve => cancellation.on("confirmed", resolve));
};
