import { NgModule } from '@angular/core';
import { CommandColumnService, EditService, GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { ListViewModule, VirtualizationService } from '@syncfusion/ej2-angular-lists';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { HouseFill, WalletFill, PersonFill, ListTask, ListCheck, ExclamationCircleFill, ArrowLeft, Calendar2DateFill } from 'ngx-bootstrap-icons';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonService } from '../_services/common.service';
import { RestApiService } from '../_services/rest_api.service';
import { ContextProvider } from '../_services/context.provider';
import { CommonModule } from '@angular/common';
import { ProgressButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { EventSettingsModel, DayService, WeekService, WorkWeekService, MonthService, AgendaService } from '@syncfusion/ej2-angular-schedule';

const icons = {
  HouseFill,
  WalletFill,
  PersonFill,
  ListTask,
  ListCheck,
  ExclamationCircleFill,
  ArrowLeft,
  Calendar2DateFill
};

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent
  ],
  imports: [
    GridModule,
    NgxBootstrapIconsModule.pick(icons),
    ButtonModule,
    RadioButtonModule,
    SidebarModule,
    ListViewModule,
    PagesRoutingModule,
    CommonModule,
    ProgressButtonModule,
    NgxSpinnerModule,
    DialogModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    DatePickerModule,
    NumericTextBoxModule,
    DropDownListModule,
    ScheduleModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    VirtualizationService,
    CommonService, RestApiService, ContextProvider,
    EditService, CommandColumnService, ToolbarService,
    DayService, WeekService, WorkWeekService, MonthService, AgendaService
  ]
})
export class PagesModule { }
