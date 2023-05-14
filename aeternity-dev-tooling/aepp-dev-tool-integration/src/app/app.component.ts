import { Component } from '@angular/core';
import { AeternityService } from './services/aeternity.service';
import { AeSdkAepp, AE_AMOUNT_FORMATS } from '@aeternity/aepp-sdk';
import { environment } from 'src/environments/environment';

const { networkId } =  environment;

export enum WalletConnectionStatus {
  Error = 0 ,
  Connecting,
  Connected,
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'aepp-boilerplate-angular';
  aeSdk?: AeSdkAepp;
  resObj: {
    error?: string,
    address?: `ak_${string}`,
    balance?: string,
    height?: number,
    nodeUrl?: string,
  } = {};
  status: WalletConnectionStatus = WalletConnectionStatus.Connecting
  WalletConnectionStatus = WalletConnectionStatus

  constructor(private aeService: AeternityService) {
    const onNetworkChange = (params : any ) => {
      this.showWalletInfo(params.networkId);
    };
    aeService.initSDK(onNetworkChange)
      .then(({walletNetworkId, aeSdk} : {walletNetworkId: string, aeSdk: AeSdkAepp}) => {
        this.aeSdk = aeSdk;
        this.showWalletInfo(walletNetworkId);
    });
  }

  async showWalletInfo(walletNetworkId: string) {
    if (walletNetworkId !== networkId) {
      this.resObj.error = `Connected to the wrong network "${walletNetworkId}". please switch to "${networkId}" in your wallet.`;
      this.status = WalletConnectionStatus.Error;
      return;
    }
    if (this.aeSdk == null) {
      this.resObj.error = `SDK instance is not ready yet.`;
      this.status = WalletConnectionStatus.Error;
      return;
    }

    this.resObj.address = await this.aeSdk.address();
    this.resObj.balance = await this.aeSdk.getBalance(this.resObj.address, {
      format: AE_AMOUNT_FORMATS.AE,
    });
    this.resObj.height = await this.aeSdk.height();
    this.resObj.nodeUrl = (await this.aeSdk.getNodeInfo()).url;
    this.status = WalletConnectionStatus.Connected;
  }

}
