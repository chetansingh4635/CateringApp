import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { BusinessAccomodationsService } from '../../services/manageBusinessAccomodations.service';
import { ManageAccomodationCategoryService } from '../../services/manageAccomodationsCategory.services';
import { ManageChef } from '../../services/manageChef.service';
import { BanquetMenuServices } from '../../services/banquetMenu.service';
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, getImageUrl,arabicText, imageUrl, youtubeUrlRegexp } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { ConfirmDialog } from '../confirm-popup/confirm.popup';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './accomodationCategoryDetails.template.html',
    styleUrls: ['./style.scss']
})
export class AccomodationCategoryDetailsComponent implements OnInit {
    public title: string = '';
    public arabicText = arabicText;
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public accomodationCategoryId: string;
    public categoryDetails: any;
    public showLoader: boolean = false;
    public youtubeLinks: any;
    public youtubeVideoId: any;
    public banquetMenu: any = [];
    public menuCategory = ['Breakfast', 'Lunch', 'Dinner', 'Starters'];
    public accomodationId: string;
    public categoryId: string;
    public images: any = {};
    selectedOption: string;
    public youTubeTitle: any;
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public dialog: MdDialog,
        public _router: Router,
        public custumValidator: CustomValidationService,
        public businessAccomodationsService: BusinessAccomodationsService,
        public banquetMenuServices: BanquetMenuServices,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public manageChef: ManageChef,
        public manageAccomodationCategoryService: ManageAccomodationCategoryService) {
        let params = <any>this._route.params;
        this.accomodationCategoryId = params.value.id;
        this.categoryId = params.value.categoryId;
        this.accomodationId = params.value.accoId;
    }

    ngOnInit() {
        this.categoryDetails = {
            coverImage: null,
            coverImageSquare: null,
            panaromicImage: [],
            videos: [],
            images: [],
            isAvailable: false
        }
        this.images = {
            dom: document.querySelector('#addImage'),
            file: null
        };
        this.getcategoryDetails();
    }

    public setAvailable(event, categoryDetails) {
        categoryDetails.isAvailable = event.checked;
        this.manageAccomodationCategoryService.updateAccomodations(categoryDetails._id, { isAvailable: event.checked }).subscribe((response: Response) => {
            this._snackbar.open(arabicText.Category_updated_successfully, 'HIDE', { duration: 3000 });
        }, (error: Response) => {
            categoryDetails.isAvailable = !event.checked;
            this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
        });
    }
    public setShowOnDetailsImages(event, images) {
        images.showOnDetails = event.checked;
        this._http.put(`${environment.base_url}/images/${images._id}`, { showOnDetails: event.checked })
            .subscribe((response: Response) => {
                this._snackbar.open(arabicText.Image_updated_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                images.showOnDetails = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public getBanquetMenu(event?){
        console.log(event ? event: null);
        let body={accomodationCategory:this.categoryDetails._id};
        if(event && event.value){
            body['menuCategory'] = event.value
        }
        this.banquetMenuServices.getMenuFilter(body)
        .subscribe((response: Response) =>{
            this.banquetMenu = response['items'];
        });
    }
    public setShowOnDetailsVideos(event, videos) {
        videos.showOnDetails = event.checked;
        this._http.put(`${environment.base_url}/videos/${videos._id}`, { showOnDetails: event.checked })
            .subscribe((response: Response) => {
                this._snackbar.open(arabicText.success.Video_Updated_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                videos.showOnDetails = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public getcategoryDetails() {
        if (this.categoryId !== 'Banquets') {
            this.manageAccomodationCategoryService.getAccomodationsById(this.accomodationCategoryId)
                .subscribe((response: Response) => {
                    this.categoryDetails = response;
                    this.title = this.categoryDetails.category == 'Rooms' ? arabicText.Rooms : this.categoryDetails.category == 'Villas' ? arabicText.Villas : this.categoryDetails.category == 'Bunglows' ? arabicText.Bunglows : this.categoryDetails.category == 'Banquets' ? arabicText.Banquets : '';
                    this.title = this.title + ' ' + arabicText.DETAILS
                }, (error: Response) => {
                    this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
                });
        } else {
            this.businessAccomodationsService.getAccomodationCategoryById(this.accomodationCategoryId, this.categoryId)
                .subscribe((response: Response) => {
                    this.categoryDetails = response[0];
                     if(this.categoryId === 'Banquets'){
                            this.getBanquetMenu();
                        }
                    this.title = this.categoryDetails.category == 'Rooms' ? arabicText.Rooms : this.categoryDetails.category == 'Villas' ? arabicText.Villas : this.categoryDetails.category == 'Bunglows' ? arabicText.Bunglows : this.categoryDetails.category == 'Banquets' ? arabicText.Banquets : '';
                    this.title = this.title + ' ' + arabicText.DETAILS
                }, (error: Response) => {
                    this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
                });
        }

    }
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }
    validateYouTubeUrl(video) {
        var matches = video.match(youtubeUrlRegexp);
        if (matches) {
            this.youtubeVideoId = matches[1];
        } else {
            this.youtubeVideoId = null
        }
    }
    openDialogVideos(index, id, type) {
        let dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
            if (this.selectedOption) {
                if (type === "Video") {
                    this.deleteVideo(index, id);
                } else {
                    this.deleteImage(index, id);
                }

            }
        });
    }
    openDialogMenu(index, id, type) {
        let dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
            if (this.selectedOption) {
                this.deleteMenu(index, id);
            }
        });
    }
    private deleteMenu(index, id) {
        this.banquetMenuServices.deleteMenu(id).subscribe((data: any) => {
            this.banquetMenu.splice(index, 1);
        }, (error: Response) => {
            let err = error.json() ? error.json().description : arabicText.Conection_problem;
            this._snackbar.open(err, 'HIDE', { duration: 3000 });
        })
    }
    private uploadImageGallery(): void {
        if (this.images.file) {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('file', this.images.file);
            this.images.file = null;
            this._http.post(`${environment.base_url}/files`, formData)
                .subscribe((response: Response) => {
                    this.uploadActityImage(response.json()._id);
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
                });
        }
        else {
            this._snackbar.open(arabicText.errors.IMAGE_REQUIRED, 'HIDE', { duration: 3000 });
        }
    }
    private extractImageGallery(event): void {
        this.images.dom = document.querySelector('#addImage');
        this.images.file = <File>event.target.files[0];
        let reader = new FileReader();
        event.target.value = null;
        reader.readAsDataURL(this.images.file);
        reader.onload = () => {
            this.images.dom = { 'background-image': `url(${reader.result})` };
        };
        reader.onerror = (error) => {
        };
    }

    private uploadActityImage(id): void {
        let data = {
            file: id,
            accomodationCategory: this.categoryDetails._id,
        }
        this._http.post(`${environment.base_url}/images`, data)
            .subscribe((response: Response) => {
                this._snackbar.open(arabicText.success.Image_Uploaded_Successfully, 'HIDE', { duration: 3000 });
                this.categoryDetails.images.push(response.json());
                this.showLoader = false;
                this.images.dom = { 'background-image': "url(../../../assets/images/img_placeholder.svg)" };
            }, (error: Response) => {
                this.showLoader = false;
                this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
            });
    }
    private deleteVideo(index, id) {
        this._http.delete(`${environment.base_url}/videos/${id}`)
            .subscribe((response: Response) => {
                this.categoryDetails.videos.splice(index, 1);
                this._snackbar.open(arabicText.success.Video_Deleted_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                let err = error.json() ? error.json().description : arabicText.Conection_Problem;
                this._snackbar.open(err, 'HIDE', { duration: 3000 });
            });
    }
    private deleteImage(index, id) {
        this._http.delete(`${environment.base_url}/images/${id}`)
            .subscribe((response: Response) => {
                this.categoryDetails.images.splice(index, 1);
                this._snackbar.open(arabicText.success.Image_Deleted_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                let err = error.json() ? error.json().description : arabicText.Conection_Problem;
                this._snackbar.open(err, 'HIDE', { duration: 3000 });
            });
    }
    private UploadYoutubeLink(link, title): void {
        if (!link) {
            this._snackbar.open(arabicText.Please_upload_a_valid_url_for_youtube, 'HIDE', { duration: 3000 });
            return
        }
        let data = {
            youtubeUrl: link,
            accomodationCategory: this.categoryDetails._id
        }
        this.youtubeLinks = null;
        if (link) {
            this._http.post(`${environment.base_url}/videos`, data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.success.Video_Uploaded_Successfully, 'HIDE', { duration: 3000 });
                    this.categoryDetails.videos.push(response.json());
                    this.youtubeVideoId = null
                    this.youTubeTitle = null;
                }, error => {
                    this._snackbar.open(arabicText.errors.Video_failed_to_Upload, 'HIDE', { duration: 3000 });
                    this.youtubeVideoId = null
                    this.youTubeTitle = null;
                });
        }
    }
    navigate(categoryDetails: any, category) {
        if ('availableRooms' in categoryDetails.accomodationDetails || 'availableVillas' in categoryDetails.accomodationDetails || 'availableBunglows' in categoryDetails.accomodationDetails || 'availableBanquets' in categoryDetails.accomodationDetails) {
            this._router.navigateByUrl(`business/accomodations/${categoryDetails.accomodationDetails._id}/${category}/details`);
        }
        else {
            this._router.navigateByUrl(`business/accomodations/${categoryDetails.accomodationDetails._id}/${category}/add`);
        }
    }


}
