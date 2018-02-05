import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { PagingOptions } from '../common/paging-options';
import { LocalStorage } from '../../services/localStorage.service';
import { HttpService } from '../../services/http.service';
import { OfferService } from '../../services/offer.service';
import { emailRegexp, numberOnlyRegExp, arabicText } from '../../constants';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'offer-list',
    templateUrl: './offerList.template.html',
    styleUrls: ['./style.scss', '../manage_business/style.scss']
})
export class OfferListComponent implements OnInit {
    public arabicText = arabicText;
    public offers: any = [];
    public offersList: any = [];
    public categoryList: any= ['Food','Accomodation'];
    public userData : any = new LocalStorage(environment.localStorageKeys.USER).value;
    public pagingOptions: PagingOptions;
    public businessId: any = [];
    public page: number = 1;
    public query : any;
    public totalCount : any = -1;
    public 
    p: number = 1;
    constructor(
        public _http: HttpService,
        public _router: Router,
        public _formBuilder: FormBuilder,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public offerService: OfferService) {
    }

    ngOnInit() {
        this.businessId.push(this.userData ? this.userData.business : null);
        this.pagingOptions = new PagingOptions();
        this.filterOffers({});
    }

    public setActiveInactive(event, offer, index): void {
        offer.isActive = event.checked;
        this._http.put(`${environment.base_url}/offers/${offer._id}`, { isActive: event.checked })
            .subscribe((response: Response) => {
                this._snackbar.open(arabicText.Offers_updated_sucessfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                offer.isActive = !offer.isActive
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
    }

    public setShowOnDetail(event,offer):void{
        offer.showOnDetails = event.checked;
                this._http.put(`${environment.base_url}/offers/${offer._id}`, { showOnDetails: event.checked })
                    .subscribe((response: Response) => {
                        this._snackbar.open(arabicText.Offers_updated_sucessfully, 'HIDE', { duration: 3000 });
                    }, (error: Response) => {
                        offer.showOnDetails = !offer.showOnDetails
                        this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                    });
    }

    public async getOffers(queryString = '') {
        this.offerService.getOffersForMe(this.query)
            .subscribe((response: Response) => {
                this.offers = response['items'];
                this.offersList = response;
                this.totalCount = response['total_count'];
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
    }

    public filterOffers = (event,currentPage ?) => {
        currentPage = currentPage ? currentPage.page : 1;
        let body = {
            business:this.businessId
        }
        this.pagingOptions.sort = 'createdAt';
        this.pagingOptions.order = -1;
        this.query = this.pagingOptions.getQueryString(
        (currentPage-1)*this.pagingOptions.limit,
        this.pagingOptions.limit,
        this.pagingOptions.sort,
        this.pagingOptions.order,
        this.pagingOptions.keyword);
        if (event.value) {
            this.offers = [];
             body['category']= [event.value];
        }
            this.offerService.filterOffer(body,this.query).subscribe((response: Response) => {
                this.offers = response['items'];
                this.totalCount = response['total_count'];
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
        
    }

    pageChanged(event) {
       
    }

    validExpire(validTill) {
        let date = new Date();
        let valid = new Date(validTill);
        if(valid.getDate() === date.getDate() && valid.getDay() === date.getDay() && valid.getFullYear() === date.getFullYear()){
            return false;
        }else{
             return new Date(validTill).getTime() < new Date().getTime();
        }
    }
}