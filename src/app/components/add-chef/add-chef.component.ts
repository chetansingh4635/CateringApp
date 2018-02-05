import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { environment } from '../../../environments/environment';
import { ManageChef } from '../../services/manageChef.service';
import { emailRegexp, numberOnlyRegExp, contactRegExp,arabicText, allowedCategories, getImageUrl, imageUrl } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'activity-form',
    templateUrl: './add-chef.templete.html',
    styleUrls: ['./style.scss']
})
export class AddChef implements OnInit {
    public arabicText = arabicText;
    public title: string = 'Add Chef';
    public submittedOnce: boolean = false;
    public form: FormGroup;
    public businessFoodId: string;
    public chefId: string;
    public businessFoodDetails: any;
    public chefImage: any;
    public showLoader: boolean = false;
    public dayWiseTimings: any;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public location: Location,
        public _navigator: Router,
        public custumValidator: CustomValidationService,
        public _snackbar: MdSnackBar,
        public _route: ActivatedRoute,
        public _router: Router,
        public manageChef: ManageChef) {
        this.form = this.formBuilder.group({
            addChef: this.formBuilder.group({
                name: ['', [Validators.required]]
            })
        });
        let params = <any>this._route.params;
        this.businessFoodId = params.value.id;
        this.chefId = params.value.chefId
    }

    ngOnInit() {
        this.chefImage = {
            dom: document.querySelector('#chefImage'),
            file: null,
            id: null
        }
        this.businessFoodDetails = {
            coverImage: null,
            coverImageSquare: null,
            panaromicImage: []
        }
        if (this.chefId) {
            this.getChefDetails();
        }
    }

    public getChefDetails() {
        this.manageChef.getChefById(this.chefId)
            .subscribe((response: any) => {
                let chefData = response;
                this.businessFoodId = chefData.food;
                this.form.patchValue({
                    addChef: {
                        name: chefData.name,
                    }
                });
                this.title = arabicText.Edit_Chef;
                this.chefImage.dom.style.backgroundImage = chefData.image ? `url(${this.getImagePath(chefData.image)})` : `url(../../../assets/images/img_placeholder.svg)`;
                this.chefImage.id = chefData.image;
            }, (error: Response) => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
    }
    public cancel() {
        this.location.back();
    }
    public AddChef() {
        let addChef = <any>this.form.controls.addChef;
        let data = {
            name: addChef.controls.name.value,
            image: this.chefImage.id,
            food: this.businessFoodId
        }
        if (this.chefId) {
            this.manageChef.updateChefById(this.chefId, data).subscribe(data => {
                this._snackbar.open(arabicText.success.Chef_Updated_Successfully, 'HIDE', { duration: 3000 });
                this.showLoader = false;
                this._router.navigateByUrl(`business/food/chef/${this.chefId}`);
            }, (error: Response) => {
                this.showLoader = false;
                this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
            });
        } else {
            this.manageChef.createChef(data).subscribe(data => {
                this._snackbar.open(arabicText.success.Chef_Added_Successfully, 'HIDE', { duration: 3000 });
                this.showLoader = false;
                this._router.navigateByUrl(`business/food/details/${this.businessFoodId}`);
            }, (error: Response) => {
                this.showLoader = false;
                this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
            });
        }

    }

    public extractImage(event): void {
        let reader = new FileReader();
        this.chefImage.file = <File>event.target.files[0];
        reader.readAsDataURL(this.chefImage.file);
        event.target.value = null;
        reader.onload = () => {
            this.chefImage.dom.style.backgroundImage = `url(${reader.result})`;
            this.chefImage.id = null;
        };
        reader.onerror = (error) => {
        };
    }
    public clearImage(): void {
        this.chefImage.dom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
        this.chefImage.id = null;
        this.chefImage.file = null;
    }
    public uploadImage(): void {
        if (!this.submittedOnce) this.submittedOnce = true;
        if (this.form.invalid) return;
        if (this.chefImage.id === null) {
            if (this.chefImage.file) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('file', this.chefImage.file);
                this._http.post(`${environment.base_url}/files`, formData)
                    .subscribe((response: Response) => {
                        this.chefImage.id = response.json()._id;
                        this.AddChef();
                    }, (error: Response) => {
                        this.showLoader = false;
                        this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
                    });
            }
            else {
                this._snackbar.open(arabicText.errors.Chef_Image_Required, 'HIDE', { duration: 3000 });
            }
        } else {
            this.AddChef();
        }
    }
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }




}
