import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar } from '@angular/material';
import { ManageAccomodationCategoryService } from '../../services/manageAccomodationsCategory.services';
import { environment } from '../../../environments/environment';
import { emailRegexp, numberOnlyRegExp, imageUrl, youtubeUrlRegexp, priceValue, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './manageAccomodationsCategory.template.html',
    styleUrls: ['./style.scss']
})
export class ManageAccomodationsCategory implements OnInit {
    public arabicText = arabicText;
    public time = { hour: 13, minute: 30 };
    public title: string = '';
    public hourStep = 1;
    public minuteStep = 30;
    public paranomicImage: any;
    public coverImage: any = [];
    public dataLoaded: boolean = false;
    public showLoader: boolean = false;
    public submittedOnce: boolean = false;
    public message: string = "";
    public businessAccomodationId: string;
    public accomodationCategoryId: string;
    public accomodationCategory: string;
    public accomodationType = ['Normal', 'Luxury', 'Premium', 'Delux', 'None']
    public category: string;
    public image: any = [];
    public videos: any = [];
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
        public manageAccomodationCategoryService: ManageAccomodationCategoryService,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute) {
        this.form = this.formBuilder.group({
            busninessAccomodations: this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]],
                rentalPrice: ['', [Validators.required, Validators.pattern(priceValue)]],
                carpetArea: ['', [Validators.required, Validators.pattern(priceValue)]],
                accomodationType: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessAccomodationId = params.value.accoId;
        this.category = params.value.category;
        this.accomodationCategoryId = params.value.categoryId;

    }

    ngOnInit() {
        this.paranomicImage = [];
        if (this.accomodationCategoryId) {
            this.getAccomodationCategory();
            this.title = `Edit Accomodations ${this.category}`;
            this.message = `Accomodations ${this.category} Updated Successfully`
        } else {
            this.title = `Add Accomodations ${this.category}`;
            this.message = `Accomodations ${this.category} created Successfully`
        }
    }
    ngAfterViewInit(){
         if (this.category != 'Banquets') {
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
        } else {
            this.coverImage = [{
                coverImageDom: document.querySelector(`#cover`),
                coverImageFile: null,
                coverImageId: null,
                coverFormData: null
            }];
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
    public getAccomodationCategory() {
        this.manageAccomodationCategoryService.getAccomodationsById(this.accomodationCategoryId)
            .subscribe((response: any) => {
                let data = response;
                this.form.patchValue({
                    busninessAccomodations: {
                        title: data.title,
                        description: data.description,
                        rentalPrice: data.rentalPrice,
                        carpetArea: data.carpetArea,
                        accomodationType: data.accomodationType
                    }
                });
                this.coverImage[0].coverImageDom.style.backgroundImage = data.coverImage ? `url(${this.getImagePath(data.coverImage)})` : `url(../../../assets/images/img_placeholder.svg)`
                this.coverImage[0].coverImageId = data.coverImage ? data.coverImage : null;
                if (this.category != 'Banquets') {
                    this.coverImage[1].coverImageDom.style.backgroundImage = data.coverImageSquare ? `url(${this.getImagePath(data.coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`
                    this.coverImage[1].coverImageId = data.coverImageSquare ? data.coverImageSquare : null;
                }
                for (let i = 0; i < data.panaromicImage.length; i++) {
                    this.paranomicImage.push({
                        displayTitle: "Paranomic Image",
                        peronomaImageDom: null,
                        peronomaImageFile: null,
                        peronomaImageId: data.panaromicImage[i],
                        peronomaFormData: null
                    })
                }
                this.makeParanomicImages(data.panaromicImage);
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
    public addImages() {
        this.image.push({
            displayTitle: "Image",
            imageDom: null,
            imageFile: null,
            imageId: null,
            imageFormData: null
        });
    }
    public removeImages(index) {
        this.image.splice(index, 1);
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
            accomodationCategory: this.accomodationCategory
        });
    }
    public removeVideos(index) {
        this.videos.splice(index, 1);
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
        } else if (type === 'Image') {
            let reader = new FileReader();
            this.image[index].imageFile = <File>event.target.files[0];
            this.image[index].imageDom = this.image[index].imageDom ? this.image[index].imageDom : document.querySelector(`#Image${index}`);
            reader.readAsDataURL(this.image[index].imageFile);
            event.target.value = null;
            reader.onload = () => {
                this.image[index].imageDom.style.backgroundImage = `url(${reader.result})`;
                this.image[index].imageFormData = new FormData();
                this.image[index].imageFormData.append('file', this.image[index].imageFile);
                this.image[index].imageId = null;
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
            accomodation: this.businessAccomodationId,
            category: this.category,
            rentalPrice: busninessFood.controls.rentalPrice.value,
            carpetArea: busninessFood.controls.carpetArea.value,
            accomodationType: busninessFood.controls.accomodationType.value
        };
        if (this.category != 'Banquets') {
            data['coverImageSquare'] = this.coverImage[1].coverImageId
        }
        if (this.accomodationCategoryId) {
            delete data['accomodation'];
            delete data['category'];
            this.manageAccomodationCategoryService.updateAccomodations(this.accomodationCategoryId, data)
                .subscribe((response: any) => {
                    this.accomodationCategory = response._id;
                    // this._snackbar.open("Bussiness Accomodations Updated Successfully", 'HIDE', { duration: 3000 });
                    this.uploadImages();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        } else {
            this.manageAccomodationCategoryService.createAccomodations(data)
                .subscribe((response: any) => {
                    this.accomodationCategory = response._id;
                    this.uploadImages();
                    // this._navigator.navigateByUrl(`/business/accomodations/details/${this.businessAccomodationId}`);
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        }


    }
    public uploadImages() {
        let promiseArray = [];
        for (let i = 0; i < this.image.length; i++) {
            if (this.image[i].imageId === null) {
                promiseArray.push(this._http.post(`${environment.base_url}/files`, this.image[i].imageFormData))
            }
        };
        for (let i = 0; i < this.videos.length; i++) {
            if (this.videos[i].youtubeUrl != null) {
                let data = {
                    youtubeUrl: this.videos[i].youtubeUrl,
                    accomodationCategory: this.accomodationCategory,
                }
                promiseArray.push(this._http.post(`${environment.base_url}/videos`, data))
            }
        };
        if (promiseArray.length === 0) {
            this.showLoader = false;
            this._snackbar.open(this.message, 'HIDE', { duration: 3000 });
            this.cancel();

        } else {
            Observable.forkJoin(promiseArray)
                .subscribe((response: any) => {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].json().contentType)
                            this.image[i].imageId = response[i].json()._id;
                    }
                    if (this.image.length) {
                        this.uploadImageAccomodation();
                    } else {
                        this.showLoader = false;
                        this._snackbar.open(this.message, 'HIDE', { duration: 3000 });
                        this.cancel();
                    }
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
                });
        }
    }
    public uploadImageAccomodation() {
        let promiseArray = [];

        for (let i = 0; i < this.image.length; i++) {
            let body = {
                accomodationCategory: this.accomodationCategory,
                file: this.image[i].imageId
            }
            promiseArray.push(this._http.post(`${environment.base_url}/images`, body))
        };
        Observable.forkJoin(promiseArray)
            .subscribe((response: any) => {
                this.showLoader = false;
                this._snackbar.open(this.message, 'HIDE', { duration: 3000 });
                this.cancel();
            }, (error: Response) => {
                this.showLoader = false;
                this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
            });
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
        if (this.category != 'Banquets') {
            if (this.coverImage[1].coverImageId === null) {
                if (!this.coverImage[1].coverImageFile) {
                    this._snackbar.open(arabicText.Cover_Image_Required, 'HIDE', { duration: 3000 });
                    return;
                }
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
        for (let i = 0; i < this.image.length; i++) {
            if (this.image[i].imageId === null) {
                if (!this.image[i].imageFile) {
                    this._snackbar.open("Image is Required or you can remove that image", 'HIDE', { duration: 3000 });
                    return;
                }
            }
        };
        for (let i = 0; i < this.videos.length; i++) {
            if (this.videos[i].youtubeUrl === null) {
                this._snackbar.open("Video is Required or you can remove that video", 'HIDE', { duration: 3000 });
                return;
            }
        };
        let promiseArray = [];
        let whichImage = [];
        if (this.coverImage[0].coverImageId === null) {
            promiseArray.push(this._http.post(`${environment.base_url}/files`, this.coverImage[0].coverFormData));
            whichImage.push({ image: "cover", type: 0 });
        }
        if (this.category != 'Banquets') {
            if (this.coverImage[1].coverImageId === null) {
                promiseArray.push(this._http.post(`${environment.base_url}/files`, this.coverImage[1].coverFormData));
                whichImage.push({ image: "cover", type: 1 });
            }
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
        } else if (type === 'Image') {
            this.image[index].peronomaImageDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
            this.image[index].peronomaImageFile = null;
            this.image[index].peronomaImageId = null;
        } else {
            this.coverImage[index].coverImageDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
            this.coverImage[index].coverImageFile = null;
            this.coverImage[index].coverImageId = null;
        }

    }
}