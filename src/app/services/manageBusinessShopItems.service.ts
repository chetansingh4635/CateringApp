import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class BusinessShopItemsService {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getShopItemBusinessById(id) {
        return this._http.get(`${environment.base_url}/shopitemdetails/` + id).map(response => response.json());
    }

    createBusinessShopItem(data) {
        return this._http.post(`${environment.base_url}/shopitems`,data).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    updateBusinessShopItem(id, businessShop) {
        return this._http.put(`${environment.base_url}/shopitems/` + id, businessShop).map(response => response.json());
    }

}