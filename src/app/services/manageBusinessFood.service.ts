import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class BusinessFoodService {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getFoodBusinessById(id) {
        return this._http.get(`${environment.base_url}/businessfoods/` + id).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    updateBusinessFood(id, businessFood) {
        return this._http.put(`${environment.base_url}/businessfoods/` + id, businessFood).map(response => response.json());
    }

}