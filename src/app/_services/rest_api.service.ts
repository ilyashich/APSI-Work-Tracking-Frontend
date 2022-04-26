import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { flatMap, timeout, catchError, concatMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonService } from './common.service';
import { ContextProvider } from './context.provider';

@Injectable()
export class RestApiService {

  private requestTimeout: number = 20000;
  private baseUrl: string = 'https://www.mfenster.de/secure';
  private selectedContext: string;

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private http: HttpClient,
    private commonService: CommonService,
    private contextProvider: ContextProvider) 
    { }

  switchContext(context: string, page: number, size: number) {
    this.selectedContext = context;
    return this.get_orders(page, size);
  }

  get_orders(page: number, size: number) {
    if (this.selectedContext === 'ALL') {
      return this.doAuthorized_GET(this.baseUrl + '/order?page=' + page + '&size=' + size);
    }
    return this.doAuthorized_GET(this.baseUrl + '/' + this.selectedContext + '/order?page=' + page + '&size=' + size);
  }

  get_contexts() {
    this.commonService.handleIncommingApiData(this.doAuthorized_GET(this.baseUrl + '/contexts'),
      this, {}, (data, additions, self) => {
        const contextsList: string[] = [];
        contextsList[0] = 'ALL';
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            contextsList.push(data[key]);
          }
        }
        this.contextProvider.setApiContexts(contextsList);
        this.contextProvider.setApiContextsById(data);
      }, (error, errorAction) => {
        // empty
      });
  }

  get_downloadFile(fileId: string, accessUrl: string) {
    return this.http.get<Blob>(this.baseUrl + '/' + accessUrl + '/document?doc_id=' + fileId,
        this.initAccessTokenHeaders(this.oauthService.getAccessToken(), 'blob')).pipe(
            timeout(this.requestTimeout),
            // ================
            flatMap(response => of({ item: response, error: null })),
            // ================
            catchError(error => {
            // ----------
            return of({ item: null, error: error });
            }),
        );
    }

  put_downloadTranslatedOrder(documentId: string, language: string, accessUrl: string) {
    return this.http.put<Blob>(this.baseUrl + '/' + accessUrl + '/order/download', { 'uuid': documentId, 'language': language },
        this.initAccessTokenHeaders(this.oauthService.getAccessToken(), 'blob')).pipe(
            timeout(this.requestTimeout),
            // ================
            flatMap(response => of({ item: response, error: null })),
            // ================
            catchError(error => {
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
