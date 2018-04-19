import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { SheetbaseService as SheetbaseProvider } from 'sheetbase-angular';

import { NavProvider } from '../../providers/nav/nav';
import { MetaProvider } from '../../providers/meta/meta';

import { SHEETBASE_CONFIG } from '../../configs/sheetbase.config';

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

  databaseId: string;

  tables: string[];

  constructor(
    private sheetbase: SheetbaseProvider,
    
    private nav: NavProvider,
    private meta: MetaProvider
  ) {
    this.databaseId = SHEETBASE_CONFIG.database || '404';
    this.tables = [];
  }

  ionViewDidLoad() {
    this.meta.set({
      title: 'Sheetbase App'
    });
  }

  ngOnInit() {
    this.itemsByTable('posts');
  }

  itemsByTable(tableName: string = null) {
    if(tableName) this.tableName = tableName;
    if(!this.tableName) return;

    this.sheetbase.get(
      this.tableName, null, {
      limitToFirst: 100
    }).subscribe(items => {
      this.items = items;

      // record previous loaded tables
      if(this.tables.indexOf(this.tableName) < 0) {
        this.tables.push(this.tableName);
      }
    });
  }

  logItem(item) {
    console.info('Log for item: '+ item.title);
    console.log(item);
  }


}
