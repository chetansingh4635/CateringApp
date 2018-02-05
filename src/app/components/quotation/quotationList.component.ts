import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { LocalStorage } from '../../services/localStorage.service';
import { PagingOptions } from '../common/paging-options';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { arabicText } from '../../constants';

@Component({
    selector: 'activity-list',
    templateUrl: './quotationList.template.html',
    styleUrls: ['./style.scss', '../manage_business/style.scss']
})
export class QuotationListComponent implements OnInit {
    public quatations: any = [];
    public arabicText = arabicText;
    public categoryList: any = ['Food', 'Accomodation'];
    public totalCount: number = -1;
    public search: any;
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    public pagingOptions: PagingOptions;
    public category: string = "";
    public validFrom: Date;
    public validTill: Date;
    public isRead: string = "";
    public businessId: string= "";
    public currentPage: number = 1;
    constructor(public _http: HttpService, public _router: Router, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar, public _route: ActivatedRoute) {
         this.businessId = this.userData ? this.userData.business : null;
}

    ngOnInit() {
        this.pagingOptions = new PagingOptions();
        this.getQuotation({ page: 1 });
    }
    public updateReadUnread(event, quotation): void {
        quotation.isRead = !event.checked;
        this._http.put(`${environment.base_url}/quotations/${quotation._id}`, { isRead: event.checked })
            .subscribe((response: Response) => {
                this._snackbar.open("Quotation updated successfully", 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                quotation.isRead = !quotation.isRead;
                this._snackbar.open(error['description'], 'HIDE', { duration: 3000 });
            });

    }
    public async getQuotation(event?) {
        let data = {
            // business: this.businessId
        };
        let validFrom = this.validFrom ?  new Date(this.validFrom) : null;
        let validTill = this.validTill ?  new Date(this.validTill) : null;

        if(validFrom && validTill){
            if(validFrom <= validTill){
                data['validFrom'] = validFrom.getTime();
                data['validTill'] = validTill.getTime();
            }else{
                this._snackbar.open("Valid from is always less than Valid Till", 'HIDE', { duration: 3000 });
                return;
          }
        }else if(this.validFrom){
            data['validFrom'] =validFrom.getTime();
        }else if(this.validTill){
            data['validTill'] = validTill.getTime();
        }
        this.pagingOptions.skip = (event.page - 1) * this.pagingOptions.limit;
        this.pagingOptions.sort = 'createdAt';
        this.pagingOptions.order = -1;
        let query = this.pagingOptions.getQueryString(this.pagingOptions.skip,
            this.pagingOptions.limit,
            this.pagingOptions.sort,
            this.pagingOptions.order,
            this.search);
        if (this.category && this.category !== "") {
            data['category'] = this.category;
        }
        if (this.isRead !== "") {
            data['isRead'] = this.isRead;
        }
        this._http.post(`${environment.base_url}/quotations/me?${query}`, data)
            .subscribe((response: Response) => {
                this.quatations = response.json().items;
                this.totalCount = response.json().total_count;
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
    }
}