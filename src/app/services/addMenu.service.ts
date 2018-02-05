import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class AddMenu {
    constructor(private _http: HttpService) {
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    getMenuById(id) {
        return this._http.get(`${environment.base_url}/menus/` + id).map(response => response.json());
    }
    
    updateMenuById(id, menu) {
        return this._http.put(`${environment.base_url}/menus/` + id, menu).map(response => response.json());
    }

    createMenu(menu) {
        return this._http.post(`${environment.base_url}/menus`, menu).map(response => response.json());
    }

}