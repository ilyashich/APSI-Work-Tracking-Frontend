import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

import { CommonService } from '../../@services/common.service';
import { RestApiService } from '../../@services/rest_api.service';
import { Order } from '../../@models/orders';
import { ContextProvider } from '../../@services/context.provider';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  page: number = 0;
  size: number = 10;
  orders: Order[] = [];
  apiContextsData: {};

  constructor(
    private commonService: CommonService,
    private restApiService: RestApiService,
    private contextProvider: ContextProvider,
  ) { }

  ngOnInit(): void {
    this.contextProvider.getApiContextsById().subscribe((apiContextsById) => {
      this.apiContextsData = apiContextsById;
      if (this.orders) {
        for (let index = 0; index < this.orders.length; index++) {
          const order = this.orders[index];
          order.dealerAccessUrl = this.apiContextsData[order.dealerIdentity];
        }
      }
    });
    // -------------------------------------------------------------------------
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.page = 0;
      this.commonService.handleIncommingApiData(this.restApiService.switchContext(apiContext, this.page, this.size),
        this, {}, (data, additions, self) => {
          self.orders = data['content'];
          // -----------
          if (self.apiContextsData) {
            for (let index = 0; index < self.orders.length; index++) {
              const order = self.orders[index];
              order.dealerAccessUrl = self.apiContextsData[order.dealerIdentity];
            }
          }
        }, (error, errorAction) => {
          // empty
        });
    });
  }

  pageChangeEvent(event) {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.commonService.handleIncommingApiData(
      this.restApiService.get_orders(this.page, this.size), this, {}, (data, additions, self) => {
        self.orders = data['content'];
        // -----------
        if (self.apiContextsData) {
          for (let index = 0; index < self.orders.length; index++) {
            const order = self.orders[index];
            order.dealerAccessUrl = self.apiContextsData[order.dealerIdentity];
          }
        }
      }, (error, errorAction) => {
        // empty
      });
  }

  downloadDocument(documentId: string, dealerAccessUrl: string) {
    this.commonService.handleIncommingApiData(
      this.restApiService.get_downloadFile(documentId, dealerAccessUrl), this, {}, (data, additions, self) => {
        if (data) {
          saveAs(data, documentId + '.pdf');
        }
      }, (error, errorAction) => {
        // empty
      });
  }

  translateDocument(documentId: string, dealerAccessUrl: string) {
    this.commonService.handleIncommingApiData(
      this.restApiService.put_downloadTranslatedOrder(documentId, 'pl', dealerAccessUrl), this, {}, (data, additions, self) => {
        if (data) {
          saveAs(data, documentId + '.pdf');
        }
      }, (error, errorAction) => {
        // empty
      });
  }

}
