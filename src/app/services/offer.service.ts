import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class OfferService {
    constructor(private _http: HttpService) {
    }

    getOfferById(offerId) {
        return this._http.get(`${environment.base_url}/offers/` + offerId).map(response => response.json());
    }

    getOffersForMe(queryString) {
        return this._http.get(`${environment.base_url}/offers/me?` + queryString).map(response => response.json());
    }

    /**
     * Get filtered result for requested query
     * @param query 
     */
    filterOffer(body = {},query = {}) {
        return this._http.post(`${environment.base_url}/offers/filter?${query}`, body).map(response => response.json());
    }
}