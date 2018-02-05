import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { BanquetMenuServices } from '../../services/banquetMenu.service';
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories,arabicText, getImageUrl, imageUrl, priceValue } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'banquet-menus',
    templateUrl: './banquet-menus.templete.html',
    styleUrls: ['./style.scss']
})
export class ManageBanquetMenu implements OnInit {
    public arabicText = arabicText;
    public title: string = '';
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public accomodationCategory: string;
    public foodId: string;
    public menuCategory = ['Breakfast', 'Lunch', 'Dinner', 'Starters'];
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public location: Location,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public _router: Router,
        public banquetMenuServices: BanquetMenuServices) {
        this.form = this.formBuilder.group({
            banquetMenu: this.formBuilder.group({
                name: ['', [Validators.required]],
                price: ['', [Validators.required, Validators.pattern(priceValue)]],
                menuCategory: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.accomodationCategory = params.value.banquetId;
        this.foodId = params.value.foodId;
    }

    ngOnInit() {
        if (this.foodId) {
            this.getMenu();
            this.title = arabicText.Edit_Banquet_Menu;
        }else{
            this.title = arabicText.Add_Banquet_Menu;
        }
    }
    public getMenu() {
        this.banquetMenuServices.getMenuById(this.foodId).subscribe(data => {
            this.form.patchValue({
                banquetMenu: {
                    name: data.name,
                    price: data.price,
                    menuCategory: data.menuCategory
                }
            });
            this.accomodationCategory = data.accomodationCategory;
        }, (error: Response) => {
            this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
        })
    }
    public save(): void {
        if (!this.submittedOnce) this.submittedOnce = true;
        if (this.form.invalid) return;
        let banquetMenu = <any>this.form.controls.banquetMenu;
        let data = {
            name: banquetMenu.controls.name.value,
            price: banquetMenu.controls.price.value,
            menuCategory: banquetMenu.controls.menuCategory.value,
            accomodationCategory: this.accomodationCategory
        };
        if (this.foodId) {
            delete data['accomodationCategory'];
            this.banquetMenuServices.updateMenuById(this.foodId, data).subscribe(data => {
                this._snackbar.open(arabicText.Menu_Updated_successfully, 'HIDE', { duration: 3000 });
                this.cancel();
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        } else {
            this.banquetMenuServices.createMenu(data).subscribe(data => {
                this._snackbar.open(arabicText.Menu_Added_successfully, 'HIDE', { duration: 3000 });
                this.cancel();
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        }

    }
    public cancel() {
        this.location.back();
    }


    public getImagePath(imageId) {
        return imageUrl(imageId)
    }




}
