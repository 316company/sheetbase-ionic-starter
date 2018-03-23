import { Component } from '@angular/core';

import { MetaProvider } from '../../providers/meta/meta';
import { DataProvider } from '../../providers/data/data';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    private data: DataProvider,
    private meta: MetaProvider
  ) {

  }

  ionViewDidLoad() {
    this.meta.set({
      title: 'Sheetbase App'
    });
  }

}
