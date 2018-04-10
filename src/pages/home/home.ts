import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { NavProvider } from '../../providers/nav/nav';
import { MetaProvider } from '../../providers/meta/meta';
import { SheetbaseProvider } from '../../providers/sheetbase/sheetbase';


@IonicPage({
  segment: 'app'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedTable: string;
  items: any[];

  constructor(
    private nav: NavProvider,
    private sheetbase: SheetbaseProvider,
    private meta: MetaProvider
  ) {

  }

  ionViewDidLoad() {
    this.meta.set({
      title: 'Sheetbase App'
    });
  }

  itemsByTable(tableName: string) {
    this.selectedTable = tableName;

    this.sheetbase.get(
      tableName, null, {
      limitToFirst: 100
    }).subscribe(items => {
      this.items = items;
    }); 
  }

  logItem(item) {
    console.info('Log for item: '+ item.title);
    console.log(item);
  }


}
