import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class HomeService {
    constructor(private _http: HttpService) {
    }

    getDetails(){
        return this._http.get(`${environment.base_url}/manager/dashboard`).map(response => response.json());
    }
}