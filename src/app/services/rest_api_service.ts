import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { flatMap, timeout, catchError, concatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { Consts } from '../consts/consts';

@Injectable()
export class RestApiService {

  private requestTimeout: number = 20000;

  constructor(
    private router: Router,
    private http: HttpClient,
    private commonService: CommonService) { }

  get_persons() {
    return this.doAuthorized_GET(Consts.BACKEND_URL + '/users');
  }

  private doAuthorized_GET(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
        timeout(this.requestTimeout),
        // ================
        flatMap(response => of({ item: response, error: null })),
        // ================
        catchError(error => {
          if (error && error.error && error.error.error === 'invalid_token') {
            localStorage.clear();
            this.router.navigate(['login']);
          }
          // ----------
          return of({ item: null, error: error });
        }),
      );
  }

}
