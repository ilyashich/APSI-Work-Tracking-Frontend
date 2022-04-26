import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Consts } from '../_consts/consts';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authenticated = false;

  constructor(private router: Router, private http: HttpClient) {}

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  login({ login, password }: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization : 'Basic ' + btoa(login + ':' + password)
    });

    this.http.get(Consts.BACKEND_URL + 'user', {headers: headers}).subscribe((response : any) => {
      console.log('login response: ' + response)
      if (response['name']) {
        console.log('this.authenticated = true')
          this.authenticated = true;
          // get token
          this.setToken('abcdefghijklmnopqrstuvwxyz');
          return of({ name: response['name'], email: response['name'] });
      } else {
          console.log('this.authenticated = false')
          this.authenticated = false;
      }
    });

    return throwError(new Error('Failed to login'));
  }
}