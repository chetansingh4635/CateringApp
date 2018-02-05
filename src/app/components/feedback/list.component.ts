import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router'
import { imageUrl, arabicText } from '../../constants';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { LocalStorage } from '../../services/localStorage.service';
import { PagingOptions } from '../common/paging-options';
import { MdSnackBar, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
    selector: 'location-list',
    templateUrl: './list.template.html',
    styleUrls: ['./style.scss']
})
export class FeedbackListComponent implements OnInit {
    public searchKeyword: string;
    public arabicText = arabicText;
    public pagingOptions: PagingOptions;
    public categoryList: any = ['Food', 'Accomodation'];
    public category: string = "";
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    public totalCount: number = -1;
    public businessId: string = null;
    public imageUrl: string = "";
    public status: any = "";
    public currentPage: number = 1;
    public feedBackList: any = [];
    /**
     * @constructor
     */
    constructor(
        public _http: HttpService,
        public _router: Router,
        public dialog: MdDialog,
        public _snackbar: MdSnackBar) {
        this.pagingOptions = new PagingOptions();
        this.businessId = this.userData ? this.userData.business : null;
    }

    ngOnInit() {
        this.pagingOptions.limit = 9;
        this.getFilteredFeedback({ page: 1 });
    }

    openDialogImages(id, feedback) {
        let config = new MdDialogConfig();
        this.imageUrl = this.getImagePath(id);
        let dialogRef = this.dialog.open(ImageDialog);
        dialogRef.componentInstance.imageUrl = this.imageUrl;
        dialogRef.componentInstance.activityName = `${feedback.category.activity.name} ${feedback.category.activity.nameAr}`
    }

    /* global method to fine image url */
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }

    public setActiveInactive(event, feedback): void {
        feedback.isActive = event.checked;
        this._http.put(`${environment.base_url}/feedbacks/${feedback._id}`, { isActive: event.checked })
            .subscribe((response: Response) => {
                feedback.isPending = false;
                this._snackbar.open(`${arabicText.Feedback} ${feedback.category} ${arabicText.Updated}`, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                feedback.isActive = !feedback.isActive
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
    }

    getFilteredFeedback(filter) {
        this.pagingOptions.limit = 9;
        this.pagingOptions.sort = "createdAt";
        this.pagingOptions.order = -1
        this.pagingOptions.skip = (filter.page - 1) * this.pagingOptions.limit;
        let query = this.pagingOptions.getQueryString(
            this.pagingOptions.skip,
            this.pagingOptions.limit,
            this.pagingOptions.sort,
            this.pagingOptions.order,
            this.pagingOptions.keyword);
        let data = {
            business: this.businessId
        };
        if (this.category !== "") {
            data['category'] = this.category;
        }
        if (this.status !== "" && this.status !== 'pending') {
            data['isActive'] = this.status;
            this.currentPage = 1;
        }
        if (this.status === 'pending') {
            data['isPending'] = true;
            this.currentPage = 1;
        }
        this._http.post(`${environment.base_url}/feedbacks/filter?${query}`, data)
            .subscribe((response: Response) => {
                this.feedBackList = response.json().items;
                this.totalCount = response.json().total_count;
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });

    }
}
@Component({
    selector: 'dialog-result-example-dialog',
    templateUrl: './imageDialog.html',
})
export class ImageDialog {
    imageUrl: string;
    activityName: string;
    constructor(public dialogRef: MdDialogRef<ImageDialog>) {
    }
}