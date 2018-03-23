import { Injectable } from '@angular/core';
import { Platform, Alert, AlertController } from 'ionic-angular';

import { Network } from '@ionic-native/network';



@Injectable()
export class ConnectionProvider {

  disconnectedBefore: boolean = false;
  online: boolean = true;

  disconnectedAlert: Alert;

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,

    private network: Network
  ) {
    this.platform.ready().then(() => {

      this.network.onDisconnect().subscribe(() => {
    		this.online = false;

    		if(!this.disconnectedBefore) {
    			this.disconnectedAlert = this.alertCtrl.create({
    			  title: 'Mất kết nối!',
    			  message: 'Vui lòng kết nối internet để tiếp tục sử dụng.',
    			  buttons: ['OK']
    			});
    			this.disconnectedAlert.present();
    		}

        this.disconnectedBefore = true;

      });

      this.network.onConnect().subscribe(() => {
        // console.log('network connected!');

        this.online = true;

        if(this.disconnectedBefore) {
          this.disconnectedBefore = false;
          this.disconnectedAlert.dismiss();
        }

      });

    });
  }

}
