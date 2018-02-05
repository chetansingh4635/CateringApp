import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { BusinessFoodService } from '../../services/manageBusinessFood.service';
import { ManageChef } from '../../services/manageChef.service';
import { ConfirmDialog } from '../confirm-popup/confirm.popup'
import { AddMenu } from '../../services/addMenu.service'
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, getImageUrl, imageUrl, youtubeUrlRegexp, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './businessFoodDetails.template.html',
    styleUrls: ['./style.scss']
})
export class BusinesFoodDetailsComponent implements OnInit {
    public arabicText = arabicText;
    public title: string = arabicText.Manage_Bussiness_Food_Details;
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public businessId: string;
    public businessFoodDetails: any;
    public dayWiseTimings: any;
    public youtubeLinks: any;
    public youtubeVideoId: any;
    public youTubeTitle: any;
    selectedOption: string;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public dialog: MdDialog,
        public addMenu:AddMenu,
        public _router: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public manageChef: ManageChef,
        public businessFoodService: BusinessFoodService) {
        this.form = this.formBuilder.group({
            busninessFood: this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessId = params.value.id;
    }

    ngOnInit() {
        this.businessFoodDetails = {
            foodDetails: {
                coverImage: null,
                coverImageSquare: null,
                title: '',
                description: '',
                panaromicImage: []
            },
            chef: [],
            videos: [],
            images: []
        }
        this.getBusinessFoodDetail();
    }

    openDialogVideos(index, images, type, event?) {
        if(type == 'Images'){
             images.showOnDetails = event.checked;
        }
        let dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
            if (this.selectedOption) {
                if(type === 'Video'){
                    this.deleteVideo(index, images)
                }else{
                    this.setSpecial(event,images,index)
                } 
            }else{
                images.showOnDetails = !event.checked;
            }
        });
    }
    private deleteVideo(index, id) {
        this._http.delete(`${environment.base_url}/videos/${id}`)
            .subscribe((response: Response) => {
                this.businessFoodDetails.videos.splice(index, 1);
                this._snackbar.open(arabicText.success.Video_Deleted_Successfully, 'HIDE', { duration: 3000 });
            }, (error: Response) => {
                let err = error.json() ? error.json().description : arabicText.Conection_Problem;
                this._snackbar.open(err, 'HIDE', { duration: 3000 });
            });
    }
    public addChefNavigate() {
        this._router.navigateByUrl(`business/food/${this.businessId}/chef/add`);
    }
    public navigateToChef(id) {
        this._router.navigateByUrl(`business/food/chef/${id}`);
    }
    public getBusinessFoodDetail() {
        this.businessFoodService.getFoodBusinessById(this.businessId)
            .subscribe((response: Response) => {
                this.businessFoodDetails = response;
                this.businessFoodDetails.foodDetails['days'] = Object.keys(this.businessFoodDetails.foodDetails.dayWiseTiming)
                for (let i = 0; i < this.businessFoodDetails.foodDetails.days.length; i++) {
                    this.businessFoodDetails.foodDetails.dayWiseTiming[this.businessFoodDetails.foodDetails.days[i]].endTime = this.tConvert(this.businessFoodDetails.foodDetails.dayWiseTiming[this.businessFoodDetails.foodDetails.days[i]].endTime);
                    this.businessFoodDetails.foodDetails.dayWiseTiming[this.businessFoodDetails.foodDetails.days[i]].startTime = this.tConvert(this.businessFoodDetails.foodDetails.dayWiseTiming[this.businessFoodDetails.foodDetails.days[i]].startTime);
                }
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
     public setSpecial(event, menu, index){
        this.addMenu.updateMenuById(menu._id,{showOnDetails:event.checked}).subscribe((response: Response) => {
                this.businessFoodDetails.images.splice(index,1);
                this._snackbar.open("successfully Removed", 'HIDE', { duration: 3000 });              
            }, (error: Response) => {
                menu.showOnDetails = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public tConvert(time) {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]?[0-9]|2[0-3])(:)([0-5]?[0-9])?$/) || [time];
        if (time.length > 1) { // If time format correct
            time = time.slice(1);  // Remove full string match value
             time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
              time[0] = +time[0] % 12 || 12; // Adjust hours
            if(parseInt(time[0]) <= 9){
                time[0] = '0'+time[0];
            }
            if(parseInt(time[2]) <= 9){
                time[2] = '0'+time[2];
            }
           
        }
        return time.join(''); // return adjusted time or original string
    }
    public videosList: any;
    tabVideoSelected(event) {
        switch (event.index) {
            case 2:
                this.videosList = this.businessFoodDetails.videos;
                break
            default:
                // do nothing
                break
        }


    }
    private UploadYoutubeLink(link, title): void {
        if (!link) {
            this._snackbar.open('Please upload a valid url for youtube ', 'HIDE', { duration: 3000 });
            return
        }
        if (!title) {
            this._snackbar.open('Please Enter Title ', 'HIDE', { duration: 3000 });
            return
        }
        let data = {
            youtubeUrl: link,
            title: title,
            food: this.businessFoodDetails.foodDetails._id
        }
        this.youtubeLinks = null;
        if (link) {
            this._http.post(`${environment.base_url}/videos`, data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.success.Video_Uploaded_Successfully, 'HIDE', { duration: 3000 });
                    this.businessFoodDetails.videos.push(response.json());
                    this.youtubeVideoId = null
                    this.youTubeTitle = null;
                }, error => {
                    this._snackbar.open(arabicText.errors.Video_failed_to_Upload, 'HIDE', { duration: 3000 });
                    this.youtubeVideoId = null
                    this.youTubeTitle = null;
                });
        }
    }
    validateYouTubeUrl(video) {
        var matches = video.match(youtubeUrlRegexp);
        if (matches) {
            this.youtubeVideoId = matches[1];
        } else {
            this.youtubeVideoId = null
        }
    }
    public setActiveInactive(event, chef) {
        chef.isActive = event.checked;
        this.manageChef.updateChefById(chef._id, { isActive: event.checked }).subscribe((response: Response) => {
            this._snackbar.open("Chef updated successfully", 'HIDE', { duration: 3000 });
        }, (error: Response) => {
            chef.isActive = !event.checked;
            this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
        });
    }
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }




}

