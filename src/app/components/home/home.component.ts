import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { PagingOptions } from '../common/paging-options';
import { HttpService } from '../../services/http.service';
import { HomeService } from '../../services/home.services';
import { environment } from '../../../environments/environment';
import {AppWebRoutes} from '../../app-web-routes'
import { arabicText } from '../../constants'

@Component({
    selector: 'activity-list',
    templateUrl: './home.template.html',
    styleUrls: ['./style.scss', '../manage_business/style.scss']
})
export class HomeComponent implements OnInit {
    public homeList: any;
    public arabicText= arabicText;
    public oneAtATime: boolean = true;
    public navListItems = [
        { path: AppWebRoutes.MANAGE_OFFER, itemName: 'Manage Promotional Offers' },
        { path: AppWebRoutes.MANAGE_FEEDBACK, itemName: 'Manage Feedbacks' },
        { path: AppWebRoutes.MANAGE_QUOTATION, itemName: 'Manage quotation' }
    ]
    constructor(public _http: HttpService, public _router: Router, public dialog: MdDialog, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar, public _route: ActivatedRoute, public homeService: HomeService) {
    }

    ngOnInit() {
        this.getDashoardData();
        this.homeList = {
            promotionalOffers: 0,
            feedbacks: 0,
            users: 0
        }
    }

    public async getDashoardData() {

        this.homeService.getDetails()
            .subscribe((response: Response) => {
                this.homeList = response;

            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    navigate(listItem: any) {
        if (listItem.path !== null) {
            this._router.navigateByUrl(listItem.path);
        }

    }
}
