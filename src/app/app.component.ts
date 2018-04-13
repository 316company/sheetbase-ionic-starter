import { Component } from '@angular/core';

import { SheetbaseService as SheetbaseProvider } from '../modules/sheetbase/services/sheetbase.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = 'HomePage';

  constructor(
    private sheetbase: SheetbaseProvider
  ) {
  }
  
  ngOnInit() {
    this.sheetbase.init();
  }

}

