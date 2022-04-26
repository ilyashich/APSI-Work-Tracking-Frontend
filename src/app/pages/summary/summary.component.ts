import { Component, OnInit } from '@angular/core';
import { data } from './datasource';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
  })
export class SummaryComponent implements OnInit {

  public data: object[];
  public pageSettings: PageSettingsModel;

  constructor() {
    this.data = data;
    this.pageSettings = { pageSize: 6 };
  }

  ngOnInit(): void {
      this.data = data;
      this.pageSettings = { pageSize: 6 };
  }
}