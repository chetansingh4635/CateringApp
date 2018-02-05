import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class MapService {
    constructor(private _http: HttpService) {
    }

    getPlaceById(placeId, lang) {
       return this._http.get(`${environment.base_url}/places/` + placeId + `?language=` + lang).map(response => response.json()
        );
    }

}