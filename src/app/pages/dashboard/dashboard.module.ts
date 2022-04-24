import { NgModule } from '@angular/core';
import {NbCardModule, NbIconModule, NbListModule, NbSpinnerModule} from '@nebular/theme';

import { DashboardComponent } from './dashboard.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    NbCardModule,
    MatPaginatorModule,
    MatExpansionModule,
    NbListModule,
    NbSpinnerModule,
    NbIconModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
