import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class BusinessAccomodationsService {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getAccomodationsById(id) {
        return this._http.get(`${environment.base_url}/businessaccomodations/` + id).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
     createAccomodations(businessAccomodations) {
        return this._http.post(`${environment.base_url}/businessaccomodations`, businessAccomodations).map(response => response.json());
    }

    updateAccomodations(id, businessAccomodations) {
        return this._http.put(`${environment.base_url}/businessaccomodations/` + id, businessAccomodations).map(response => response.json());
    }

    getAccomodationCategoryById(id,category){
        return this._http.get(`${environment.base_url}/businessaccomodations/` + id+'/'+category).map(response => response.json());
    }

}