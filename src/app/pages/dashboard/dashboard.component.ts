import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionEventArgs, CommandClickEventArgs, CommandModel, DetailRowService, EditSettingsModel, GridComponent, GridModel, PageEventArgs, PageSettingsModel, valueAccessor } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, IFilter } from '@syncfusion/ej2-angular-grids';
import { CommonService } from 'src/app/_services/common.service';
import { ContextProvider } from 'src/app/_services/context.provider';
import { RestApiService } from 'src/app/_services/rest_api.service';
import { saveAs } from 'file-saver';
import { Internationalization } from  '@syncfusion/ej2-base';  
import { User } from 'src/app/_models/user';

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
  users: User[] = [];
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
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.selectedContext = apiContext;
      });
      // -------------------------------------------------------------------------
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.commonService.handleIncommingApiData(this.restApiService.get_users(),
          this, {}, (data, additions, self) => {
            self.users = data;
          }, (error, errorAction) => {
            // empty
          });
      });
  }

  pageChangeEvent() {

  }

  downloadDocument(documentId: string, dealerAccessUrl: string) {

  }

  translateDocument(documentId: string, dealerAccessUrl: string) {

  }

  public valueAccess = (field: string, data: object, column: object) => {  
    let value = new Date (data[field]);  
     // here we can return the formatted value 
        return this.dateFormatter(value); 
  }

  commandClick(args: CommandClickEventArgs): void {

  }

  actionComplete(args: ActionEventArgs): void {
    if(JSON.stringify(args.requestType) == '"paging"'){
      this.pageChangeEvent();
    }
  }
}