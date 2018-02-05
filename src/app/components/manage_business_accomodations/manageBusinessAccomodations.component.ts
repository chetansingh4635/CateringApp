import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { BusinessAccomodationsService } from '../../services/manageBusinessAccomodations.service';
import { environment } from '../../../environments/environment';
import { emailRegexp, numberOnlyRegExp, imageUrl, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './manageBusinessAccomodations.template.html',
    styleUrls: ['./style.scss']
})
export class ManageBusinesAccomodationsComponent implements OnInit {
    public arabicText = arabicText;
    public time = { hour: 13, minute: 30 };
    public title: string = 'Manage Bussiness Accomodations';
    public hourStep = 1;
    public minuteStep = 30;
    public paranomicImage: any;
    public coverImage: any = [];
    public dataLoaded: boolean = false;
    public showLoader: boolean = false;
    public submittedOnce: boolean = false;
    public businessAccomodationId: string;
    meridian = true;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    public form: FormGroup;
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public location: Location,
        public businessAccomodationsService: BusinessAccomodationsService,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute) {
        this.form = this.formBuilder.group({
            busninessAccomodations: this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessAccomodationId = params.value.id;
    }

    ngOnInit() {
        this.paranomicImage = [];
        this.coverImage = [{
            coverImageDom: document.querySelector(`#cover`),
            coverImageFile: null,
            coverImageId: null,
            coverFormData: null
        }, {
            coverImageDom: document.querySelector(`#coverSquare`),
            coverImageFile: null,
            coverImageId: null,
            coverFormData: null
        }];
        if (this.businessAccomodationId) {
            this.getBusinessAccomodations();
        }
    }

    public makeParanomicImages(data) {
        let that = this;
        setTimeout(function () {
            for (let i = 0; i < data.length; i++) {
                that.paranomicImage[i].peronomaImageDom = document.querySelector(`#Paranomic${i}`);
                that.paranomicImage[i].peronomaImageDom.style.backgroundImage = data[i] ? `url(${that.getImagePath(data[i])})` : `url(../../../assets/images/img_placeholder.svg)`
            }
        }, 1000)
    }
    public getBusinessAccomodations() {
        this.businessAccomodationsService.getAccomodationsById(this.businessAccomodationId)
            .subscribe((response: Response) => {
                let data = response;
                this.form.patchValue({
                    busninessAccomodations: {
                        title: data['accomodationDetails'].title,
                        description: data['accomodationDetails'].description
                    }
                });
                this.coverImage[0].coverImageDom.style.backgroundImage = data['accomodationDetails'].coverImage ? `url(${this.getImagePath(data['accomodationDetails'].coverImage)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[1].coverImageDom.style.backgroundImage = data['accomodationDetails'].coverImageSquare ? `url(${this.getImagePath(data['accomodationDetails'].coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[0].coverImageId = data['accomodationDetails'].coverImage ? data['accomodationDetails'].coverImage : null;
                this.coverImage[1].coverImageId = data['accomodationDetails'].coverImageSquare ? data['accomodationDetails'].coverImageSquare : null;
                for (let i = 0; i < data['accomodationDetails'].panaromicImage.length; i++) {
                    this.paranomicImage.push({
                        displayTitle: "Paranomic Image",
                        peronomaImageDom: null,
                        peronomaImageFile: null,
                        peronomaImageId: data['accomodationDetails'].panaromicImage[i],
                        peronomaFormData: null
                    })
                }
                this.makeParanomicImages(data['accomodationDetails'].panaromicImage);
                this.title = "Edit Business Accomodations";
            }, (error: Response) => {

            });
    }
    public cancel() {
        this.location.back();
    }
    public addParanomicImage() {
        this.paranomicImage.push({
            displayTitle: "Paranomic Image",
            peronomaImageDom: null,
            peronomaImageFile: null,
            peronomaImageId: null,
            peronomaFormData: null
        });
    }
    public removeParanomicImage(index) {
        this.paranomicImage.splice(index, 1);
    }
    public extractImage(event, index, type): void {
        if (type === 'Paranomic') {
            let reader = new FileReader();
            this.paranomicImage[index].peronomaImageFile = <File>event.target.files[0];
            this.paranomicImage[index].peronomaImageDom = this.paranomicImage[index].peronomaImageDom ? this.paranomicImage[index].peronomaImageDom : document.querySelector(`#Paranomic${index}`);
            reader.readAsDataURL(this.paranomicImage[index].peronomaImageFile);
            event.target.value = null;
            reader.onload = () => {
                this.paranomicImage[index].peronomaImageDom.style.backgroundImage = `url(${reader.result})`;
                this.paranomicImage[index].peronomaFormData = new FormData();
                this.paranomicImage[index].peronomaFormData.append('file', this.paranomicImage[index].peronomaImageFile);
                this.paranomicImage[index].peronomaImageId = null;
            };
            reader.onerror = (error) => {
            };
        } else {
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
    }
    public save(): void {
        let busninessFood = <any>this.form.controls.busninessAccomodations;
        let panaromicImage = [];
        for (let i = 0; i < this.paranomicImage.length; i++) {
            panaromicImage.push(this.paranomicImage[i].peronomaImageId);
        }
        let data = {
            title: busninessFood.controls.title.value,
            description: busninessFood.controls.description.value,
            coverImage: this.coverImage[0].coverImageId,
            panaromicImage: panaromicImage,
            coverImageSquare: this.coverImage[1].coverImageId
        }
        if (this.businessAccomodationId) {
            this.businessAccomodationsService.updateAccomodations(this.businessAccomodationId, data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.Bussiness_Accomodations_Updated_Successfully, 'HIDE', { duration: 3000 });
                    this.showLoader = false;
                    this._navigator.navigateByUrl(`/business/accomodations/details/${this.businessAccomodationId}`);
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        } else {
            this.businessAccomodationsService.createAccomodations(data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.Bussiness_Accomodations_Created_Successfully, 'HIDE', { duration: 3000 });
                    this.showLoader = false;
                    this._navigator.navigateByUrl('/business');
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
        if (this.coverImage[1].coverImageId === null) {
            if (!this.coverImage[1].coverImageFile) {
                this._snackbar.open(arabicText.Cover_Image_Required, 'HIDE', { duration: 3000 });
                return;
            }
        }

        for (let i = 0; i < this.paranomicImage.length; i++) {
            if (this.paranomicImage[i].peronomaImageId === null) {
                if (!this.paranomicImage[i].peronomaImageFile) {
                    this._snackbar.open(arabicText.Paranomic_Required_Or_Remove, 'HIDE', { duration: 3000 });
                    return;
                }
            }
        };
        let promiseArray = [];
        let whichImage = [];
        if (this.coverImage[0].coverImageId === null) {
            promiseArray.push(this._http.post(`${environment.base_url}/files`, this.coverImage[0].coverFormData));
            whichImage.push({ image: "cover", type: 0 });
        }
        if (this.coverImage[1].coverImageId === null) {
            promiseArray.push(this._http.post(`${environment.base_url}/files`, this.coverImage[1].coverFormData));
            whichImage.push({ image: "cover", type: 1 });
        }
        for (let i = 0; i < this.paranomicImage.length; i++) {
            if (this.paranomicImage[i].peronomaImageId === null) {
                promiseArray.push(this._http.post(`${environment.base_url}/files`, this.paranomicImage[i].peronomaFormData))
                whichImage.push({ image: "paranomic", type: i });
            }
        };
        this.showLoader = true;
        if (promiseArray.length === 0) {
            this.save();
        } else {
            Observable.forkJoin(promiseArray)
                .subscribe((response: any) => {
                    for (let i = 0; i < whichImage.length; i++) {
                        if (whichImage[i].image === 'cover') {
                            this.coverImage[whichImage[i].type].coverImageId = response[i].json()._id;
                        } else {
                            this.paranomicImage[whichImage[i].type].peronomaImageId = response[i].json()._id;
                        }
                    }
                    this.save();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
                });
        }

    }
    /* global method to fine image url */
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }
    public clearImage(index, type): void {
        if (type === 'Paranomic') {
            this.paranomicImage[index].peronomaImageDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
            this.paranomicImage[index].peronomaImageFile = null;
            this.paranomicImage[index].peronomaImageId = null;
        } else {
            this.coverImage[index].coverImageDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
            this.coverImage[index].coverImageFile = null;
            this.coverImage[index].coverImageId = null;
        }

    }
}