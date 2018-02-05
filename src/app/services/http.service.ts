import {
  Http, Headers, ConnectionBackend, Response,
  RequestOptionsArgs, Request, RequestOptions
} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router'

import { LocalStorage } from './localStorage.service';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpService extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private router: Router) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.authInterceptor(super.request(url, this.appendAuthHeader(options)));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authInterceptor(super.get(url, this.appendAuthHeader(options)));
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authInterceptor(super.post(url, body, this.appendAuthHeader(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.authInterceptor(super.put(url, body, this.appendAuthHeader(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.authInterceptor(super.delete(url, this.appendAuthHeader(options)));
  }

  private appendAuthHeader(options?: RequestOptionsArgs): RequestOptionsArgs {
    let mergedOptions: RequestOptionsArgs = Object.assign({ headers: new Headers() }, options);
    let auth = null, authStore = new LocalStorage(environment.localStorageKeys.TOKEN).value;
    if (authStore) auth = authStore.valueOf();

    // adding api_key in headers
    mergedOptions.headers.append('api_key', environment.api_key);

    if (auth && !mergedOptions.headers.has('Authorization')) {
      mergedOptions.headers.append('Authorization', `${auth.token}`);
    }

    return mergedOptions;
  }

  private authInterceptor(observable: Observable<Response>): Observable<Response> {
    return observable.catch((error, source) => {
      if (error.status == 401) {
        LocalStorage.clear();
        this.router.navigateByUrl('/login');
        return Observable.of();
      } else {
        return observable;
      }
    });
    
  }
}

