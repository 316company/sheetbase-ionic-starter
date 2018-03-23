import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SpreadsheetProvider } from '../spreadsheet/spreadsheet';
import { StorageProvider } from '../storage/storage';

import { CONFIG } from '../../config';

@Injectable()
export class DataProvider {

  constructor(
    private spreadsheet: SpreadsheetProvider,
    private storage: StorageProvider
  ) {
  }

  private getRemoteData(tables: any[] = null): void {

    // falback tables
    if(!tables || tables.length < 1) {
      tables = [
        {name: 'tax:categories'},
        {name: 'tax:tags'},
        {name: 'posts'},
        {name: 'pages'}
      ];
    }

    // get data
    (tables || []).forEach(table => {  
      this.spreadsheet.getSheet({
        id: CONFIG.database,
        range: table.name +'!'+ (table.range || 'A1:ZZ')
      })
      .then(array => {
        let object = {};
        (array || []).forEach(item => {
          object[item.slug] = item;
        });

        let updates = {};
        updates[table.name] = object;
        this.storage.update(updates);
      })
      .catch(error => {
        return;
      });
    });

  }

  init(): any {

    this.storage.object('__meta', true)
    .subscribe(meta => {
      
      let timeThen: any = new Date(meta.dbCacheTimestamp || '2017-01-01T00:00:00.000Z');
      let timeNow: any = new Date();

      // expired      
      if(Math.floor((timeNow-timeThen)/(CONFIG.cacheTime*60*60*1000)) > 0) {
        console.log('Cache expired!');
      
        // 1: get the data
        this.spreadsheet.getSheet({
          id: CONFIG.database,
          range: '__tables__!A1:B'
        })
        .then(tables => {
          console.log(tables);          
          this.getRemoteData(tables);
        })
        .catch(error => {
          this.getRemoteData();
        });

        // 2: update meta timestamp
        let updates = {};
        updates['__meta/dbCacheTimestamp'] = (new Date()).toISOString();
        this.storage.update(updates);
      }
    });


  }


  get(
    collection: string,
    doc: string = null,
    oneTime: boolean = false
  ): Observable<any> {
    if(doc) return this.storage.object(collection +'/'+ doc, oneTime);
    return this.storage.list(collection, oneTime);
  }

}
