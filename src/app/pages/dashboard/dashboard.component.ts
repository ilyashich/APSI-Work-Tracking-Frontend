import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionEventArgs, CommandClickEventArgs, CommandModel, DetailRowService, EditSettingsModel, GridComponent, GridModel, PageEventArgs, PageSettingsModel, valueAccessor } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, IFilter } from '@syncfusion/ej2-angular-grids';
import { Order } from 'src/app/_models/orders';
import { CommonService } from 'src/app/_services/common.service';
import { ContextProvider } from 'src/app/_services/context.provider';
import { RestApiService } from 'src/app/_services/rest_api.service';
import { saveAs } from 'file-saver';
import { Internationalization } from  '@syncfusion/ej2-base';  

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
  })
export class DashboardComponent implements OnInit {

  public pageSettings: PageSettingsModel;
  public filterOptions: FilterSettingsModel;
  public filter: IFilter;
  public intl: Internationalization = new Internationalization(); 
  public dateFormatter: Function = this.intl.getDateFormat({ type: 'datetime', format: "dd/MM/yyyy HH:mm"}); 
  //------------------------------------------------
  orders: Order[] = [];
  apiContextsData: {};
  page: number = 0;
  selectedContext: string = 'ALL';
  //------------------------------------------------
  public commands: CommandModel[];
  @ViewChild('grid') public grid: GridComponent;

  constructor(
    private commonService: CommonService,
    private restApiService: RestApiService,
    private contextProvider: ContextProvider
  ) {
  }

  ngOnInit(): void {
      this.pageSettings = {pageSizes: ['5', '10', '15', '20', '30', '50', '100', '500', '1000'], pageSize: 20 };
      this.filterOptions = {
        type: 'Menu'
      };
      this.filter = {
          type: 'CheckBox'
      };
      this.commands = [
        { buttonOption: { cssClass: 'e-flat', iconCss: 'e-icons e-update' }, title: 'Pobierz orginalny PDF'},
        { buttonOption: { cssClass: 'e-flat', iconCss: 'e-icons e-pdfexport' }, title: 'Pobierz tłumaczenie'}
      ];
      // -------------------------------------------------------------------------
      this.restApiService.get_contexts();
      // -------------------------------------------------------------------------
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.selectedContext = apiContext;
      });
      // -------------------------------------------------------------------------
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
        this.commonService.handleIncommingApiData(this.restApiService.switchContext(apiContext, this.page, this.pageSettings.pageSize),
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

  pageChangeEvent() {
    this.commonService.handleIncommingApiData(
      this.restApiService.get_orders(this.page, this.grid.pageSettings.pageSize), this, {}, (data, additions, self) => {
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

  public valueAccess = (field: string, data: object, column: object) => {  
    let value = new Date (data[field]);  
     // here we can return the formatted value 
        return this.dateFormatter(value); 
  }

  commandClick(args: CommandClickEventArgs): void {
    if (JSON.parse(JSON.stringify(args.commandColumn)).buttonOption.iconCss == 'e-icons e-update'){
      this.downloadDocument(JSON.parse(JSON.stringify(args.rowData)).uuid, JSON.parse(JSON.stringify(args.rowData)).dealerAccessUrl);
    } else if (JSON.parse(JSON.stringify(args.commandColumn)).buttonOption.iconCss == 'e-icons e-pdfexport') {
      this.translateDocument(JSON.parse(JSON.stringify(args.rowData)).uuid, JSON.parse(JSON.stringify(args.rowData)).dealerAccessUrl);
    }
  }

  actionComplete(args: ActionEventArgs): void {
    if(JSON.stringify(args.requestType) == '"paging"'){
      this.pageChangeEvent();
    }
  }
}