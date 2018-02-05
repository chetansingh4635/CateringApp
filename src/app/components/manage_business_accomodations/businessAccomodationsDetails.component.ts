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
import { ManageChef } from '../../services/manageChef.service';
import { ConfirmDialog } from '../confirm-popup/confirm.popup';
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, getImageUrl, imageUrl, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './businessAccomodationsDetails.template.html',
    styleUrls: ['./style.scss']
})
export class BusinesAccomodationsDetailsComponent implements OnInit {
    public arabicText = arabicText;
    public title: string = arabicText.Manage_Bussiness_Accomodations_Details;
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public businessAccomodationsId: string;
    public businessAccomodationDetails: any;
    selectedOption: string;
    public allowedCategories: any = ['Rooms', 'Villas', 'Bunglows', 'Banquets'];
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public _router: Router,
        public dialog: MdDialog,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public manageChef: ManageChef,
        public businessAccomodationsService: BusinessAccomodationsService) {
        this.form = this.formBuilder.group({
            busninessFood: this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessAccomodationsId = params.value.id;
    }

    ngOnInit() {
        this.businessAccomodationDetails = {
            accomodationDetails: {
                coverImage: null,
                coverImageSquare: null,
                panaromicImage: [],
                images:[],
                videos:[]
            }
        }
        this.getBusinessAccomodationDetails();
    }
    openDialog(event,data, index, type) {
        let dialogRef = this.dialog.open(ConfirmDialog);
         data.showOnDetails = event.checked;
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
            if (this.selectedOption) {
                if (type === "Video") {
                    this.setShowOnDetailsVideos(event,data, index);
                } else {
                    this.setShowOnDetailsImages(event,data, index);
                }

            }else{
                 data.showOnDetails = !event.checked;
            }
        });
    }
     public videosList: any;
    tabVideoSelected(event) {
        switch (event.index) {
            case 2:
                this.videosList = this.businessAccomodationDetails.accomodationDetails.videos;
                break
            default:
                // do nothing
                break
        }


    }
    public setShowOnDetailsImages(event, images, index) {
        this._http.put(`${environment.base_url}/images/${images._id}`, { showOnDetails: event.checked })
            .subscribe((response: Response) => {
                this.businessAccomodationDetails.accomodationDetails.images.splice(index,1);
                this._snackbar.open(arabicText.Image_updated_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                images.showOnDetails = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
     public setShowOnDetailsVideos(event, videos, index) {
        this._http.put(`${environment.base_url}/videos/${videos._id}`, { showOnDetails: event.checked })
            .subscribe((response: Response) => {
                this.videosList.splice(index,1);
                this._snackbar.open(arabicText.success.Video_Updated_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                videos.showOnDetails = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public getBusinessAccomodationDetails() {
        this.businessAccomodationsService.getAccomodationsById(this.businessAccomodationsId)
            .subscribe((response: Response) => {
                this.businessAccomodationDetails = response;
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }

    public imageUrl(businessAccomodationDetails, category) {
        return category === this.allowedCategories[0] ? '../../assets/images/rooms_placeholder.png' : category === this.allowedCategories[1] ? '../../assets/images/villa_placeholder.png' : category === this.allowedCategories[2] ? '../../assets/images/bungalow_placeholder.png' : '../../assets/images/banquet_placeholder.png';
    }

    navigate(businessAccomodationDetails: any, category) {
        if (businessAccomodationDetails && businessAccomodationDetails.accomodationDetails && businessAccomodationDetails.accomodationDetails._id) {
            if ('availableBanquets' in businessAccomodationDetails.accomodationDetails && category == 'Banquets') {
                this._router.navigateByUrl(`business/accomodations/${category}/${businessAccomodationDetails.accomodationDetails._id}`);
            } else if ('availableRooms' in businessAccomodationDetails.accomodationDetails && category == 'Rooms') {
                this._router.navigateByUrl(`business/accomodations/${businessAccomodationDetails.accomodationDetails._id}/${category}/details`);
            } else if ('availableVillas' in businessAccomodationDetails.accomodationDetails && category == 'Villas') {
                this._router.navigateByUrl(`business/accomodations/${businessAccomodationDetails.accomodationDetails._id}/${category}/details`);
            } else if ('availableBunglows' in businessAccomodationDetails.accomodationDetails && category == 'Bunglows') {
                this._router.navigateByUrl(`business/accomodations/${businessAccomodationDetails.accomodationDetails._id}/${category}/details`);
            } else {
                this._router.navigateByUrl(`business/accomodations/${businessAccomodationDetails.accomodationDetails._id}/${category}/add`);
            }
        }
    }


}
