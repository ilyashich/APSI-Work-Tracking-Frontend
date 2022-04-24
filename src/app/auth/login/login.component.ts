import { Component, OnInit } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-doctor-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NbLoginComponent implements OnInit {

  ngOnInit() {
  }

  login() {
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    this.service.authenticate('windows_shop', this.user).subscribe((result) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
        this.router.navigate(['/dashboard']);
      } else {
        this.errors = result.getErrors();
      }
      this.cd.detectChanges();
    });
  }

}
