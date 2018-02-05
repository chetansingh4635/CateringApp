import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { environment } from '../../../environments/environment';
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, imageUrl, arabicText } from '../../constants';
import { BusinessService } from '../../services/manageBusiness.service'
import { ConfirmDialog } from '../confirm-popup/confirm.popup'
import { MdSnackBar, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { MapService } from '../../services/map.service';
import { Observable } from 'rxjs/Rx';
declare var google;

@Component({
    selector: 'business-form',
    templateUrl: './form.template.html',
    styleUrls: ['./style.scss']
})
export class BusinessFormComponent implements OnInit {
    public arabicText = arabicText;
    public form: FormGroup;
    public latitude: number;
    public longitude: number;
    public address: string;
    public name: string;
    public zoom: number;
    public searchField: FormControl = new FormControl();
    public images = [];
    public showLoader: boolean = false;
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    public businessId: string = null;
    public title: string = '';
    public submittedOnce: boolean = false;
    allowedCategoriesFood: boolean = true;
    allowedCategoriesShop: boolean = true;
    allowedCategoriesAccomodation: boolean = true;
    allowedCategories: any = { Food: true, Shop: true, Accomodation: true };
    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _route: ActivatedRoute,
        public _navigator: Router,
        public businessService: BusinessService,
        public _snackbar: MdSnackBar,
        public _router: Router,
        public mapService: MapService) {

        let params = <any>this._route.params;
        this.businessId = params.value.id;
        this.form = this.formBuilder.group({
            business: this.formBuilder.group({
                name: ['', [Validators.required, Validators.minLength(3)]],
                address: ['', [Validators.required, Validators.minLength(10)],],
                description: ['', [Validators.required]]
            }),

            manager: this.formBuilder.group({
                name: ['', [Validators.required, Validators.minLength(3)]],
                email: ['', [Validators.required, Validators.pattern(emailRegexp)]],
                mobile: ['', [Validators.required, Validators.pattern(contactRegExp)]]
            })
        });

        this.zoom = 4;
        this.businessId = this.userData ? this.userData.business : null;
        this.latitude = 24.713552;
        this.longitude = 46.675296;


    }

    ngOnInit() {
        this.setCurrentPosition();
        this.images = [{
            coverDom: document.querySelector('#cover'),
            coverFile: null,
            coverFormData: null,
            coverId: null
        }]
        if (this.businessId) {
            this.getBusiness();
        }

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                 componentRestrictions: {country: "sa"}
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
    // get formData { return this.form.get('Data'); }
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
                this.form.patchValue({
                    business: {
                        name: business.name,
                        address: business.address,
                        description: business.description
                    },
                    manager: {
                        name: business.manager.name,
                        email: business.manager.email,
                        mobile: parseInt(business.manager.mobile)
                    }
                });
                this.images[0].coverDom.style.backgroundImage = business.coverImage ? `url(${this.getImagePath(business.coverImage)})` : `url(../../../assets/images/img_placeholder.svg)`
                // this.images[1].coverDom.style.backgroundImage = business.coverImageSquare ? `url(${this.getImagePath(business.coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.images[0].coverId = business.coverImage ? business.coverImage : null;
                // this.images[1].coverId = business.coverImageSquare ? business.coverImageSquare : null;
                this.title = business.name;
            }, (error: Response) => {
                console.log(error);
            });
    }

    public save(): void {
        if (!this.submittedOnce) this.submittedOnce = true;

        if (this.form.invalid) return;

        let business = <any>this.form.controls.business;
        let data = {
            name: business.controls.name.value,
            address: business.controls.address.value,
            coordinates: [this.longitude, this.latitude],
            coverImage: this.images[0].coverId,
            // coverImageSquare: this.images[1].coverId,
            description: business.controls.description.value,
        };

        if (this.businessId) {
            this.updateBusiness(data);
        }
    }

    /* global method to fine image url */
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }

    updateBusiness(data) {
        this.businessService.updateBusiness(this.businessId, data).subscribe(resp => {
            this._navigator.navigateByUrl('/business');
            this._snackbar.open(arabicText.Business_updated, 'HIDE', { duration: 3000 });
            this.showLoader = false;
        }, error => {
            this._snackbar.open(arabicText.Failed_to_update_business, 'HIDE', { duration: 3000 });
            this.showLoader = false;
        });
    }
    public extractImage(event, type): void {
        let reader = new FileReader();
        this.images[type].coverFile = <File>event.target.files[0];
        reader.readAsDataURL(this.images[type].coverFile);
        event.target.value = null;
        reader.onload = () => {
            this.images[type].coverDom.style.backgroundImage = `url(${reader.result})`;
            this.images[type].coverFormData = new FormData();
            this.images[type].coverFormData.append('file', this.images[type].coverFile);
            this.images[type].coverId = null;
        };
        reader.onerror = (error) => {
        };
    }

    public clearImage(type): void {
        this.images[type].coverDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
        this.images[type].coverFormData = null;
        this.images[type].coverFile = null;
        this.images[type].coverId = null;
    }

    public uploadImage(): void {
        if (!this.submittedOnce) this.submittedOnce = true;
        if (this.form.invalid) return;
        if (this.images[0].coverId === null) {
            if (!this.images[0].coverFile) {
                this._snackbar.open(arabicText.Cover_Image_Required, 'HIDE', { duration: 3000 });
                return;
            }
        }
        // if (this.images[1].coverId === null) {
        //     if (!this.images[1].coverFile) {
        //         this._snackbar.open(arabicText.Cover_Image_Required, 'HIDE', { duration: 3000 });
        //         return;
        //     }
        // }
        this.showLoader = true;
        let imageUpload = [];
        let whichImage = [];
        if (!this.images[0].coverId) {
            imageUpload.push(this._http.post(`${environment.base_url}/files`, this.images[0].coverFormData));
            whichImage.push({ image: "cover", type: 0 });
        }
        // if (!this.images[1].coverId) {
        //     imageUpload.push(this._http.post(`${environment.base_url}/files`, this.images[1].coverFormData));
        //     whichImage.push({ image: "cover", type: 1 });
        // }
        if (imageUpload.length === 0) {
            this.save();
        } else {
            Observable.forkJoin(imageUpload)
                .subscribe((res: any) => {
                    for (let i = 0; i < whichImage.length; i++) {
                        this.images[whichImage[i].type].coverId = res[i].json()._id;
                    }
                    this.save();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
                });
        }
    }
}