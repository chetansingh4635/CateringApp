import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { OfferService } from '../../services/offer.service';
import { MdSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';
import { emailRegexp, numberOnlyRegExp, arabicText } from '../../constants';
import { CustomValidationService } from '../../customValidation/validation';


@Component({
    selector: 'offers-add-form',
    templateUrl: './manageOffer.template.html',
    styleUrls: ['./style.scss']
})
export class ManageOfferComponent implements OnInit {
    public arabicText = arabicText;
    public form: FormGroup;
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    public title: string = 'Add Offer';
    public businessId: string;
    public offersType: any;
    public offerId: string;
    public categoryList: any= ['Food','Accomodation'];
    public submittedOnce: boolean = false;
    constructor(
        public formBuilder: FormBuilder,
        public _http: HttpService,
        public _navigator: Router,
        public _snackbar: MdSnackBar,
        public custumValidator: CustomValidationService,
        public _route: ActivatedRoute,
        public offerservice: OfferService) {
        this.form = this.formBuilder.group({
            offerData: this.formBuilder.group({
                category: ['', [Validators.required]],
                description: ['', [Validators.required]],
                edit :[false,[]],
                validFrom: ['', [Validators.required]],
                validTill: ['', [Validators.required]],
                offerValue: ['', []],
                offerType: ['', [Validators.required]],
            }, { validator: this.custumValidator.ValidateOfferData })
        });
        this.businessId = this.userData ? this.userData.business : null;
        let params = <any>this._route.params;
        this.offerId = params.value.id;
    }

    ngOnInit() {
        this.offersType = environment.offersType;
        if (this.offerId) {
            this.getOfferById();
        }

    }

    public offerToUpdate; null;
    public getOfferById() {
        this.offerservice.getOfferById(this.offerId).subscribe(data => {
            this.offerToUpdate = data;
            this.form.patchValue({
                offerData: {
                    category: data['category'],
                    description: data['description'],
                    validFrom: data['validFrom'].substring(0, 10),
                    validTill: data['validTill'].substring(0, 10),
                    offerValue: data['offerValue'],
                    offerType: data['offerType'],
                    edit: true
                }
            });
            // todo;
        }, error => {
            this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
        })
    }
    public save(): void {
        if (!this.submittedOnce) this.submittedOnce = true;

        if (this.form.invalid) return;
        let offerData = <any>this.form.controls.offerData;
        let data = {
            "business": this.businessId,
            "category": offerData.controls.category.value,
            "description": offerData.controls.description.value,
            "validTill": offerData.controls.validTill.value,
            "validFrom": offerData.controls.validFrom.value,
            "offerValue": offerData.controls.offerValue.value,
            "offerType": offerData.controls.offerType.value,
        };
        data.validTill = new Date(data.validTill).getTime();
        data.validFrom = new Date(data.validFrom).getTime();
        if (data.offerType == 'OFFER') {
            delete data["offerValue"];
        }
        if (this.offerId) {
            delete data.business;
             delete data.category;
            this._http.put(`${environment.base_url}/offers/${this.offerId}`, data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.Offers_Updated_Successfully, 'HIDE', { duration: 3000 });
                    this._navigator.navigateByUrl(`/offers`);
                }, (error: Response) => {
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        } else {
            this._http.post(`${environment.base_url}/offers`, data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.Offers_Added_Successfully, 'HIDE', { duration: 3000 });
                    this._navigator.navigateByUrl(`/offers`);
                }, (error: Response) => {
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
        }

    }

}