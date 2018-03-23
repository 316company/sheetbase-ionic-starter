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

  stripTags: (str = '', removeByClass = []) => {
    let container = document.createElement('DIV');
    container.innerHTML = str;
    if(removeByClass) {
      removeByClass.forEach(cls => {
        let elements = container.getElementsByClassName(cls);
        while (elements[0]) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });
    }
    return container.textContent || container.innerText || '';
  },

  pushId: (): string => {
    let PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    let lastPushTime = 0;
    let lastRandChars = [];
    let now = new Date().getTime();
    let duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    let timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.');
    let id = timeStampChars.join('');
    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if(id.length != 20) throw new Error('Length should be 20.');
    return id;
  },

  orderId: (time: any): string => {
    return HELPER.idFromDate(time) + HELPER.getRandomInt(100, 999);
  },

  getRandomInt: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  readableTime: (time: any): string => {
    time = new Date(time);
    let year = time.getFullYear(),
      month = (time.getMonth()+1) < 10 ? '0'+ (time.getMonth()+1): (time.getMonth()+1),
      date = time.getDate() < 10 ? '0'+ time.getDate(): time.getDate(),
      hour = time.getHours() < 10 ? '0'+ time.getHours(): time.getHours(),
      minute = time.getMinutes() < 10 ? '0'+ time.getMinutes(): time.getMinutes();
    return date +'-'+ month +'-'+ year +' '+ hour +':'+ minute;
  },

  idFromDate: (time: any, reverse: boolean = false): string => {
    time = new Date(time);
    let year = (time.getFullYear() +'').substr(2,2),
      month = (time.getMonth()+1) < 10 ? '0'+ (time.getMonth()+1): (time.getMonth()+1),
      date = time.getDate() < 10 ? '0'+ time.getDate(): time.getDate();
    return reverse ? (date + month + year): (year + month + date);
  },

  leadingZero: (number: number): string => {
    let output = ''+ number;
    if(number < 10) {
      output = '00'+ number;
    } else if(number < 100) {
      output = '0'+ number;
    }
    return output;
  },

  isNaN: (value): boolean => {
    return isNaN(value);
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
  },

  gravatar: (str) => {
    let hash = md5(str);
    return 'https://www.gravatar.com/avatar/'+ hash +'?d=retro&s=250';
  },

  md5: (str) => {
    return md5(str);
  },

  sha256: (str) => {
    return sha256(str);
  },


  difference: (one: any = {}, two: any = {}): any => {
    let oneArr = [];
    for (let key in one) {
      oneArr.push(key);
    }
    let twoArr = [];
    for (let key in two) {
      twoArr.push(key);
    }
    return {
      one: oneArr,
      two: twoArr,
      difference: twoArr.filter(x => oneArr.indexOf(x) < 0 )
    };
  },


  filter: (items: any[], keyword: string, fields: string[] = ['$key']): any[] => {
    function buildString(str) {
      return str +' '+ HELPER.dashToSpace(str) +' '+ HELPER.noDash(str);
    }

    function find(item, keyword) {
      return (buildString(item.$key)).indexOf(keyword) !== -1;
    }

    return keyword ? (items || []).filter((item) => { return find(item, HELPER.noMark(keyword) ) }) : items;

  },




  /*
  * layout
  *
  *
  */
  layoutCheck: (sizeTop = 'sm', sizeBottom = 'xs'): Observable<any> => {
    let breakpoints = {
      none: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1000000000
    };

    return new Observable(observer => {
      function onResize() {
        if(window.innerWidth >= breakpoints[sizeBottom] && window.innerWidth < breakpoints[sizeTop]) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      }

      onResize();

      window.addEventListener('resize', function(event) {
        onResize();
      });
    });

  },

  layout: (): Observable<any> => {
    return new Observable(observer => {

      function onResize() {
        if(window.innerWidth >= 1201) {
          observer.next('xl');
        } else if(window.innerWidth >= 993 && window.innerWidth < 1200) {
          observer.next('lg');
        } else if(window.innerWidth >= 769 && window.innerWidth < 992) {
          observer.next('md');
        } else if(window.innerWidth >= 577 && window.innerWidth < 768) {
          observer.next('sm');
        }  else {
          observer.next('xs');
        }
      }

      onResize();

      window.addEventListener('resize', function(event) {
        onResize();
      });

    });

  },






  /*
  * object
  *
  *
  */
  removeEmpty: (obj: any): any => {
    Object.keys(obj).forEach(function(key) {
      if (obj[key] && typeof obj[key] === 'object') HELPER.removeEmpty(obj[key])
      else if (obj[key] === null) delete obj[key]
    });
    return obj;
  },




  /*
  * query params
  *
  *
  */
  getParameterByName: (name: string, url: string = null): string => {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },




  /*
  * pipes
  *
  *
  */

  // pipe | ago
  relativeTime: (value: any): string => {
    var rightNow: any = new Date();
    var then: any = new Date(value);

    var diff = rightNow - then;

    var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
    // week = day * 7;

    if (isNaN(diff) || diff < 0) {
      return 'n/a'; // return blank string if unknown
    }

    if (diff < second * 2) {
      // within 2 seconds
      return 'thức thì';
    }

    if (diff < minute) {
      return Math.floor(diff / second) + ' giây trước';
    }

    if (diff < minute * 2) {
      return 'khoảng 1 phút trước';
    }

    if (diff < hour) {
      return Math.floor(diff / minute) + ' phút trước';
    }

    if (diff < hour * 2) {
      return 'khoảng 1 giờ trước';
    }

    if (diff < day) {
      return  Math.floor(diff / hour) + ' giờ trước';
    }

    if (diff > day && diff < day * 2) {
      return 'hôm qua';
    }

    if (diff < day * 31) { // 365
      return Math.floor(diff / day) + ' ngày trước';
    }

    else {
      return 'hơn 1 tháng trước';
    }

  },

  // pipe | color
  colorCode: (value: string): string => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    let c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#'+ "00000".substring(0, 6 - c.length) + c;
  },

  // pipe | timer
  sencondsToMinutes: (secondsNumber: number = 0): string => {
    if(secondsNumber || secondsNumber === 0) {
      let minutes = Math.floor(secondsNumber / 60) || 0;
      let seconds = Math.floor(secondsNumber - minutes * 60) || 0;
      return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    } else {
      return '--:--';
    }
  },


  // pipe | concat
  concat: (value: any, fallback: string = '', char: string = ';'): string => {
    if(value instanceof Object) {
      let arr: string[] = [];
      for(let key in value) {
        arr.push(value[key]);
      }
      value = arr;
    }
    return (value || [fallback]).join(char +' ');
  },


}
