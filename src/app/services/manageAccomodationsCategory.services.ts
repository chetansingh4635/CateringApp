import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class ManageAccomodationCategoryService {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getAccomodationsById(id) {
        return this._http.get(`${environment.base_url}/accomodationcategories/` + id).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
     createAccomodations(businessAccomodations) {
        return this._http.post(`${environment.base_url}/accomodationcategories`, businessAccomodations).map(response => response.json());
    }

    updateAccomodations(id, businessAccomodations) {
        return this._http.put(`${environment.base_url}/accomodationcategories/` + id, businessAccomodations).map(response => response.json());
    }

}