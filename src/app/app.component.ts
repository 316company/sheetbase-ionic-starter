import { Component } from '@angular/core';

import { HomePage } from '../pages/home/home';

import { DataProvider } from '../providers/data/data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomePage;

  constructor(
    private data: DataProvider
  ) {

    // get all the data from Spreadsheet
    this.data.init();

  }

}

