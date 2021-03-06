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
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { CalendarJob } from 'src/app/_models/calendar_job';
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
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
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
  public projectManager: any[];
  public selectedData: any;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];
  public editSettings2: EditSettingsModel;
  public toolbar2: ToolbarItems[];
  public dateParams: IEditCell;
  public timeParams: IEditCell;
  public typeParams: IEditCell;
  //------------------------------------------------
  users: User[] = [];
  clients: User[] = [];
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
  projectRole: string = 'USER';
  //------------------------------------------------
  public commands: CommandModel[];
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('gridTest') public gridTest: GridComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('jobForm') jobForm: FormGroup;
  @ViewChild('projectForm') projectForm: FormGroup;
  @ViewChild('taskForm') taskForm: FormGroup;
  public dateValue: Date = new Date();
  public currentYear: number = this.dateValue.getFullYear();
  public currentMonth: number = this.dateValue.getMonth();
  public minDate: Object = new Date(this.currentYear, this.currentMonth, 1);
  public maxDate: Object =  new Date(this.currentYear, this.currentMonth+1, 7);
  public problems: Problem[];
  public tasks: Task[];
  public calendarJobs: CalendarJob[];
  public userParams: IEditCell;
  public roleParams: IEditCell;
  public dpParams: IEditCell;
  //------------------------------------------------
  requestForm = new FormGroup({
    reason: new FormControl('', Validators.required),
  });
  public eventSettings: EventSettingsModel;

  public types: object[] = [
    { typeName: '', typeValue: null },
    { typeName: 'Dokument', typeValue: 'DOCUMENT' },
    { typeName: 'Problem', typeValue: 'PROBLEM' }
];

