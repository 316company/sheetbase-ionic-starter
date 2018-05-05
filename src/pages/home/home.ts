import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { DataService as DataProvider } from 'sheetbase-angular';

import { NavProvider } from '../../providers/nav/nav';
import { MetaProvider } from '../../providers/meta/meta';


@IonicPage({
  segment: 'app'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tableName: string;
  items: any[];

  tables: string[];

  constructor(
    private sheetbaseData: DataProvider,
    
    private nav: NavProvider,
    private meta: MetaProvider
  ) {
    this.tables = [];
  }

  ionViewDidLoad() {
    this.meta.set({
      title: 'Sheetbase App'
    });
  }

  ngOnInit() {
    this.itemsByTable('foo');
  }

  itemsByTable(tableName: string = null) {
    if(tableName) this.tableName = tableName;
    if(!this.tableName) return;

    this.sheetbaseData.get(
      this.tableName, null, {
      limitToFirst: 100
    }).then(items => {
      this.items = items;

      // record previous loaded tables
      if(this.tables.indexOf(this.tableName) < 0) {
        this.tables.push(this.tableName);
      }
    }).catch(error => {
      console.error(error);
    });
  }

  logItem(item) {
    console.info('Log for item: '+ item.title);
    console.log(item);
  }


}
