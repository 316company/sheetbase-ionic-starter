import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';

import { SpreadsheetProvider } from '../spreadsheet/spreadsheet';

import { CONFIG } from '../../config';
import { HELPER } from '../../statics/helper';

interface IDataQuery {
  limitToFirst?: number
  limitToLast?: number,
  offset?: number,

  orderByKey?: string,
  equalTo?: any,
  order?: string
}

interface ITable {
  name: string,
  range?: string,
  autoload?: boolean,
  key?: string
}

@Injectable()
export class SheetbaseProvider {

  private database: {
    [collection: string]: any
  };

  private tables: ITable[];
  private dataOnTheFly: string[];

  constructor(
    private events: Events,

    private spreadsheet: SpreadsheetProvider
  ) {

    // default tables
    this.tables = [
      {name: 'categories'},
      {name: 'tags'},
      {name: 'authors'},
      {name: 'posts'},
      {name: 'pages'}
    ];

  }

  dbID(): string {
    return CONFIG.database;
  }
  dbTables(): ITable[] {
    return this.tables || [];
  }


  // get the autoload data
  init(): any {
    this.spreadsheet.getSheet({
      id: CONFIG.database,
      range: '__tables__!A1:C'
    }, null, 'name', false)
    .then(tables => {
      this.tables = tables;
      this.getRemoteData();
    })
    .catch(error => {
      this.getRemoteData();
    });
  }

  get(
    collection: string,
    doc: string = null,
    query: IDataQuery = null,
    oneTime: boolean = false
  ): Observable<any> {

    return new Observable(observer => {
      this.database = this.database || {};
      let itemsObject = this.database[collection] || {};

      // non-autoload table, load now
      if(!itemsObject || Object.keys(itemsObject).length < 1) {
        let thisTable = null; (this.tables || []).forEach(table => { if(table.name === collection) thisTable = table });
        if(thisTable) this.getRemoteData([thisTable]);
      }

      // return current whatever data
      if(doc) {
        observer.next(Object.assign({
          $key: doc
        }, itemsObject[doc] || {}));
        
        // event
        if(oneTime) {
          observer.complete();
        } else {
          // listen for change
          this.events.subscribe('appData:'+ collection, eventData => {
            observer.next(Object.assign({
              $key: doc
            }, eventData[doc] || {}));
          });
        }
      } else {
        let itemsArray = [];
        for(let key in itemsObject) {
          itemsArray.push(Object.assign({
            $key: key
          }, itemsObject[key]));
        }        

        observer.next(
          this.filterResult(itemsArray, query)
        );

        // event
        if(oneTime) {
          observer.complete();
        } else {
          // listen for change
          this.events.subscribe('appData:'+ collection, eventData => {
            delete eventData.$key;
            observer.next(
              this.filterResult(
                HELPER.o2a(eventData, true), query
              )
            );
          });
        }
      }
    });

  }




  // search(items: any[], keyword: string, fields: string[] = null) {
  //   let find = (item, keyword) => {
  //     let againstString = item.title || item.name;
  //     (fields||[]).forEach(field => {
  //       if(!item[field]) return;
  //       if(item[field] instanceof Object) return againstString += ' // '+ (JSON.stringify(item[field])).replace(/\{/gi, '').replace(/\"\}/gi, '').replace(/\{\"/gi, '').replace(/\"\:\"/gi, ' ').replace(/\"\,\"/gi, ' ').replace(/\"/gi, ''); 
  //       againstString += ' // '+ item[field];
  //     });
  //     againstString = againstString.toLowerCase();
  //     againstString = againstString +' // '+ HELPER.dashToSpace(againstString) +' // '+ HELPER.noDash(againstString);
  //     return againstString.indexOf(keyword.toLowerCase()) > -1;
  //   }

  //   return keyword ? (items || []).filter(item => { return find(item, HELPER.noMark(keyword)) }) : items;
  // }





  /*
  *
  * */
  private getRemoteData(tables: ITable[] = null): void {

    // get data
    (tables || this.tables || []).forEach(table => {
      if(!tables && !table.autoload) return;
      if((this.dataOnTheFly||[]).indexOf(table.name) > -1) return;

      console.info('GO FLY -> '+ table.name +'[]');

      // record data on the fly to avoid unneccesary actions
      this.dataOnTheFly = this.dataOnTheFly || [];
      this.dataOnTheFly.push(table.name);

      // go fly
      setTimeout(() => {
        this.spreadsheet.getSheet({
          id: CONFIG.database,
          range: table.name +'!'+ (table.range || 'A1:ZZ')
        }, table.name, table.key)
        .then(data => {
          this.database = this.database || {}; 
          this.database[table.name] = data;

          // notify the event
          this.events.publish('appData:'+ table.name, data);

          // remove data on the fly recorder
          this.dataOnTheFly.splice(this.dataOnTheFly.indexOf('table.name'), 1);
        }).catch(error => { return });
      }, 100);

    });

  }

  private filterResult(items: any[], query: IDataQuery) {
    query = query || {};
    let resultItems = [];

    // filter
    if(
      query.orderByKey &&
      (query.equalTo || (!query.equalTo && typeof query.equalTo === 'boolean'))
    ) {
      let keys = (query.orderByKey).split('/');
      let keyFirst = keys[0];
      keys = keys.slice(1, keys.length);

      (items||[]).forEach(item => {
        let value = item[keyFirst] || {};
        // console.log(''+ item.title +' ', value, keys);

        (keys||[]).forEach(key => {
          if(value[key]) {
            value = value[key];
          } else {
            return value = null;
          }
        });

        // console.log('final value ', value);
        if(
          (typeof query.equalTo === 'boolean' && typeof value === 'boolean' && value === query.equalTo) || // true === true
          (query.equalTo === '!null' && !!value) || // any (#false) === '!null'
          (typeof query.equalTo !== 'boolean' && typeof value !== 'boolean' && value === query.equalTo) // string, number === string, number
        ) resultItems.push(item);
      });
    } else {
      resultItems = items;
    }

    // sort result
    resultItems = HELPER.sort(resultItems, (query.orderByKey||'id'), (query.order||'asc'));
    
    // limit
    if(query.limitToFirst) resultItems = resultItems.slice(
      query.offset || 0,
      query.limitToFirst + (query.offset || 0)
    );
    if(query.limitToLast) resultItems = resultItems.slice(
      resultItems.length - query.limitToLast - (query.offset || 0),
      (resultItems.length - (query.offset || 0))
    );

    return resultItems;
  }

}
