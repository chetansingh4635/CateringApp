import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class BusinessService {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getBusinessById(id) {
        return this._http.get(`${environment.base_url}/businesses/` + id).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    updateBusiness(id, loc) {
        let location = Object.assign({}, loc);
        return this._http.put(`${environment.base_url}/businesses/` + id, location).map(response => response.json());
    }

}