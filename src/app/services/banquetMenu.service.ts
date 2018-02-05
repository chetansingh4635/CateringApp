import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
import { PagingOptions } from '../components/common/paging-options'

@Injectable()
export class BanquetMenuServices {
    constructor(private _http: HttpService) {
    }

    /**
     * Update Location for Super Admin
     * @param location 
     */
    getMenuById(id) {
        return this._http.get(`${environment.base_url}/banquetmenus/` + id).map(response => response.json());
    }
    updateMenuById(id, menu) {
        return this._http.put(`${environment.base_url}/banquetmenus/` + id, menu).map(response => response.json());
    }
    deleteMenu(id){
        return this._http.delete(`${environment.base_url}/banquetmenus/` + id).map(response => response.json());
    }
    createMenu(menu) {
        return this._http.post(`${environment.base_url}/banquetmenus`, menu).map(response => response.json());
    }
    getMenuFilter(filter){
        return this._http.post(`${environment.base_url}/banquetmenus/filter`, filter).map(response => response.json());        
    }
}