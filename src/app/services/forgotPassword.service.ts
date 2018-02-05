import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class ForgotPasswordService {
    constructor(private _http: HttpService) {
    }

   
    forgotPassword(body){
        return this._http.post(`${environment.base_url}/forgotpassword`,body).map(response => response.json());
    }
}