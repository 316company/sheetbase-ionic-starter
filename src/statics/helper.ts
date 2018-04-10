import { Observable } from 'rxjs';
import { Response, Headers } from '@angular/http';

import { orderBy } from 'lodash';
import md5 from 'blueimp-md5';
import encUtf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import sha256 from 'crypto-js/sha256';

export const HELPER =  {

  noMark: (str = '') => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
  },

  noDash: (str = '') => {
    str = str.replace(/\-|\_/g, '');
    return str;
  },

  dashToSpace: (str = '') => {
    str = str.replace(/\-|\_/g, ' ');
    return str;
  },

  o2a: (object: {[$key: string]: any}, clone: boolean = false, limit: number = null, honorable: boolean = false): any => {
    if(clone && object !== undefined) {
      object = JSON.parse(JSON.stringify(object));
    }
    let array = [];
    for(let key in object) {
      if(typeof object[key] === 'object') {
        object[key]['$key'] = key;
      } else {
        object[key] = {
          $key: key,
          value: object[key]
        };
      }
      array.push(object[key]);
    }
    if(limit) {
      array.splice(limit, array.length);
    }
    if(honorable && array.length < 1) {
      array = null;
    }
    return array;
  },

  sort: (value: any[], key: string = '$key', order: string = 'desc') => {
    return orderBy(value, [key], [order]);
  }

}
