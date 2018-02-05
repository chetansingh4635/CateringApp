import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class ManageChef {
    constructor(private _http: HttpService) {
    }
    /**
     * Get the Location by sending location id
     * @param id 
     */
    getChefById(id) {
        return this._http.get(`${environment.base_url}/chefs/` + id).map(response => response.json());
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    updateChefById(id, chef) {
        return this._http.put(`${environment.base_url}/chefs/` + id, chef).map(response => response.json());
    }
    
     createChef(chef) {
        return this._http.post(`${environment.base_url}/chefs/`, chef).map(response => response.json());
    }

}