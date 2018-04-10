import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { MyApp } from './app.component';

import { NavProvider } from '../providers/nav/nav';
import { MetaProvider } from '../providers/meta/meta';
import { SpreadsheetProvider } from '../providers/spreadsheet/spreadsheet';
import { SheetbaseProvider } from '../providers/sheetbase/sheetbase';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      // locationStrategy: 'path',
      backButtonText: '',
      pageTransition: 'wp-transition'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    // {provide: APP_BASE_HREF, useValue: '/'},

    NavProvider,
    MetaProvider,
    SpreadsheetProvider,
    SheetbaseProvider
  ]
})
export class AppModule {}
