import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { DataService } from 'sheetbase-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  tableName: string;
  items: any[];

  tables: string[] = [];

  constructor(
    private alertCtrl: AlertController,

    private sheetbaseData: DataService
  ) {}

  ngOnInit() {
    this.itemsByTable('foo');
  }

  itemsByTable(tableName: string = null) {
    if (tableName) { this.tableName = tableName; }
    if (!this.tableName) { return; }

    this.sheetbaseData.get(
      this.tableName, null, {
      limitToFirst: 100
    }).subscribe(items => {
      this.items = items;

      // record previous loaded tables
      if (this.tables.indexOf(this.tableName) < 0) {
        this.tables.push(this.tableName);
      }
    }, async error => {
      console.error(error);

      const alert = await this.alertCtrl.create({
        header: 'Data',
        message: `
          Errors getting data for table name "<strong>${this.tableName}</strong>".
          <ul>
            <li>${error.meta.message}</li>
          </ul>
        `,
        buttons: ['OK']
      });
      await alert.present();
    });
  }

  logItem(item) {
    console.log('Log for item: ' + item.title);
    console.log(item);
  }

}
