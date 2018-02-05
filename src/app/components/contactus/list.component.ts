import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { LocalStorage } from '../../services/localStorage.service';
import { HttpService } from '../../services/http.service';
import { contactRegExp, arabicText, emailRegexp } from '../../constants';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'contact-list',
    templateUrl: './list.template.html',
    styleUrls: ['./style.scss', '../manage_business/style.scss']
})
export class ContactListComponent implements OnInit {
    public form: FormGroup;
    public businessId: string;
    public arabicText= arabicText;
    public UserInfo: any;
    public categoryType: any = [];
    public submittedOnce: boolean = false;
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    constructor(public _http: HttpService, public _router: Router, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar, public formBuilder: FormBuilder, ) {
        this.form = this.formBuilder.group({
            contactUsData: this.formBuilder.group({
                fullName: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.pattern(emailRegexp)]],
                mobile: ['', [Validators.required,Validators.pattern(contactRegExp)]],
                message: ['', [Validators.required]],
                category: ['', [Validators.required]]
            })
        });

    }

    ngOnInit() {
        this.businessId = this.userData.business;
        this.getDetail();
        this.categoryType = [ { type: "Suggestion", id: 0,"Display":arabicText.categoryType.Suggestion },{ type: "Query", id: 1,"Display":arabicText.categoryType.Query },{ type: "Complaint", id: 2,"Display":arabicText.categoryType.Complaint }, { type: "Others", id: 3,"Display":arabicText.categoryType.Others }];
    }
    public getDetail() {
        this._http.get(`${environment.base_url}/me`)
            .subscribe((response: Response) => {
                this.UserInfo = response.json();
                this.form.patchValue({
                    contactUsData: {
                        fullName: this.UserInfo.name,
                        email: this.UserInfo.email,
                        mobile: this.UserInfo.mobile
                    }
                });
            }, (error: Response) => {
            });
    }

    public save(): void {
        if (!this.submittedOnce) this.submittedOnce = true;

        if (this.form.invalid) return;

        let contactUsData = <any>this.form.controls.contactUsData;

        let data = {
            fullName: contactUsData.controls.fullName.value,
            email: contactUsData.controls.email.value,
            mobile: contactUsData.controls.mobile.value,
            message: contactUsData.controls.message.value,
            userType: environment.userType,
            category: this.categoryType[contactUsData.controls.category.value].type,
        };
        this._http.post(`${environment.base_url}/contactus`, data)
            .subscribe((response: Response) => {
                this.submittedOnce = false;
                this.form.patchValue({
                    contactUsData: {
                        message: "",
                        category: 5
                    }
                });
                this._snackbar.open(arabicText.Contact_Created_Successfully, 'HIDE', { duration: 3000 });
                this._router.navigateByUrl('business');
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
    }
}