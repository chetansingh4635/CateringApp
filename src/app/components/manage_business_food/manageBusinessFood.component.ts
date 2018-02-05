import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common'
import { emailRegexp, numberOnlyRegExp, imageUrl, youtubeUrlRegexp, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './manageBusinessFood.template.html',
    styleUrls: ['./style.scss']
})
export class ManageBusinesFoodComponent implements OnInit {
    public arabicText = arabicText;
    public time = { hour: 13, minute: 30 };
    public title: string = '';
    public hourStep = 1;
    public videos = [];
    public minuteStep = 30;
    public paranomicImage: any;
    public coverImage: any = [];
    public dataLoaded: boolean = false;
    public showLoader: boolean = false;
    public submittedOnce: boolean = false;
    public businessFoodId: string;
    meridian = true;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    public form: FormGroup;
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public location: Location,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute) {
        this.form = this.formBuilder.group({
            busninessFood: this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessFoodId = params.value.id;
    }

    ngOnInit() {
        this.paranomicImage = [];
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
        if (this.businessFoodId) {
            this.getBusinessFood();
        } else {
            this.dataLoaded = true;
            this.title = arabicText.Add_Bussiness_Food;
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
    validateYouTubeUrl(video) {
        var matches = video.youtubeModel.match(youtubeUrlRegexp);
        if (matches) {
            video.youtubeUrl = matches[1];
        } else {
            video.youtubeUrl = null
        }
    }
    public addVideos() {
        this.videos.push({
            title: "",
            youtubeModel: null,
            youtubeUrl: null,
            food: this.businessFoodId
        });
    }
    public removeVideos(index) {
        this.videos.splice(index, 1);
    }
    public uploadVideos() {
        let promiseArray = [];
        for (let i = 0; i < this.videos.length; i++) {
            if (this.videos[i].youtubeUrl != null && this.videos[i].title != "") {
                let data = {
                    youtubeUrl: this.videos[i].youtubeUrl,
                    title: this.videos[i].youtubeUrl,
                    food: this.businessFoodId,
                }
                promiseArray.push(this._http.post(`${environment.base_url}/videos`, data))
            }
        };
        if (promiseArray.length === 0) {
            this.showLoader = false;
            if (this.businessFoodId) {
                this._navigator.navigateByUrl(`/business/food/details/${this.businessFoodId}`);
            } else {
                this._navigator.navigateByUrl('/business');
            }
            this._snackbar.open(arabicText.Bussiness_Food_Added_Successfully, 'HIDE', { duration: 3000 });
        } else {
            Observable.forkJoin(promiseArray)
                .subscribe((response: any) => {
                    this._snackbar.open(arabicText.Bussiness_Food_Updated_Successfully, 'HIDE', { duration: 3000 });
                    this.showLoader = false;
                    if (this.businessFoodId) {
                        this._navigator.navigateByUrl(`/business/food/details/${this.businessFoodId}`);
                    } else {
                        this._navigator.navigateByUrl('/business');
                    }
                }, (error: Response) => {
                    this.showLoader = false;
                });
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
    public getBusinessFood() {
        this._http.get(`${environment.base_url}/businessfoods/${this.businessFoodId}`)
            .subscribe((response: Response) => {
                let data = response.json();
                this.form.patchValue({
                    busninessFood: {
                        title: data.foodDetails.title,
                        description: data.foodDetails.description
                    }
                });
                this.coverImage[0].coverImageDom.style.backgroundImage = data.foodDetails.coverImage ? `url(${this.getImagePath(data.foodDetails.coverImage)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[1].coverImageDom.style.backgroundImage = data.foodDetails.coverImageSquare ? `url(${this.getImagePath(data.foodDetails.coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[0].coverImageId = data.foodDetails.coverImage ? data.foodDetails.coverImage : null;
                this.coverImage[1].coverImageId = data.foodDetails.coverImageSquare ? data.foodDetails.coverImageSquare : null;
                for (let i = 0; i < data.foodDetails.panaromicImage.length; i++) {
                    this.paranomicImage.push({
                        displayTitle: "Paranomic Image",
                        peronomaImageDom: null,
                        peronomaImageFile: null,
                        peronomaImageId: data.foodDetails.panaromicImage[i],
                        peronomaFormData: null
                    })
                }
                this.makeParanomicImages(data.foodDetails.panaromicImage);
                let startTime: any;
                let endTime: any;
                if (data.foodDetails.dayWiseTiming) {
                    this.convert(data.foodDetails.dayWiseTiming);
                } else {
                    this.dataLoaded = true;
                }

                console.log(this.dayWiseTimings);
                this.title = arabicText.Edit_Business_Food;
            }, (error: Response) => {

            });
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
        let busninessFood = <any>this.form.controls.busninessFood;
        let panaromicImage = [];
        for (let i = 0; i < this.paranomicImage.length; i++) {
            panaromicImage.push(this.paranomicImage[i].peronomaImageId);
        }
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
            title: busninessFood.controls.title.value,
            description: busninessFood.controls.description.value,
            dayWiseTiming: dayWiseTiming,
            coverImage: this.coverImage[0].coverImageId,
            panaromicImage: panaromicImage,
            coverImageSquare: this.coverImage[1].coverImageId
        }
        if (this.businessFoodId) {
            this._http.put(`${environment.base_url}/businessfoods/${this.businessFoodId}`, data)
                .subscribe((response: Response) => {
                     this.showLoader = false;
                    this.uploadVideos();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        } else {
            this._http.post(`${environment.base_url}/businessfoods`, data)
                .subscribe((response: Response) => {
                    this.businessFoodId = response.json()._id;
                    this.uploadVideos();
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