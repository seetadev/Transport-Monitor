import { Injectable } from '@angular/core';
import {
  AeSdkAepp,
  Node,
  walletDetector,
  BrowserWindowMessageConnection,
  SUBSCRIPTION_TYPES,
} from '@aeternity/aepp-sdk';
import { environment } from 'src/environments/environment';
const { projectName, networkId, nodeUrl, nodeCompilerUrl } =
  environment;

@Injectable({
  providedIn: 'root',
})
export class AeternityService {
  aeSdk?: AeSdkAepp;

  constructor() { }

  async initSDK(onNetworkChange: any) {
    this.aeSdk = new AeSdkAepp({
      name: projectName,
      nodes: [
        {
          name: networkId,
          instance: new Node(nodeUrl),
        },
      ],
      compilerUrl: nodeCompilerUrl,
      onAddressChange:  ({ current }) => console.log('new address'),
      onNetworkChange,
      onDisconnect: () => {
        return new Error('Disconnected');
      },
    });

    const walletNetworkId: string = await this.scanForWallet();
    return { walletNetworkId, aeSdk: this.aeSdk};
  }

  async scanForWallet(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.aeSdk) throw new Error('Failed! SDK not initialized.');
      const handleNewWallet = async ({ wallets, newWallet } : any) => {
        newWallet = newWallet || Object.values(wallets)[0]
        await this.aeSdk!.connectToWallet(await newWallet.getConnection());
        await this.aeSdk!.subscribeAddress(SUBSCRIPTION_TYPES.subscribe, 'current');
        stopScan();
        resolve(newWallet.info.networkId);
      };
      const scannerConnection = new BrowserWindowMessageConnection();
      const stopScan = walletDetector(scannerConnection, handleNewWallet.bind(this));
    });
  }
}

