import { NgModule } from '@angular/core';
import { CommandColumnService, EditService, GridModule } from '@syncfusion/ej2-angular-grids';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { ListViewModule, VirtualizationService } from '@syncfusion/ej2-angular-lists';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { HouseFill, WalletFill } from 'ngx-bootstrap-icons';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryComponent } from './summary/summary.component';
import { CommonService } from '../_services/common.service';
import { RestApiService } from '../_services/rest_api.service';
import { ContextProvider } from '../_services/context.provider';

const icons = {
  HouseFill,
  WalletFill
};

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    SummaryComponent
  ],
  imports: [
    GridModule,
    NgxBootstrapIconsModule.pick(icons),
    ButtonModule,
    RadioButtonModule,
    SidebarModule,
    ListViewModule,
    PagesRoutingModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    VirtualizationService,
    CommonService, RestApiService, ContextProvider,
    EditService, CommandColumnService
  ]
})
export class PagesModule { }
