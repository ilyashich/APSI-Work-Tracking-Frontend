import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {LoginComponent} from "./components/login/login.component";
import {AppRoutingModule} from "./app-routing.module";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainPageComponent } from './components/main-page/main-page.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
