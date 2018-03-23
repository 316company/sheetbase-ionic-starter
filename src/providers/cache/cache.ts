import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StorageProvider } from '../storage/storage';
import { ConnectionProvider } from '../connection/connection';

import { HELPER } from '../../statics/helper';


@Injectable()
export class CacheProvider {

  data: any;

  constructor(
    private storage: StorageProvider,
    private connection: ConnectionProvider
  ) {
  }

  get(
    doc: string,
    expiredAction: Function,
    expired: number = 86400000,
    extendedCheck: Function = (timeThen, timeNow) => {return timeNow.getDate() !== timeThen.getDate()}
  ): Observable<any> { return new Observable(observer => {
    // console.log('Cache provider! For ', doc);

    // 1. in RAM
    if(!this.data) this.data = {};
    if(this.data[doc]) {
      observer.next(this.data[doc]);
      // console.log('in RAM', this.data[doc]);
    } else {
      this.storage.object(doc)
      .subscribe(localData => {
        // 2. in Localstorage
        if(Object.keys(localData.data||{}).length > 0) {
          this.data[doc] = HELPER.o2a(localData.data); // in RAM data
          observer.next(this.data[doc]);
          // console.log('in LocalStorage', this.data[doc]);
        }

        if(this.connection.online) {

          let timeThen: any = localData.timestamp ? new Date(localData.timestamp): new Date('2017-01-01T00:00:00.000Z');
          let timeNow: any = new Date();
  
          // expired
          if(Math.floor((timeNow-timeThen)/expired) > 0 || extendedCheck(timeThen, timeNow)) {
            expiredAction().subscribe(response => {
              let data = {};
              let timestamp = (new Date()).toISOString();
              (response.remoteData.hits.hits||[]).forEach(item => { data[item._id] = item._source });
  
              let updates = {};
              updates[doc] = {
                timestamp: timestamp,
                description: response.description,
                data: data
              };
  
              this.storage.update(updates)
              .catch(error => {
                // if cannot save to localstorage, then save in RAM only
                this.data[doc] = HELPER.o2a(data);
              });
              // console.log('Cache invalid! New data ', data);          
            }, error => {
              console.error('error ', error);
              observer.next([]);
            });
          }

        } else {
          if(Object.keys(localData.data||{}).length < 1) observer.next([]);
        }
        
      });
    }
  })}

}
