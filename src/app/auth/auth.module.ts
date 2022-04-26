import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { ProgressButtonModule} from '@syncfusion/ej2-angular-splitbuttons';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    CommonModule,
    AuthRoutingModule,
    OAuthModule.forRoot(),
    ProgressButtonModule,
    HttpClientModule
  ],
  providers: [
    { provide: OAuthStorage, useValue: localStorage }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthModule { }
