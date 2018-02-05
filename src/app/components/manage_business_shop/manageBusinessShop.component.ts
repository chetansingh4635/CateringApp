import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';
import { BusinessShopService } from '../../services/manageBusinessShop.service';
import { Location } from '@angular/common'
import { emailRegexp, numberOnlyRegExp, imageUrl, youtubeUrlRegexp, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './manageBusinessShop.template.html',
    styleUrls: ['./style.scss']
})
export class ManageBusinesShopComponent implements OnInit {
    public arabicText = arabicText;
    public time = { hour: 13, minute: 30 };
    public title: string = '';
    public hourStep = 1;
    public minuteStep = 30;
    public coverImage: any = [];
    public dataLoaded: boolean = false;
    public showLoader: boolean = false;
    public submittedOnce: boolean = false;
    public businessShopId: string;
    meridian = true;
    public form: FormGroup;
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public location: Location,
        public businessShopService: BusinessShopService,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute) {
        this.form = this.formBuilder.group({
            busninessShop: this.formBuilder.group({
                description: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessShopId = params.value.id;
    }

    ngOnInit() {
        this.dayWiseTimings = [
            {
                startTime: null,
                endTime: null,
                day: 'Monday',
                saveTitle: 'monday',
                id: 0
            }, {
                startTime: null,
                endTime: null,
                day: 'Tuesday',
                saveTitle: 'tuesday',
                id: 1
            }, {
                startTime: null,
                endTime: null,
                day: 'Wednesday',
                saveTitle: 'wednesday',
                id: 2
            }, {
                startTime: null,
                endTime: null,
                day: 'Thursday',
                saveTitle: 'thursday',
                id: 3
            }, {
                startTime: null,
                endTime: null,
                day: 'Friday',
                saveTitle: 'friday',
                id: 4
            }, {
                startTime: null,
                endTime: null,
                day: 'Saturday',
                saveTitle: 'saturday',
                id: 5
            }, {
                startTime: null,
                endTime: null,
                day: 'Sunday',
                saveTitle: 'sunday',
                id: 6
            },
        ]
        this.coverImage = [{
            coverImageDom: document.querySelector(`#coverSquare`),
            coverImageFile: null,
            coverImageId: null,
            coverFormData: null
        }];
        if (this.businessShopId) {
            this.getBusinessShop();
            this.title = arabicText.Edit_Bussiness_Shop;
        } else {
            this.dataLoaded = true;
            this.title = arabicText.Add_Bussiness_Shop;
        }
    }

    public convert(obj) {
        let dayIndex = {
            monday: 0,
            tuesday: 1,
            wednesday: 2,
            thursday: 3,
            friday: 4,
            saturday: 5,
            sunday: 6
        }
        let startTime, endTime;
        let days = Object.keys(obj);
        for (let i = 0; i < days.length; i++) {
            startTime = obj[days[i]].startTime.split(':');
            endTime = obj[days[i]].endTime.split(':');
            this.dayWiseTimings[dayIndex[days[i]]].startTime = { hour: null, minute: null };
            this.dayWiseTimings[dayIndex[days[i]]].endTime = { hour: null, minute: null };
            this.dayWiseTimings[dayIndex[days[i]]].startTime['hour'] = parseInt(startTime[0]);
            this.dayWiseTimings[dayIndex[days[i]]].startTime['minute'] = parseInt(startTime[1]);
            this.dayWiseTimings[dayIndex[days[i]]].endTime['hour'] = parseInt(endTime[0]);
            this.dayWiseTimings[dayIndex[days[i]]].endTime['minute'] = parseInt(endTime[1]);
        }
        this.dataLoaded = true;
    }
    public cancel() {
        this.location.back();
    }
    

    public getBusinessShop() {
        this.businessShopService.getShopBusinessById(this.businessShopId)
            .subscribe((response: any) => {
                let data = response;
                this.form.patchValue({
                    busninessShop: {
                        description: data.shop.description
                    }
                });
                this.coverImage[0].coverImageDom.style.backgroundImage = data.shop.coverImageSquare ? `url(${this.getImagePath(data.shop.coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[0].coverImageId = data.shop.coverImageSquare ? data.shop.coverImageSquare : null;
                if (data.shop.dayWiseTiming) {
                    this.convert(data.shop.dayWiseTiming);
                } else {
                    this.dataLoaded = true;
                }
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
        let busninessShop = <any>this.form.controls.busninessShop;
        let dayWiseTiming = {};
        for (let i = 0; i < this.dayWiseTimings.length; i++) {
            if (this.dayWiseTimings[i].startTime && this.dayWiseTimings[i].endTime) {
                var startTime = this.dayWiseTimings[i].startTime.hour + (0.01 * this.dayWiseTimings[i].startTime.minute);
                var endTime = this.dayWiseTimings[i].endTime.hour + (0.01 * this.dayWiseTimings[i].endTime.minute);
                if (startTime < endTime) {
                        dayWiseTiming[this.dayWiseTimings[i].saveTitle] = { startTime: this.dayWiseTimings[i].startTime.hour.toString() + ':' + this.dayWiseTimings[i].startTime.minute.toString(), endTime: this.dayWiseTimings[i].endTime.hour.toString() + ':' + this.dayWiseTimings[i].endTime.minute.toString() }
                } else {
                    this._snackbar.open(`${arabicText.Start_time_must_be_less_than_end_time}(${this.dayWiseTimings[i].day})`, 'HIDE', { duration: 9000 });
                    this.showLoader = false;
                    return;
                }
            } else if (this.dayWiseTimings[i].startTime) {
                this._snackbar.open(`${arabicText.End_time_of} ${this.dayWiseTimings[i].day} ${arabicText.Required_otherWise_don_enter_remove_start_date}`, 'HIDE', { duration: 9000 });
                this.showLoader = false;
                return;
            } else if (this.dayWiseTimings[i].endTime) {
                this._snackbar.open(`${arabicText.Start_time_of} ${this.dayWiseTimings[i].day} ${arabicText.Required_otherWise_don_enter_remove_end_date}`, 'HIDE', { duration: 9000 });
                this.showLoader = false;
                return;
            }
        }
        let data = {
            description: busninessShop.controls.description.value,
            dayWiseTiming: dayWiseTiming,
            coverImageSquare: this.coverImage[0].coverImageId
        }
        if (this.businessShopId) {
             this.businessShopService.updateBusinessShop(this.businessShopId, data)
                .subscribe((response: Response) => {
                    this.cancel();
                    this.showLoader = false;
                     this._snackbar.open(arabicText.Business_Shop_updated_successfully, 'HIDE', { duration: 3000 });
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        } else {
            this.businessShopService.createBusinessShop(data)
                .subscribe((response: Response) => {
                    this.showLoader = false;
                     this._snackbar.open(arabicText.Business_Shop_created_successfully, 'HIDE', { duration: 3000 });
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
    public applyToAll() {
        for (let i = 1; i < this.dayWiseTimings.length; i++) {
            this.dayWiseTimings[i].startTime = this.dayWiseTimings[0].startTime;
            this.dayWiseTimings[i].endTime = this.dayWiseTimings[0].endTime;
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