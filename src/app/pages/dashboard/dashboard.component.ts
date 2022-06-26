import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActionEventArgs, CommandClickEventArgs, CommandModel, DetailRowService, EditSettingsModel, GridComponent, GridModel, PageEventArgs, PageSettingsModel, valueAccessor, ToolbarItems, Column, IEditCell } from '@syncfusion/ej2-angular-grids';
import { FilterSettingsModel, IFilter } from '@syncfusion/ej2-angular-grids';
import { CommonService } from 'src/app/_services/common.service';
import { ContextProvider } from 'src/app/_services/context.provider';
import { RestApiService } from 'src/app/_services/rest_api.service';
import { saveAs } from 'file-saver';
import { Internationalization } from  '@syncfusion/ej2-base';  
import { User } from 'src/app/_models/user';
import { data } from './datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth-service';
import { L10n } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Problem } from 'src/app/_models/problem';
import { Task } from 'src/app/_models/task';
import { Project } from 'src/app/_models/project';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePl from "@angular/common/locales/pl";
registerLocaleData(localePl, "pl");

L10n.load({
  'en-US': {
      grid: {
          'SaveButton': 'Dodaj',
          'CancelButton': 'Anuluj'
      }
  }
});

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
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];
  public dateParams: IEditCell;
  public timeParams: IEditCell;
  public typeParams: IEditCell;
  //------------------------------------------------
  users: User[] = [];
  apiContextsData: {};
  page: number = 0;
  selectedContext: string = 'ALL';
  showDetails: boolean;
  private sub: any;
  id: string;
  jobsFromProjects: boolean;
  lastProjectId: string;
  lastTaskId: string;
  showDialog: boolean = false;
  userRole: string;
  //------------------------------------------------
  public commands: CommandModel[];
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('jobForm') jobForm: FormGroup;
  public dateValue: Date = new Date();
  public problems: Problem[];
  public tasks: Task[];
  public projects: Project[];
  //------------------------------------------------
  requestForm = new FormGroup({
    reason: new FormControl('', Validators.required),
  });

  public types: object[] = [
    { typeName: '', typeValue: null },
    { typeName: 'Dokument', typeValue: 'DOCUMENT' },
    { typeName: 'Problem', typeValue: 'PROBLEM' }
];

  constructor(
    private commonService: CommonService,
    private restApiService: RestApiService,
    private contextProvider: ContextProvider,
    private route: ActivatedRoute,
    private auth: AuthService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.userRole = this.auth.userData.role;
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.selectedContext = apiContext;
    });
    // -------------------------------------------------------------------------
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.data = null;
      this._getData();
    });
    // -------------------------------------------------------------------------
    this.pageSettings = {pageSizes: ['5', '10', '15', '20', '30', '50', '100', '500', '1000'], pageSize: 20 };
    this.filterOptions = {
      type: 'Menu'
    };
    this.filter = {
        type: 'CheckBox'
    };
    this.editSettings = { allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Dialog' };
    this.toolbar = ['Add'];
    this.timeParams = { params: { decimals: 1, value: 1 } };
    this.dateParams = { params: {value: new Date() } };
    this.typeParams = {
      params: {
          dataSource: new DataManager(this.types),
          fields: { text: 'typeName', value: 'typeValue' },
          query: new Query(),
          actionComplete: () => false,
      }
    };
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('problems'),
        this, {}, (data, additions, self) => {
          self.problems = data;
        }, (error, errorAction) => {
          // empty
        });
    });
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('tasks'),
        this, {}, (data, additions, self) => {
          self.tasks = data;
        }, (error, errorAction) => {
          // empty
        });
    });
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('projects'),
        this, {}, (data, additions, self) => {
          self.projects = data;
        }, (error, errorAction) => {
          // empty
        });
    });
  }

  _getData() {
    this.spinner.show();
    if (this.id.includes('details')) {
      this.showDetails = true;
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.commonService.handleIncommingApiData(this.restApiService.get_details(this.id, this.lastProjectId, this.lastTaskId),
          this, {}, (data, additions, self) => {
            self.selectedData = data;
            if (self.selectedData.date) {
              self.selectedData.date = formatDate(self.selectedData.date, 'dd/MM/yyyy HH:mm', 'pl');
            }
            if (this.id == 'project_details') {
              self.data = data.tasks;
            }
            if (this.id == 'task_details') {
              self.data = data.jobs;
            }
            this.spinner.hide();
          }, (error, errorAction) => {
            this.spinner.hide();
            // empty
          });
      });
    } else {
      this.showDetails = false;
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.commonService.handleIncommingApiData(this.restApiService.get_data(this.id),
          this, {}, (data, additions, self) => {
            self.data = data;
            this.spinner.hide();
          }, (error, errorAction) => {
            this.spinner.hide();
            // empty
          });
      });
    }
  }

  pageChangeEvent() {
    
  }

  back() {
    switch (this.id) {
      case 'employee_details':
        this.id = 'employees';
        break;

      case 'project_details':
        this.id = 'projects';
        break;

      case 'task_details':
        this.id = 'project_details';
        break;

      case 'job_details':
        if (this.jobsFromProjects) {
          this.id = 'task_details';
        } else {
          this.id = 'jobs';
        }
        break;

      case 'problem_details':
        this.id = 'problems';
        break;
    }
    this._getData();
  }

  recordClick(e: any) {
    this.selectedData = e.rowData;
    this.showDetails = true;
    this.data = null;
    switch (this.id) {
      case 'projects':
        this.data = this.selectedData.tasks;
        this.lastProjectId = this.selectedData.projectId;
        this.id = 'project_details';
        break;

      case 'project_details':
        this.data = this.selectedData.jobs;
        this.lastTaskId = this.selectedData.taskId;
        this.id = 'task_details';
        break;

      case 'task_details':
        this.id = 'job_details';
        this.jobsFromProjects = true;
        break;

      case 'employees':
        this.id = 'employee_details';
        break;

      case 'problems':
        this.id = 'problem_details';
        break;

      case 'jobs':
        this.id = 'job_details';
        this.jobsFromProjects = false;
        break;
    }
  }

  actionBegin(args) {
    if ((args.requestType === 'save')) {
      var req = {
        'name': this.jobForm.value.name,
        'description': this.jobForm.value.description,
        'time': this.jobForm.value.time,
        'date': this.jobForm.value.date,
        'type': this.jobForm.value.type,
        'problem': {
          'problemId': this.jobForm.value.problemId ? this.jobForm.value.problemId : null
        },
        'documentUrl': this.jobForm.value.documentUrl ? this.jobForm.value.documentUrl : null,
        'user': {
          'id': this.auth.userData.id
        },
        'task': {
          'taskId': this.jobForm.value.task,
        }
      };
      console.log(req)
      this.spinner.show();
      this.contextProvider.getApiContext().subscribe((apiContext) => {
        this.commonService.handleIncommingApiData(this.restApiService.job_create(req),
          this, {}, (data, additions, self) => {
            this._getData();
            this.spinner.hide();
          }, (error, errorAction) => {
            this.spinner.hide();
            // empty
          });
      });
    }
  }

  actionComplete(args) {
    if ((args.requestType === 'add')) {
        const dialog = args.dialog;
        dialog.showCloseIcon = false;
        dialog.height = 600;
        dialog.width = 400;
        // change the header of the dialog
        dialog.header = 'Dodaj czynność';
        console.log('sdsdsw')
    }
  }

  job_accept(id: string) {
    this.spinner.show();
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.job_accept(this.selectedData.jobId),
        this, {}, (data, additions, self) => {
          self.selectedData.state = 'ACCEPTED';
          this.spinner.hide();
        }, (error, errorAction) => {
          this.spinner.hide();
          // empty
        });
    });
  }

  job_reject(id: string) {
    this.spinner.show();
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.job_reject(this.selectedData.jobId, this.requestForm.value.reason),
        this, {}, (data, additions, self) => {
          this.ejDialog.hide();
          self.selectedData.state = 'REJECTED';
          self.selectedData.rejectionReason = this.requestForm.value.reason;
          this.spinner.hide();
        }, (error, errorAction) => {
          this.spinner.hide();
          // empty
        });
    });
  }

  onOpenDialog() {
    this.showDialog = true;
  };

  onOverlayClick() {
    this.showDialog = false;
    this.ejDialog.hide();
  }

  get reason() { return this.requestForm.get('reason'); }

  getError(el) {
    switch (el) {
      case 'reason':
        if (this.requestForm.get('reason').hasError('required')) {
          return 'Powód jest wymagany';
        }
        break;
      default:
        return '';
    }
  }
}