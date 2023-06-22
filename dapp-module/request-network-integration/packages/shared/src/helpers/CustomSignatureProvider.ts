import { normalize, areEqualIdentities, recoverSigner } from "@requestnetwork/utils";
import { providers } from "ethers";
import {
  IdentityTypes,
  SignatureProviderTypes,
  SignatureTypes,
} from "@requestnetwork/types";

export class CustomSignatureProvider
  implements SignatureProviderTypes.ISignatureProvider {
  constructor(private signer: providers.JsonRpcSigner) {}
  /** list of supported signing method */
  public supportedMethods: SignatureTypes.METHOD[] = [
    SignatureTypes.METHOD.ECDSA,
    SignatureTypes.METHOD.ECDSA_ETHEREUM,
  ];
  /** list of supported identity types */
  public supportedIdentityTypes: IdentityTypes.TYPE[] = [
    IdentityTypes.TYPE.ETHEREUM_ADDRESS,
  ];
  public async sign(
    data: any,
    signer: IdentityTypes.IIdentity
  ): Promise<SignatureTypes.ISignedData> {
    const normalizedData = normalize(data);
    const signatureValue = await this.signer.signMessage(
      Buffer.from(normalizedData)
    );

    // some wallets (like Metamask) do a personal_sign (ECDSA_ETHEREUM),
    //  some (like Trust) do a simple sign (ECDSA)
    const signedData =
      this.getSignedData(
        data,
        signatureValue,
        SignatureTypes.METHOD.ECDSA_ETHEREUM,
        signer
      ) ||
      this.getSignedData(
        data,
        signatureValue,
        SignatureTypes.METHOD.ECDSA,
        signer
      );
    if (!signedData) throw new Error("Signature failed!");
    return signedData;
  }

  /** Get the signed data, if valid, null if not */
  private getSignedData(
    data: any,
    value: string,
    method: SignatureTypes.METHOD,
    signer: IdentityTypes.IIdentity
  ): SignatureTypes.ISignedData | null {
    const signedData = {
      data,
      signature: {
        method,
        value,
      },
    };
    if (areEqualIdentities(recoverSigner(signedData), signer)) {
      return signedData;
    }
    return null;
  }
}
