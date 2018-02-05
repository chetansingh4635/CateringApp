import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { AddMenu } from '../../services/addMenu.service'
import { ManageChef } from '../../services/manageChef.service';
import { emailRegexp, numberOnlyRegExp, contactRegExp,arabicText, allowedCategories, getImageUrl, imageUrl } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'activity-form',
    templateUrl: './chefDetails.templete.html',
    styleUrls: ['./style.scss']
})
export class ChefDetails implements OnInit {
    public arabicText = arabicText;
    public title: string = 'Chef Details';
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public chefId: string;
    public chefDetails: any;
    public availability: any=null;
    public chefMenuList: any;
    public showLoader: boolean = false;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public _router: Router,
        public manageChef: ManageChef,
        public addMenu: AddMenu) {
        let params = <any>this._route.params;
        this.chefId = params.value.id
    }

    ngOnInit() {
        this.chefDetails = {
            name : "",
            image : ""
        }
        this.getChefDetails()
    }

    public getChefDetails(){
        this.manageChef.getChefById(this.chefId)
            .subscribe((response: Response) => {
                this.chefDetails = response;
                this.chefMenuList = this.chefDetails.menus;            
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
   public nevigateToAddMenu(){
       this._router.navigateByUrl(`business/food/chef/${this.chefDetails._id}/menu/add`);
   }

   public filterData(availability){
        let temp= [];
    if(availability === true || availability === false){
        for(let i=0;i<this.chefDetails.menus.length;i++){
            if(this.chefDetails.menus[i].isAvailable === availability){
                temp.push(this.chefDetails.menus[i]);
            }
        }
        this.chefMenuList = temp;
    }else{
        this.chefMenuList = this.chefDetails.menus;
    }
   }
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }
    public setAvailable (event, menu){
        menu.isAvailable = event.checked;
        this.addMenu.updateMenuById(menu._id,{isAvailable:event.checked}).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Menu_Updated_successfully, 'HIDE', { duration: 3000 });              
            }, (error: Response) => {
                 menu.isAvailable = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public setSpecial(event, menu){
        menu.isSpecial = event.checked;
        this.addMenu.updateMenuById(menu._id,{isSpecial:event.checked}).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Menu_Updated_successfully, 'HIDE', { duration: 3000 });              
            }, (error: Response) => {
                menu.isSpecial = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
     public setShowOnDetail (event, menu){
        menu.showOnDetails = event.checked;
        this.addMenu.updateMenuById(menu._id,{showOnDetails:event.checked}).subscribe((response: Response) => {
                this._snackbar.open(arabicText.Menu_Updated_successfully, 'HIDE', { duration: 3000 });              
            }, (error: Response) => {
                menu.showOnDetails = !event.checked;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }




}
