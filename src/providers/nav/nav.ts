import { Injectable } from '@angular/core';
import { App, Content, NavController, ModalController, Modal, ViewController } from 'ionic-angular';

import { PAGES } from '../../statics/pages';




@Injectable()
export class NavProvider {
  MODAL_PAGES: {[name: string]: any};

  constructor(
    public app: App,
    private modalCtrl: ModalController
  ) {
    this.MODAL_PAGES = {};
  }




  root(
    pageName: string = 'home',
    params: any = {},
    customNav: NavController = null,
    options: any = {animate: true, direction: 'forward'}
  ): void {
    let navCtrl: any = this.app.getRootNavById('n4');
    let component: any = PAGES.MAIN[pageName] || PAGES.MAIN['home'];

    if(customNav) {
      navCtrl = customNav;
    }

    navCtrl.setRoot(component, params, options);
  }
  push(
    pageName: string = 'home',
    params: any = {},
    customNav: NavController = null,
    options: any = {animate: true, direction: 'forward'}
  ): void {
    let navCtrl: any = this.app.getRootNavById('n4');
    let component: any = PAGES.MAIN[pageName] || PAGES.MAIN['home'];

    if(customNav) {
      navCtrl = customNav;
    }

    navCtrl.push(component, params, options);
  }
  pop(customNav: NavController = null) {
    let navCtrl: any = this.app.getRootNavById('n4');

    if(customNav) {
      navCtrl = customNav;
    }

    if(navCtrl.canGoBack()) {
      navCtrl.pop();
    } else {
      navCtrl.setRoot(PAGES.MAIN['home'], {}, {animate: true, direction: 'back'});
    }
  }




  up(pageName: string = 'home', params: any = {}): any {
    let profileModal: Modal = this.modalCtrl.create(this.MODAL_PAGES[pageName], params);
    return profileModal.present();
  }
  down(viewCtrl: ViewController): any {
    if(!viewCtrl) return;
    return viewCtrl.dismiss();
  }




  scroll(content: Content, offsetTop: number = 0, duration: number = 1000): any {
    return content.scrollTo(0, offsetTop || 0, duration);
  }
  url(url: string, blank: boolean = false) {
    if(blank) {
      return window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }


}
