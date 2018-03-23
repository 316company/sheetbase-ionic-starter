import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { NavProvider } from '../providers/nav/nav';
import { SpreadsheetProvider } from '../providers/spreadsheet/spreadsheet';
import { StorageProvider } from '../providers/storage/storage';
import { CacheProvider } from '../providers/cache/cache';
import { MetaProvider } from '../providers/meta/meta';
import { ConnectionProvider } from '../providers/connection/connection';
import { DataProvider } from '../providers/data/data';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      // locationStrategy: 'path'
    }),
    IonicStorageModule.forRoot({
      name: 'thuviencodoc.net',
      driverOrder: ['localstorage', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    // {provide: APP_BASE_HREF, useValue: '/'},

    NavProvider,
    SpreadsheetProvider,
    StorageProvider,
    CacheProvider,
    MetaProvider,
    ConnectionProvider,
    DataProvider
  ]
})
export class AppModule {}
