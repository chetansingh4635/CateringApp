import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class ResetPasswordService {
    constructor(private _http: HttpService) {
    }

   
    resetPassword(body){
        return this._http.put(`${environment.base_url}/resetpassword`,body).map(response => response.json());
    }
}