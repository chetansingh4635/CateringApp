import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { environment } from '../../../environments/environment';
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, getImageUrl, imageUrl, arabicText } from '../../constants';
import { BusinessService } from '../../services/manageBusiness.service'
import { ConfirmDialog } from '../confirm-popup/confirm.popup'
import { BusinessFoodService } from '../../services/manageBusinessFood.service';
import { BusinessAccomodationsService } from '../../services/manageBusinessAccomodations.service'
import { BusinessShopService } from '../../services/manageBusinessShop.service';
import { MdSnackBar, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { MapService } from '../../services/map.service';
declare var google;

@Component({
    selector: 'business-form',
    templateUrl: './list.template.html',
    styleUrls: ['./style.scss']
})
export class BussinessListComponent implements OnInit {
    public arabicText = arabicText;
    public form: FormGroup;
    public latitude: number;
    public longitude: number;
    public address: string;
    public name: string;
    public zoom: number;
    public searchField: FormControl = new FormControl();
    public coverImage: string;
    public coverImageFile: File;
    public coverImageDOM: any;
    public businessDetails: any;
    public businessId: string = null;
    public title: string = '';
    public submittedOnce: boolean = false;
    allowedCategoriesFood: boolean = true;
    allowedCategoriesShop: boolean = true;
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    allowedCategoriesAccomodation: boolean = true;
    allowedCategories: any = { Food: true, Shop: true, Accomodation: true };
    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _route: ActivatedRoute,
        public businessService: BusinessService,
        public businessFoodService: BusinessFoodService,
        public businessShopService: BusinessShopService,
        public businessAccomodationsService: BusinessAccomodationsService,
        public _snackbar: MdSnackBar,
        public _router: Router,
        public mapService: MapService) {

        let params = <any>this._route.params;
        this.businessId = this.userData ? this.userData.business : null;

        this.form = this.formBuilder.group({
            business: this.formBuilder.group({
                name: ['', [Validators.required, Validators.minLength(3)]],
                address: ['', [Validators.required, Validators.minLength(10)],],
                allowedCategoriesFood: [true, []],
                allowedCategoriesShop: [true, []],
                allowedCategoriesAccomodation: [true, []],
                description: ['', []]
            }),

            manager: this.formBuilder.group({
                name: ['', [Validators.required, Validators.minLength(3)]],
                email: ['', [Validators.required, Validators.pattern(emailRegexp)]],
                mobile: ['', [Validators.required, Validators.pattern(contactRegExp)]]
            })
        }); getImageUrl

        this.zoom = 4;

        this.latitude = 24.713552;
        this.longitude = 46.675296;
    }

    ngOnInit() {
        this.setCurrentPosition();
        this.businessDetails = {
            coverImage: null,
            coverImageSquare: null,
            allowedCategories: [],
        };
        if (this.businessId) {
            this.getBusiness();
        }

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {

                    let place: any = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.address = place.formatted_address;
                    this.form.patchValue({
                        business: {
                            address: this.address
                        }
                    });
                    this.zoom = 12;
                });
            });
        });
    }

    /* global method to fine image url */
    public getImagePath(imageId) {
        return getImageUrl(imageId)
    }

    public imageUrl(businessDetails, category) {
        if (businessDetails.food && businessDetails.food.coverImageSquare && category === 'Food') {
            return imageUrl(businessDetails.food.coverImageSquare)
        }
        else if (businessDetails.accomodation && businessDetails.accomodation.coverImageSquare && category === 'Accomodation') {
            return imageUrl(businessDetails.accomodation.coverImageSquare)
        }
        else if (businessDetails.shop && businessDetails.shop.coverImageSquare && category === 'Shop') {
            return imageUrl(businessDetails.shop.coverImageSquare)
        }
        else {
            return category === 'Food' ? '../../assets/images/food_placeholder.png' : category === 'Shop' ? '../../assets/images/shop_placeholder.jpg' : category === 'Accomodation' ? '../../assets/images/accomodation_placeholder.png' : '';
        }
    }
    navigate(businessDetails: any, category) {
        if (!businessDetails.isUpdatedByManager) {
            this._snackbar.open("Update the business first then you are able to Add " + category, 'HIDE', { duration: 3000 });
            return;
        }
        if (businessDetails.food && category === 'Food')
            this._router.navigateByUrl(`business/food/details/${businessDetails.food._id}`);
        else if (businessDetails.shop && category === 'Shop')
            this._router.navigateByUrl(`business/shop/details/${businessDetails.shop._id}`);
        else if (category === 'Shop')
            this._router.navigateByUrl('/business/shop/add');
        else if (businessDetails.accomodation && category === 'Accomodation')
            this._router.navigateByUrl(`/business/accomodations/details/${businessDetails.accomodation._id}`)
        else if (category === 'Accomodation')
            this._router.navigateByUrl('/business/accomodations/add');
    }

    public setCurrentPosition(): void {
        if ("geobusiness" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }

    public async getBusiness() {
        this.businessService.getBusinessById(this.businessId)
            .subscribe(data => {
                let business = data;
                this.businessDetails = data
                this.form.patchValue({
                    business: {
                        name: business.name,
                        address: business.address,
                        allowedCategoriesFood: business.allowedCategories.indexOf('Food') > -1 ? true : false,
                        allowedCategoriesShop: business.allowedCategories.indexOf('Shop') > -1 ? true : false,
                        allowedCategoriesAccomodation: business.allowedCategories.indexOf('Accomodation') > -1 ? true : false,
                        description: business.description
                    },
                    manager: {
                        name: business.manager.name,
                        email: business.manager.email,
                        mobile: parseInt(business.manager.mobile)
                    }
                });
                this.title = business.name + ' (' + (business.isActive ? arabicText.ACTIVE : arabicText.BLOCKED) + ')'
            }, (error: Response) => {
                console.log(error);
            });
    }
    public checkActiveOrInavtive(businessDetails, category) {
        if (category === 'Food') {
            return businessDetails.food.isActive;
        } else if (category === 'Accomodation') {
            return businessDetails.accomodation.isActive;
        } else if (category === 'Shop') {
            return businessDetails.shop.isActive;
        } else {
            return false;
        }
    }
    public setActiveInActive(event, businessDetails, category) {
        if (category === 'Food') {
            businessDetails.food.isActive = event.checked;
            this.businessFoodService.updateBusinessFood(businessDetails.food._id, { isActive: event.checked }).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Business_Food_updated_successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                businessDetails.food.isActive = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        } else if (category === 'Accomodation') {
            businessDetails.accomodation.isActive = event.checked;
            this.businessAccomodationsService.updateAccomodations(businessDetails.accomodation._id, { isActive: event.checked }).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Business_Accomodation_updated_successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                businessDetails.accomodation.isActive = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        } else if (category === 'Shop') {
            businessDetails.shop.isActive = event.checked;
            this.businessShopService.updateBusinessShop(businessDetails.shop._id, { isActive: event.checked }).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Business_Shop_updated_successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                businessDetails.shop.isActive = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        } else {
            businessDetails.shop.isActive = event.checked;
        }
    }
    public save(): void {
        if (!this.submittedOnce) this.submittedOnce = true;

        if (this.form.invalid) return;

        let business = <any>this.form.controls.business, manager = <any>this.form.controls.manager;
        let allowedCategories = [];
        if (business.controls.allowedCategoriesFood.value) {
            allowedCategories.push('Food');
        }
        if (business.controls.allowedCategoriesShop.value) {
            allowedCategories.push('Shop');
        }
        if (business.controls.allowedCategoriesAccomodation.value) {
            allowedCategories.push('Accomodation');
        }
        let data = {
            name: business.controls.name.value,
            address: business.controls.address.value,
            coordinates: [this.longitude, this.latitude],
            allowedCategories: allowedCategories,
            manager: {
                email: manager.controls.email.value,
                name: manager.controls.name.value,
                mobile: manager.controls.mobile.value.toString(),
            }
        };
        this.updateBusiness(data);

    }


    updateBusiness(data) {
        this.businessService.updateBusiness(this.businessId, data).subscribe(resp => {
            this._snackbar.open(`${arabicText.Business_Updated}`, 'HIDE', { duration: 3000 });
        }, error => {
            this._snackbar.open(arabicText.errors.Failed_To_Update_Business, 'HIDE', { duration: 3000 });
        });
    }
}