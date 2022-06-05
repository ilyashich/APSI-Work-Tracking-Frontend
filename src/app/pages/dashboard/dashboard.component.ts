import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActionEventArgs, CommandClickEventArgs, CommandModel, DetailRowService, EditSettingsModel, GridComponent, GridModel, PageEventArgs, PageSettingsModel, valueAccessor, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, IFilter } from '@syncfusion/ej2-angular-grids';
import { CommonService } from 'src/app/_services/common.service';
import { ContextProvider } from 'src/app/_services/context.provider';
import { RestApiService } from 'src/app/_services/rest_api.service';
import { saveAs } from 'file-saver';
import { Internationalization } from  '@syncfusion/ej2-base';  
import { User } from 'src/app/_models/user';
import { data } from './datasource';
import { ActivatedRoute } from '@angular/router';

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
  public data: any[];
  public selectedData: any;
  //------------------------------------------------
  users: User[] = [];
  apiContextsData: {};
  page: number = 0;
  selectedContext: string = 'ALL';
  showDetails: boolean;
  private sub: any;
  id: string;
  //------------------------------------------------
  public commands: CommandModel[];
  @ViewChild('grid') public grid: GridComponent;

  constructor(
    private commonService: CommonService,
    private restApiService: RestApiService,
    private contextProvider: ContextProvider,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.selectedContext = apiContext;
    });
    // -------------------------------------------------------------------------
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.showDetails = false;
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.commonService.handleIncommingApiData(this.restApiService.get_data(params['id']),
          this, {}, (data, additions, self) => {
            self.data = data;
          }, (error, errorAction) => {
            // empty
          });
      });
    });
    // -------------------------------------------------------------------------
    this.pageSettings = {pageSizes: ['5', '10', '15', '20', '30', '50', '100', '500', '1000'], pageSize: 20 };
    this.filterOptions = {
      type: 'Menu'
    };
    this.filter = {
        type: 'CheckBox'
    };
  }

  pageChangeEvent() {
    
  }

  recordClick(e: any) {
    this.selectedData = e.rowData;
    this.showDetails = true;
    switch (this.id) {
      case 'projects':
        this.data = this.selectedData.tasks;
        this.id = 'tasks';
        break;

      case 'tasks':
        this.data = this.selectedData.jobs;
        this.id = 'jobs';
        break;
    }
  }

  actionComplete(args: ActionEventArgs): void {
    if(JSON.stringify(args.requestType) == '"paging"'){
      this.pageChangeEvent();
    }
  }
}