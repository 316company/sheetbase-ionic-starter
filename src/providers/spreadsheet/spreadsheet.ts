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

  getSheet(db: any, type: string = null): Promise<any> {
    return new Promise((resolve, reject) => {
      if(db.range.indexOf(',') < 0) {
        this.get(db.id, db.range)
        .then(value => this.ngZone.run(() => {
          if(type) {
            resolve(this.modifyValue(value, type));
          } else {
            resolve(value);
          }
        }))
        .catch(reject);
      } else {
        let rangeStr = '';
        ((db.range.split(',')).map(x => {return x.trim()})||[]).forEach(range => {
          rangeStr += '&ranges='+ range;
        });
        this.batchGet(db.id, rangeStr)
        .then(value => this.ngZone.run(() => {
          if(type) {
            resolve(this.modifyValue(value, type));
          } else {
            resolve(value);
          }
        }))
        .catch(reject);
      }
    });
  }



  /*
  *
  */
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
  *
  */
  private modifyValue(value: any, type: string): any {
    let customModifier = CONFIG.modifiers[type] || function (value, tools: any = null) { return value; };

    let items = {};
    value.forEach(item => {

      for(let key in item) {
        // transform JSON where possible
        try {
          item[key] = JSON.parse(item[key]);
        } catch(e) {}

        // delete null key
        if(item[key] === '' || item[key] === null || item[key] === undefined) {
          delete item[key];
        }
      }

      // custom modifier
      item = customModifier(item);

      // transform array to object
      let $key = item.key; delete item.key;
      items[$key] = item;
    });
    return items;
  }
  

  
  private transformValue(value) {
    let items = [],
      headers = value[0] || [];

    (value.slice(1, value.length) || []).forEach(rows => {
      let item: any = {};
      for (let i = 0; i < rows.length; i++) {
        if(rows[i]) {
          let val: any = rows[i];
          if(!isNaN(val) && Number(val) % 1 === 0) {
            val = parseInt(val);
          }
          if(!isNaN(val) && Number(val) % 1 !== 0) {
            val = parseFloat(val);
          }
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

}
