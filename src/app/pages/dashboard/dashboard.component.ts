import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { RestApiService } from 'src/app/services/rest_api_service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  page: number = 0;
  size: number = 10;
  users: User[] = [];

  constructor(
    private commonService: CommonService,
    private restApiService: RestApiService,
  ) { }

  ngOnInit(): void {
    this.commonService.handleIncommingApiData(
      this.restApiService.get_persons(), this, {}, (data: any) => {
        console.log(data['content']);
        // -----------
      }, (error: any, errorAction: any) => {
        // empty
      });
  }

}
