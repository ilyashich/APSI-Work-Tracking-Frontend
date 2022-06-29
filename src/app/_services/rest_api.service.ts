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

      case 'clients':
        return this.do_GET(this.baseUrl + '/clients');

      case 'projects':
        if (this.authService.userData.role == 'ADMIN') {
          return this.do_GET(this.baseUrl + '/project/all');
        }
        if (this.authService.userData.role == 'USER') {
          return this.do_GET(this.baseUrl + '/person/' + this.authService.userData.username + '/projects');
        }

      case 'projects_manager':
        return this.do_GET(this.baseUrl + '/person/' + this.authService.userData.username + '/projects_manager');

      case 'jobs':
        if (this.authService.userData.role == 'ADMIN') {
          return this.do_GET(this.baseUrl + '/job/all_to_accept');
        }
        if (this.authService.userData.role == 'USER') {
          return this.do_GET(this.baseUrl + '/user/' + this.authService.userData.username + '/jobs');
        }
        if (this.authService.userData.role == 'CLIENT') {
          return this.do_GET(this.baseUrl + '/user/' + this.authService.userData.username + '/jobs_to_accept_by_client');
        }

      case 'problems':
        return this.do_GET(this.baseUrl + '/problem/all');

      case 'tasks':
        return this.do_GET(this.baseUrl + '/user/' + this.authService.userData.username + '/tasks');

      case 'project_tasks':
        return this.do_GET(this.baseUrl + '/task/projects/user/' + this.authService.userData.username );

      case 'calendar':
        return this.do_GET(this.baseUrl + '/user/' + this.authService.userData.username + '/calendar/jobs');

      case 'invoice':
        return this.do_GET(this.baseUrl + '/invoice/get');
    }
  }

  getPdf() {
    return this.do_GET2(this.baseUrl + '/invoice/get');
  }

  get_details(id: string, lastProjectId: string, lastTaskId: string) {
    switch (id) {
      case 'project_details':
        return this.do_GET(this.baseUrl + '/project/get/' + lastProjectId);

      case 'task_details':
        return this.do_GET(this.baseUrl + '/task/get/' + lastTaskId);
    }
  }

  job_accept(id: string) {
    switch (this.authService.userData.role) {
      case 'USER':
        return this.do_PUT(this.baseUrl + '/user/' + this.authService.userData.username  + '/job_to_accept/' + id, null); 

      case 'CLIENT':
        return this.do_PUT(this.baseUrl + '/user/' + this.authService.userData.username  + '/job_to_accept_by_client/' + id, null); 
    }
  }

  job_reject(id: string, reason: string) {
    var req = {
      'reason': reason
    };

    switch (this.authService.userData.role) {
      case 'USER':
        return this.do_PUT(this.baseUrl + '/user/' + this.authService.userData.username  + '/job_to_reject/' + id, req); 

      case 'CLIENT':
        return this.do_PUT(this.baseUrl + '/user/' + this.authService.userData.username  + '/job_to_reject_by_client/' + id, req); 
    }
  }

  job_create(job: any) {
    return this.do_POST(this.baseUrl + '/job/create', job); 
  }

  task_create(task: any, projectId: string) {
    return this.do_POST(this.baseUrl + '/task/create/project/' + projectId, task); 
  }

  project_create(project: any) {
    return this.do_POST(this.baseUrl + '/project/create', project); 
  }

  job_update(id: string, req: any) {
    return this.do_PUT(this.baseUrl + '/job/update/' + id, req); 
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

  private do_GET2(url: string): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Authorization : this.authService.getAuthHeader
      })
    };
    
    return this.http.get<any>(url, httpOptions).pipe(
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

  private do_PUT(url: string, req: any) {
    const headers = new HttpHeaders({
      Authorization : this.authService.getAuthHeader
    });

    return this.http.put<any>(url, req, {headers: headers}).pipe(
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

  private do_POST(url: string, req: any) {
    const headers = new HttpHeaders({
      Authorization : this.authService.getAuthHeader
    });

    return this.http.post<any>(url, req, {headers: headers}).pipe(
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
