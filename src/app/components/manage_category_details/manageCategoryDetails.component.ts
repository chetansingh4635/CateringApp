import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { AddMenu } from '../../services/addMenu.service'
import { BusinessAccomodationsService } from '../../services/manageBusinessAccomodations.service';
import { ManageAccomodationCategoryService } from '../../services/manageAccomodationsCategory.services';
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, getImageUrl, imageUrl, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'activity-form',
    templateUrl: './manageCategoryDetails.templete.html',
    styleUrls: ['./style.scss']
})
export class ManageCategoryDetails implements OnInit {
    public arabicText = arabicText;
    public title: string = '';
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public accomodationId: string;
    public categoryId: string;
    public categoryDetails: any = [];
    public showLoader: boolean = false;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public _router: Router,
        public businessAccomodationsService: BusinessAccomodationsService,
        public manageAccomodationCategoryService : ManageAccomodationCategoryService,
        public addMenu: AddMenu) {
        let params = <any>this._route.params;
        this.accomodationId = params.value.accoId;
        this.categoryId = params.value.category;
    }

    ngOnInit() {
        this.getCategoryDetails();
        this.title = this.categoryId == 'Rooms' ? arabicText.Rooms : this.categoryId == 'Villas' ? arabicText.Villas : this.categoryId == 'Bunglows' ? arabicText.Bunglows : this.categoryId == 'Banquets' ? arabicText.Banquets : '';
        this.title = this.title + " " + arabicText.Listing;
    }

    public getCategoryDetails(){
        this.businessAccomodationsService.getAccomodationCategoryById(this.accomodationId, this.categoryId)
            .subscribe((response: Response) => {
                this.categoryDetails = response;          
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
   public nevigateToAddMenu(){
    //    this._router.navigateByUrl(`business/food/chef/${this.categoryDetails._id}/menu/add`);
   }

   
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }
    public setAvailable(event, categoryDetail){
        categoryDetail.isAvailable = event.checked;
        this.manageAccomodationCategoryService.updateAccomodations(categoryDetail._id,{isAvailable:event.checked}).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Category_updated_successfully, 'HIDE', { duration: 3000 });              
            }, (error: Response) => {
                categoryDetail.isAvailable = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
}
