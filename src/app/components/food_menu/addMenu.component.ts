import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { environment } from '../../../environments/environment';
import { emailRegexp, numberOnlyRegExp, priceValue, allowedCategories, imageUrl, arabicText } from '../../constants';
import { AddMenu } from '../../services/addMenu.service'
import { ConfirmDialog } from '../confirm-popup/confirm.popup'
import { MdSnackBar, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { MapService } from '../../services/map.service';
import { Observable } from 'rxjs/Rx';
declare var google;

@Component({
    selector: 'business-form',
    templateUrl: './addMenu.template.html',
    styleUrls: ['./style.scss']
})
export class AddMenuFormComponent implements OnInit {
    public arabicText = arabicText;
    public form: FormGroup;
    public title: string = 'Add Menu';
    public submittedOnce: boolean = false;
    public images = [];
    public chefId: string;
    public foodId: String;
    public specialPrices: any = [];
    public showLoader: boolean = false;
    constructor(public mapsAPILoader: MapsAPILoader,
        public ngZone: NgZone,
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public location: Location,
        public _route: ActivatedRoute,
        public _navigator: Router,
        public addMenu: AddMenu,
        public _snackbar: MdSnackBar,
        public _router: Router,
        public mapService: MapService) {

        let params = <any>this._route.params;
        this.chefId = params.value.id;
        this.foodId = params.value.menuId;

        this.form = this.formBuilder.group({
            menuData: this.formBuilder.group({
                name: ['', [Validators.required]],
                description: ['', [Validators.required]],
                quantityPrice: ['', [Validators.required, Validators.pattern(priceValue)]]
            })
        });
    }

    ngOnInit() {
        this.images = [{
            coverDom: document.querySelector('#cover'),
            coverFile: null,
            coverFormData: null,
            coverId: null
        }, {
            coverDom: document.querySelector('#coverImageSquare'),
            coverFile: null,
            coverFormData: null,
            coverId: null
        }]
        if (this.foodId) {
            this.getFoodById();
        }
    }

    public getFoodById() {
        this.addMenu.getMenuById(this.foodId).subscribe(data => {
            let menuData = data;
            this.form.patchValue({
                menuData: {
                    name: menuData.name,
                    description: menuData.description,
                    quantityPrice: menuData.quantityPrice,
                }
            });
            this.specialPrices = menuData.specialPrices;
            this.images[0].coverDom.style.backgroundImage = menuData.coverImageSquare ? `url(${this.getImagePath(menuData.coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`;
            // this.images[1].coverDom.style.backgroundImage = menuData.coverImageSquare ? `url(${this.getImagePath(menuData.coverImageSquare)})` : `url(../../../assets/images/img_placeholder.svg)`;
            this.images[0].coverId = menuData.coverImageSquare;
            // this.images[1].coverId = menuData.coverImageSquare;
            this.chefId = menuData.chef;
            this.title = arabicText.Edit_Menu;
        }, (error: Response) => {
            this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
        })
    }
    public addSpecialPrice() {
        this.specialPrices.push({
            price: null,
            heading: null
        });
    }
    public cancel() {
        this.location.back();
    }
    public removeSpecialPrice(index) {
        this.specialPrices.splice(index, 1);
    }
    public save(): void {
        let menuData = <any>this.form.controls.menuData;
        let data = {
            name: menuData.controls.name.value,
            coverImageSquare: this.images[0].coverId,
            description: menuData.controls.description.value,
            quantityPrice: menuData.controls.quantityPrice.value,
            specialPrices: this.specialPrices,
            chef: this.chefId
        };
        if (this.foodId) {
            this.addMenu.updateMenuById(this.foodId, data).subscribe(data => {
                this._snackbar.open(arabicText.Menu_Updated_successfully, 'HIDE', { duration: 3000 });
                this.showLoader = false;
                this.cancel();
            }, (error: Response) => {
                this.showLoader = false;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        } else {
            this.addMenu.createMenu(data).subscribe(data => {
                this._snackbar.open(arabicText.Menu_Added_successfully, 'HIDE', { duration: 3000 });
                this.showLoader = false;
                this.cancel();
            }, (error: Response) => {
                this.showLoader = false;
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            });
        }

    }

    /* global method to fine image url */
    public getImagePath(imageId) {
        return imageUrl(imageId)
    }
    public extractImage(event, type): void {
        let reader = new FileReader();
        this.images[type].coverFile = <File>event.target.files[0];
        reader.readAsDataURL(this.images[type].coverFile);
        event.target.value = null;
        reader.onload = () => {
            this.images[type].coverDom.style.backgroundImage = `url(${reader.result})`;
            this.images[type].coverFormData = new FormData();
            this.images[type].coverFormData.append('file', this.images[type].coverFile);
            this.images[type].coverId = null;
        };
        reader.onerror = (error) => {
        };
    }

    public clearImage(type): void {
        this.images[type].coverDom.style.backgroundImage = 'url(../../../assets/images/img_placeholder.svg)';
        this.images[type].coverFormData = null;
        this.images[type].coverFile = null;
        this.images[type].coverId = null;
    }

    public uploadImage(): void {
        if (!this.submittedOnce) this.submittedOnce = true;
        if (this.form.invalid) return;
        for (let i = 0; i < this.specialPrices.length; i++) {
            if (this.specialPrices[i].price == null && this.specialPrices[i].heading == null) {
                this.specialPrices.splice(i, 1);
            } else if (this.specialPrices[i].price == "" && this.specialPrices[i].heading == "") {
                this.specialPrices.splice(i, 1);
            }
            else if (this.specialPrices[i].price == null || (this.specialPrices[i].price < 1 || this.specialPrices[i].price > 999999)) {
                return;
            } else if (this.specialPrices[i].heading == null) {
                return;
            }
        }
        if (this.images[0].coverId === null) {
            if (!this.images[0].coverFile) {
                this._snackbar.open(arabicText.Cover_Image_Required, 'HIDE', { duration: 3000 });
                return;
            }
        }
        this.showLoader = true;
        let imageUpload = [];
        let whichImage = [];
        if (!this.images[0].coverId) {
            imageUpload.push(this._http.post(`${environment.base_url}/files`, this.images[0].coverFormData));
            whichImage.push({ image: "cover", type: 0 });
        }
        if (imageUpload.length === 0) {
            this.save();
        } else {
            Observable.forkJoin(imageUpload)
                .subscribe((res: any) => {
                    for (let i = 0; i < whichImage.length; i++) {
                        this.images[whichImage[i].type].coverId = res[i].json()._id;
                    }
                    this.save();
                }, (error: Response) => {
                    this.showLoader = false;
                    this._snackbar.open(error.json()['details'], 'HIDE', { duration: 3000 });
                });
        }
    }
}