import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { flatMap, timeout, catchError, concatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonService } from './common.service';
import { ContextProvider } from './context.provider';
import { AuthService } from './auth-service';
import { Consts } from '../_consts/consts';

@Injectable()
export class RestApiService {

  private requestTimeout: number = 20000;
  private baseUrl: string = Consts.BACKEND_URL;
  private selectedContext: string;

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private http: HttpClient,
    private commonService: CommonService,
    private contextProvider: ContextProvider,
    private authService: AuthService) 
    { }

  get_data(id: string) {
    switch (id) {
      case 'employees':
        return this.do_GET(this.baseUrl + '/persons');

      case 'projects':
        if (this.authService.userData.role == 'MANAGER') {
          return this.do_GET(this.baseUrl + '/project/all');
        }
        if (this.authService.userData.role == 'EMPLOYEE') {
          return this.do_GET(this.baseUrl + '/person/' + this.authService.userData.username + '/projects');
        }

      case 'jobs':
        if (this.authService.userData.role == 'MANAGER') {
          return this.do_GET(this.baseUrl + '/job/all_to_accept');
        }
        if (this.authService.userData.role == 'EMPLOYEE') {
          return this.do_GET(this.baseUrl + '/user/' + this.authService.userData.id + '/jobs');
        }
        if (this.authService.userData.role == 'CLIENT') {
          return this.do_GET(this.baseUrl + '/user/' + this.authService.userData.id + '/jobs_to_accept_by_client');
        }

      case 'problems':
        return this.do_GET(this.baseUrl + '/problem/all');
    }
  }

  get_users() {
    return this.do_GET(this.baseUrl + '/persons');
  }

  get_my_projects() {
    return this.do_GET(this.baseUrl + '/person/' + this.authService.userData.username + '/projects');
  }

  get_problems() {
    return this.do_GET(this.baseUrl + '/problem/all');
  }

  private do_GET(url: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization : this.authService.getAuthHeader
    });
    
    return this.http.get<any>(url, {headers: headers}).pipe(
        timeout(this.requestTimeout),
        // ================
        flatMap(response => of({ item: response, error: null })),
        // ================
        catchError(error => {
            if (error && error.error && error.error.error === 'invalid_token') {
            localStorage.clear();
            this.router.navigate(['auth/login']);
            }
            // ----------
            return of({ item: null, error: error });
        }),
        );
    }

  private doAuthorized_GET(url: string): Observable<any> {
    return this.http.get<any>(url, this.initAccessTokenHeaders(this.oauthService.getAccessToken(), undefined)).pipe(
        timeout(this.requestTimeout),
        // ================
        flatMap(response => of({ item: response, error: null })),
        // ================
        catchError(error => {
            if (error && error.error && error.error.error === 'invalid_token') {
            localStorage.clear();
            this.router.navigate(['auth/login']);
            }
            // ----------
            return of({ item: null, error: error });
        }),
        );
    }

  private doAuthorized_POST(url: string, request: any) {
    return this.http.post<any>(url, request, this.initAccessTokenHeaders(this.oauthService.getAccessToken(), undefined)).pipe(
        timeout(this.requestTimeout),
        // ================
        flatMap(response => of({ item: response, error: null })),
        // ================
        catchError(error => {
            if (error && error.error && error.error.error === 'invalid_token') {
            localStorage.clear();
            this.router.navigate(['auth/login']);
            }
            // ----------
            return of({ item: null, error: error });
        }),
        );
    }

  private doAuthorized_PUT(url: string, req: any) {
    return this.http.put<any>(url, req, this.initAccessTokenHeaders(this.oauthService.getAccessToken(), undefined)).pipe(
        timeout(this.requestTimeout),
        // ================
        flatMap(response => of({ item: response, error: null })),
        // ================
        catchError(error => {
            if (error && error.error && error.error.error === 'invalid_token') {
            localStorage.clear();
            this.router.navigate(['auth/login']);
            }
            // ----------
            return of({ item: null, error: error });
        }),
        );
  }

  private initAccessTokenHeaders(accessToken: string, responseType: string): {} {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + accessToken,
    });
    if (responseType) {
      return { headers: headers, withCredentials: true, responseType: responseType };
    }
    return { headers: headers, withCredentials: true };
  }

}
