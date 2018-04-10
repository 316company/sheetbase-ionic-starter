import { Component } from '@angular/core';

import { SheetbaseProvider } from '../providers/sheetbase/sheetbase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = 'HomePage';

  constructor(
    private sheetbase: SheetbaseProvider
  ) {

    // get all the data from Spreadsheet
    this.sheetbase.init();

  }

}

