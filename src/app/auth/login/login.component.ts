import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  requestForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    document.getElementById('requestForm').addEventListener(
      'submit',
      (e: Event) => {
        e.preventDefault();
        if (this.requestForm.valid) {
          // ----------
          this.auth.login(this.requestForm.value).subscribe(
            (result) => {
              console.log(result);
              this.router.navigate(['/pages']);
            },
            (err: Error) => {
              alert(err.message);
            }
          );
        }
      });
  }

  // ===========================================================================
  // ===========================================================================

  get login() { return this.requestForm.get('login'); }
  get password() { return this.requestForm.get('password'); }

  // ===========================================================================
  // ===========================================================================

  private promiseTimeout(ms, promise) {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        const error = new Error();
        error.name = 'TimeoutError';
        reject(error);
      }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout
    ]);
  }
  // ===========================================================================
  getError(el) {
    switch (el) {
      case 'login':
        if (this.requestForm.get('login').hasError('required')) {
          return 'Login required';
        }
        break;
      case 'password':
        if (this.requestForm.get('password').hasError('required')) {
          return 'Password required';
        }
        break;
      default:
        return '';
    }
  }

}