public roles: object[] = [
  { typeName: 'Pracownik', typeValue: 'EMPLOYEE' },
  { typeName: 'Kierownik', typeValue: 'MANAGER' }
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
    this.editSettings2 = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
    this.toolbar2 = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
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
    this.roleParams = {
      params:   {
        dataSource: new DataManager(this.roles),
        fields: { text: 'typeName', value: 'typeValue' },
        query: new Query(),
        actionComplete: () => false,
      }
    };
    this.dpParams = { params: {value: new Date() } };
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('problems'),
        this, {}, (data, additions, self) => {
          self.problems = data;
        }, (error, errorAction) => {
          // empty
        });
    });
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('employees'),
        this, {}, (data, additions, self) => {
          self.users = [];
          data.forEach(personResponse => {
            self.users.push(new User(personResponse['id'], personResponse['username'], personResponse['name'] + ' ' + personResponse['surname'], personResponse['surname'], personResponse['role'], personResponse['rate']));
          });
          self.userParams = {
            params:   {
                dataSource: self.users,
                fields: {text:'name',value:'id'},
                query: new Query(),
                actionComplete: () => false
                }
            }
        }, (error, errorAction) => {
          // empty
        });
    });
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('clients'),
        this, {}, (data, additions, self) => {
          self.clients = [];
          data.forEach(personResponse => {
            self.clients.push(new User(personResponse['id'], personResponse['username'], personResponse['name'] + ' ' + personResponse['surname'], personResponse['surname'], personResponse['role'], personResponse['rate']));
          });
        }, (error, errorAction) => {
          // empty
        });
    });
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('project_tasks'),
        this, {}, (data, additions, self) => {
          self.tasks = data;
        }, (error, errorAction) => {
          // empty
        });
    });
    this.contextProvider.getApiContext().subscribe((apiContext) => {
      this.commonService.handleIncommingApiData(this.restApiService.get_data('calendar'),
        this, {}, (data, additions, self) => {
          self.calendarJobs = [];
          data.forEach(x => {
            if (x['startDate'] != null) {
              self.calendarJobs.push(new CalendarJob(x['jobId'], x['name'], x['time'], this.splitDate(x['startDate']), this.splitDate(x['endDate'])));
            }
          });
          self.eventSettings = { dataSource: self.calendarJobs };
        }, (error, errorAction) => {
          // empty
        });
    });
  }

  splitDate(date: string) {
    var res = [];
    res.push(Number(date.split('-')[0]));
    res.push(Number(date.split('-')[1]));
    res.push(Number(date.split('-')[2].split(' ')[0]));
    res.push(Number(date.split(' ')[1].split(':')[0]));
    res.push(Number(date.split(' ')[1].split(':')[1]));
    return res;
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
      if (this.userRole == 'USER' && this.id == 'projects') {
        this.contextProvider.getApiContext().subscribe((apiContext) => {
          this.commonService.handleIncommingApiData(this.restApiService.get_data('projects'),
            this, {}, (data, additions, self) => {
              self.data = data;
            }, (error, errorAction) => {
              // empty
            });
        });
        this.contextProvider.getApiContext().subscribe((apiContext) => {
          this.commonService.handleIncommingApiData(this.restApiService.get_data('projects_manager'),
            this, {}, (data, additions, self) => {
              self.projectManager = data;
              this.spinner.hide();
            }, (error, errorAction) => {
              this.spinner.hide();
              // empty
            });
        });
      } else {
        this.contextProvider.getApiContext().subscribe((apiContext) => {
          this.commonService.handleIncommingApiData(this.restApiService.get_data(this.id),
            this, {}, (data, additions, self) => {
              if (this.id == 'calendar') {
                self.calendarJobs = [];
                data.forEach(x => {
                  if (x['startDate'] != null) {
                    self.calendarJobs.push(new CalendarJob(x['jobId'], x['name'], x['time'], this.splitDate(x['startDate']), this.splitDate(x['endDate'])));
                  }
                });
                self.eventSettings = { dataSource: self.calendarJobs };
              } else {
                self.data = data;
              }
              this.spinner.hide();
            }, (error, errorAction) => {
              this.spinner.hide();
              // empty
            });
        });
      }
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

  recordClick(e: any, manager?: boolean) {
    this.selectedData = e.rowData;
    this.showDetails = true;
    this.data = null;
    switch (this.id) {
      case 'projects':
        if (manager != null) {
          this.projectRole = 'MANAGER'
        } else {
          this.projectRole = 'USER'
        }
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
        this.projectRole = 'USER'
        this.id = 'job_details';
        this.jobsFromProjects = false;
        break;
    }
  }

  customDate(date: any) {
    var month = Number(date.getMonth());
    month = month+1;
    var test = date.getFullYear() + '-' + month + '-' + date.getDate() + ' 00:00';
    return test;
  }

  actionBegin(args) {
    if ((args.requestType === 'save')) {
      switch (this.id) {
        case 'jobs':
          var req = {};
          req['name'] = this.jobForm.value.name;
          req['time'] = this.jobForm.value.time;
          req['date'] = this.customDate(this.jobForm.value.date);
          if (this.jobForm.value.type != null) {
            req['type'] = this.jobForm.value.type;
            if (this.jobForm.value.problemId != null) {
              req['problem'] = {
                'problemId': this.jobForm.value.problemId
              };
            }
            if (this.jobForm.value.documentUrl != null) {
              req['documentUrl'] = this.jobForm.value.documentUrl;
            }
          }
          req['user'] = {
            'id': this.auth.userData.id
          };
          req['task'] = {
            'taskId': this.jobForm.value.task
          };
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
          break;

        case 'projects':
          var req = {};
          req['name'] = this.projectForm.value.name;
          req['description'] = this.projectForm.value.description;
          req['client'] = {
            "id": this.projectForm.value.client
          };
          if (this.gridTest.currentViewData.length > 0) {
            var users = [];
            this.gridTest.currentViewData.forEach(data => {
              var projectUser = {
                "projectDetailId": {
                  "userId": data['userId']
                },
                "role": data['role'],
                "startDate": this.customDate(data['startDate']),
                "endDate": this.customDate(data['endDate'])
              };
              users.push(projectUser);
            });
            req['signedUsers'] = users;
          }
          this.spinner.show();
          this.contextProvider.getApiContext().subscribe((apiContext) => {
            this.commonService.handleIncommingApiData(this.restApiService.project_create(req),
              this, {}, (data, additions, self) => {
                this._getData();
                this.spinner.hide();
              }, (error, errorAction) => {
                this.spinner.hide();
                // empty
              });
          });
          break;

        case 'project_details':
          console.log(this.taskForm.value);
          var req = {};
          req['name'] = this.taskForm.value.name;
          req['description'] = this.taskForm.value.description;
          this.spinner.show();
          this.contextProvider.getApiContext().subscribe((apiContext) => {
            this.commonService.handleIncommingApiData(this.restApiService.task_create(req, this.lastProjectId),
              this, {}, (data, additions, self) => {
                this._getData();
                this.spinner.hide();
              }, (error, errorAction) => {
                this.spinner.hide();
                // empty
              });
          });
          break;
      }
      
    }
  }

  actionComplete(args) {
    if ((args.requestType === 'add')) {
        const dialog = args.dialog;
        dialog.showCloseIcon = false;
        dialog.height = 600;
        dialog.width = 400;
        // change the header of the dialog
        switch (this.id) {
          case 'jobs':
            dialog.header = 'Dodaj czynno????';
            break;

          case 'projects':
            dialog.height = 800;
            dialog.width = 1200;
            dialog.header = 'Dodaj projekt';
            break;

          case 'project_details':
            dialog.header = 'Dodaj zadanie';
            break;
        }
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

  downloadInvoice() {
    this.restApiService.getPdf().subscribe((data) => {

      var downloadURL = window.URL.createObjectURL(new Blob([data['item']], {type: 'application/pdf'}));
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "help.pdf";
      link.click();
    
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
          return 'Pow??d jest wymagany';
        }
        break;
      default:
        return '';
    }
  }
}