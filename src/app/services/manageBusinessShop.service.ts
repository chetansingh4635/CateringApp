import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class BusinessShopService {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getShopBusinessById(id) {
        return this._http.get(`${environment.base_url}/businessshops/` + id).map(response => response.json());
    }

    createBusinessShop(data) {
        return this._http.post(`${environment.base_url}/businessshops`,data).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    updateBusinessShop(id, businessShop) {
        return this._http.put(`${environment.base_url}/businessshops/` + id, businessShop).map(response => response.json());
    }

}