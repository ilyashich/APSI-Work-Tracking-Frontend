import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Consts } from '../_consts/consts';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authenticated = false;
  authHeader: string;

  constructor(private router: Router, private http: HttpClient) {}

  get getAuthHeader() {return this.authHeader;}

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

  login({ login, password }: any): Promise<any> {
    const headers = new HttpHeaders({
      Authorization : 'Basic ' + btoa(login + ':' + password)
    });

    return new Promise<string>((resolve, reject) => {
        this.http.get(Consts.BACKEND_URL + 'user', {headers: headers}).subscribe((response : any) => {
            console.log('login response: ' + response)
            if (response['name']) {
              console.log('this.authenticated = true')
                this.authenticated = true;
                this.authHeader = 'Basic ' + btoa(login + ':' + password);
                // get token
                this.setToken('abcdefghijklmnopqrstuvwxyz');
                resolve(response['name']);
            } else {
                console.log('this.authenticated = false')
                this.authenticated = false;
                reject(new Error('Failed to login'));
            }
          });
    });
  }
}