import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CONFIG } from '../../config';




@Injectable()
export class SpreadsheetProvider {

  constructor(
    private ngZone: NgZone,
    private http: HttpClient
  ) {

  }

  getSheet(
    sheet: {id: string, range: string},
    dataType: string = null,
    keyField: string = null,
    returnObject: boolean = true
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if(sheet.range.indexOf(',') < 0) {
        this.get(sheet.id, sheet.range)
        .then(value => this.ngZone.run(() => {          
          resolve(this.modifyValue(value, dataType, keyField, returnObject));
        }))
        .catch(reject);
      } else {
        let rangeStr = '';
        ((sheet.range.split(',')).map(x => {return x.trim()})||[]).forEach(range => {
          rangeStr += '&ranges='+ range;
        });
        this.batchGet(sheet.id, rangeStr)
        .then(value => this.ngZone.run(() => {
          resolve(this.modifyValue(value, dataType, keyField, returnObject));
        }))
        .catch(reject);
      }
    });
  }



  /*
  * get raw data
  * */
  private get(id: string, range: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<{values: any}>
      (`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${CONFIG.apiKey}`)
      .subscribe(response => {
        resolve(this.transformValue(response.values));        
      }, reject);
    });
  }
  
  private batchGet(id: string, ranges: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<{valueRanges: any}>
      (`https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchGet?${ranges}&key=${CONFIG.apiKey}`)
      .subscribe(response => {
        resolve(this.transformBatchValue(response.valueRanges));        
      }, reject);
    });
  }




  /*
  * cook raw data
  * */
  private transformValue(value) {
    let items = [],
      headers = value[0] || [];

    (value.slice(1, value.length) || []).forEach(rows => {
      let item: any = {};
      for (let i = 0; i < rows.length; i++) {
        if(rows[i]) {
          let val: any = rows[i];
          item[headers[i]] = val;
        }
      }
      items.push(item);
    });

    return items;
  }

  private transformBatchValue(value) {
    // round 1
    let base = this.transformValue(value[0].values || []);
    let more = [];
    (value.slice(1, value.length) || []).forEach(item => {
      more.push(this.transformValue(item.values || []));
    });

    // round 2
    let final = [];
    (base || []).forEach(baseItem => {
      (more || []).forEach(moreList => {
        (moreList || []).forEach(moreItem => {
          if(baseItem.key === moreItem.key) {
            baseItem = Object.assign(baseItem, moreItem);
          }
        });
      });
      final.push(baseItem);
    });

    return final;
  }


  /*
  *
  * */
  private modifyValue(
    value: any,
    dataType: string,
    keyField: string,
    returnObject: boolean
  ): any {
    let customModifier = (item, tools: any = {}) => { return item };
    if(dataType && CONFIG.modifiers && CONFIG.modifiers[dataType]) customModifier = CONFIG.modifiers[dataType]; 

    let itemsObject = null;
    let itemsArray = null;
    (value||[]).forEach(item => {
      
      // basic modifier
      for(let key in item) {
        //transform JSON where possible
        try {
          item[key] = JSON.parse(item[key]);
        } catch(e) {}

        // transform number
        if(!isNaN(item[key]) && Number(item[key]) % 1 === 0) item[key] = parseInt(item[key]);
        if(!isNaN(item[key]) && Number(item[key]) % 1 !== 0) item[key] = parseFloat(item[key]);

        // transform boolean value
        if(typeof item[key] === 'string' || item[key] instanceof String) item[key] = ((item[key]).toLowerCase() === 'true') || ((item[key]).toLowerCase() === 'false' ? false : item[key]);

        // delete null key
        if(item[key] === '' || item[key] === null || item[key] === undefined) {
          delete item[key];
        }
      }

      // custom modifier
      item = customModifier(item, {/* tools to help modify data */});

      // transform array to object
      itemsObject = itemsObject || {};
      itemsObject[keyField ? item[keyField]: (item.key || item.slug || (''+ item.id))] = item;
      itemsArray = itemsArray || [];
      itemsArray.push(item);
    });
    
    return returnObject ? itemsObject: itemsArray;
  }

}
