import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { BusinessShopService } from '../../services/manageBusinessShop.service';
import { BusinessShopItemsService } from '../../services/manageBusinessShopItems.service'
import { ManageChef } from '../../services/manageChef.service';
import { ConfirmDialog } from '../confirm-popup/confirm.popup'
import { emailRegexp, numberOnlyRegExp, contactRegExp, allowedCategories, getImageUrl, imageUrl, arabicText, youtubeUrlRegexp } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

declare var google;

@Component({
    selector: 'activity-form',
    templateUrl: './businessShopDetails.template.html',
    styleUrls: ['./style.scss']
})
export class BusinesShopDetailsComponent implements OnInit {
    public arabicText = arabicText;
    public title: string = arabicText.Manage_Bussiness_Shop_Details;
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public businessShopId: string;
    public businessShopDetails: any;
    public dayWiseTimings: any;
    selectedOption: string;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public dialog: MdDialog,
        public _router: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public businessShopItemsService: BusinessShopItemsService,
        public _route: ActivatedRoute,
        public manageChef: ManageChef,
        public businessShopService: BusinessShopService) {
        this.form = this.formBuilder.group({
            busninessFood: this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessShopId = params.value.id;
    }

    ngOnInit() {
        this.businessShopDetails = {
            shop: {
                coverImageSquare: null,
                title: '',
                description: '',
            },
            shopItems:[]
        }
        this.getBusinessShopDetail();
    }

    public getBusinessShopDetail() {
        this.businessShopService.getShopBusinessById(this.businessShopId)
            .subscribe((response: Response) => {
                this.businessShopDetails = response;
                this.businessShopDetails.shop['days'] = Object.keys(this.businessShopDetails.shop.dayWiseTiming)
                for (let i = 0; i < this.businessShopDetails.shop.days.length; i++) {
                    this.businessShopDetails.shop.dayWiseTiming[this.businessShopDetails.shop.days[i]].endTime = this.tConvert(this.businessShopDetails.shop.dayWiseTiming[this.businessShopDetails.shop.days[i]].endTime);
                    this.businessShopDetails.shop.dayWiseTiming[this.businessShopDetails.shop.days[i]].startTime = this.tConvert(this.businessShopDetails.shop.dayWiseTiming[this.businessShopDetails.shop.days[i]].startTime);
                }
            }, (error: Response) => {
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
   
   public setAvailable(event,shop){
       shop.isAvailable = event.checked;
       this.businessShopItemsService.updateBusinessShopItem(shop._id,{isAvailable: event.checked}).subscribe((response: Response)=>{
           this._snackbar.open(arabicText.success.Shop_Item_Updated_Successfully, 'HIDE', { duration: 3000 });
       },(error: Response)=>{
           shop.isAvailable = !event.checked;
           this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
       })
   }
    
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }

}

