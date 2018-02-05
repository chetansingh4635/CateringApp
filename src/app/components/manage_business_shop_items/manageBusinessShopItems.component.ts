import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';
import { BusinessShopItemsService } from '../../services/manageBusinessShopItems.service';
import { Location } from '@angular/common'
import { emailRegexp, numberOnlyRegExp, imageUrl, youtubeUrlRegexp, priceValue, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './manageBusinessShopItems.template.html',
    styleUrls: ['./style.scss']
})
export class ManageBusinesShopItemsComponent implements OnInit {
    public arabicText = arabicText;
    public time = { hour: 13, minute: 30 };
    public title: string = '';
    public hourStep = 1;
    public minuteStep = 30;
    public shopId: string;
    public coverImage: any = [];
    public dataLoaded: boolean = false;
    public showLoader: boolean = false;
    public submittedOnce: boolean = false;
    public businessShopItemsId: string;
    meridian = true;
    public form: FormGroup;
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public location: Location,
        public BusinessShopItemsService: BusinessShopItemsService,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute) {
        this.form = this.formBuilder.group({
            shopItems: this.formBuilder.group({
                description: ['', [Validators.required]],
                title: ['', [Validators.required]],
                price: ['', [Validators.required, Validators.pattern(priceValue)]],
            })
        });
        let params = <any>this._route.params;
        this.businessShopItemsId = params.value.id;
        this.shopId = params.value.shopId;
    }

    ngOnInit() {
        this.coverImage = [{
            coverImageDom: document.querySelector(`#coverSquare`),
            coverImageFile: null,
            coverImageId: null,
            coverFormData: null
        }];
        if (this.businessShopItemsId) {
            this.getBusinessShop();
            this.title = arabicText.Edit_Bussiness_Shop_Items;
        } else {
            this.dataLoaded = true;
            this.title = arabicText.Add_Bussiness_Shop_Items;
        }
    }
    public cancel() {
        this.location.back();
    }


    public getBusinessShop() {
        this.BusinessShopItemsService.getShopItemBusinessById(this.businessShopItemsId)
            .subscribe((response: any) => {
                let data = response;
                this.form.patchValue({
                    shopItems: {
                        description: data.description,
                        title: data.title,
                        price: data.price
                    }
                });
                this.coverImage[0].coverImageDom.style.backgroundImage = data.coverImage ? `url(${this.getImagePath(data.coverImage)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[0].coverImageId = data.coverImage ? data.coverImage : null;
            }, (error: Response) => {

            });
    }
    public extractImage(event, index, type): void {
        let reader = new FileReader();
        this.coverImage[index].coverImageFile = <File>event.target.files[0];
        reader.readAsDataURL(this.coverImage[index].coverImageFile);
        event.target.value = null;
        reader.onload = () => {
            this.coverImage[index].coverImageDom.style.backgroundImage = `url(${reader.result})`;
            this.coverImage[index].coverFormData = new FormData();
            this.coverImage[index].coverFormData.append('file', this.coverImage[index].coverImageFile);
            this.coverImage[index].coverImageId = null;
        };
        reader.onerror = (error) => {
        };
    }
    public save(): void {
        let shopItems = <any>this.form.controls.shopItems;
        let data = {
            title: shopItems.controls.title.value,
            description: shopItems.controls.description.value,
            price: shopItems.controls.price.value,
            shop: this.shopId,
            coverImage: this.coverImage[0].coverImageId
        }
        if (this.businessShopItemsId) {
            delete data['shop'];
            this.BusinessShopItemsService.updateBusinessShopItem(this.businessShopItemsId, data)
                .subscribe((response: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(arabicText.Business_Shop_items_updated_successfully, 'HIDE', { duration: 3000 });
                    this.cancel();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        } else {
            this.BusinessShopItemsService.createBusinessShopItem(data)
                .subscribe((response: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(arabicText.Business_Shop_items_created_successfully, 'HIDE', { duration: 3000 });
                    this.cancel();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        }


    }
    public uploadAllTheData() {
        if (!this.submittedOnce) this.submittedOnce = true;
        if (this.form.invalid) return;
        if (this.coverImage[0].coverImageId === null) {
            if (!this.coverImage[0].coverImageFile) {
                this._snackbar.open(arabicText.Cover_Image_Required, 'HIDE', { duration: 3000 });
                return;
            }
        }
        let promiseArray = [];
        let whichImage = [];
        if (this.coverImage[0].coverImageId === null) {
            promiseArray.push(this._http.post(`${environment.base_url}/files`, this.coverImage[0].coverFormData));
            whichImage.push({ image: "cover", type: 0 });
        }
        this.showLoader = true;
        if (promiseArray.length === 0) {
            this.save();
        } else {
            Observable.forkJoin(promiseArray)
                .subscribe((response: any) => {
                    for (let i = 0; i < whichImage.length; i++) {
                        if (whichImage[i].image === 'cover') {
                            this.coverImage[whichImage[i].type].coverImageId = response[i].json()._id;
                        }
                    }
                    this.save();
                }, (error: Response) => {
                    this.showLoader = false;
                });
        }

    }
    /* global method to fine image url */
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }
    public clearImage(index, type): void {
        this.coverImage[index].coverImageDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
        this.coverImage[index].coverImageFile = null;
        this.coverImage[index].coverImageId = null;
    }
}