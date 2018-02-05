import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { LocalStorage } from '../../services/localStorage.service';
import { HttpService } from '../../services/http.service';
import { contactRegExp, arabicText } from '../../constants';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'account-list',
    templateUrl: './detail.template.html',
    styleUrls: ['./style.scss', '../manage_business/style.scss']
})
export class AccountDetailComponent implements OnInit {
    public form: FormGroup;
    public arabicText = arabicText;
    public locationId: string;
    public UserInfo: any;
    public isEdit: boolean = false;
    public categoryType: any = [];
    public submittedOnce: boolean = false;
    public userData: any = new LocalStorage(environment.localStorageKeys.USER).value;
    constructor(public _http: HttpService, public _router: Router, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar, public formBuilder: FormBuilder, ) {
        this.form = this.formBuilder.group({
            accountData: this.formBuilder.group({
                fullName: ['', [Validators.required]],
                email: ['', [Validators.required]],
                mobile: ['', [Validators.required, Validators.pattern(contactRegExp)]],
            })
        });

    }

    ngOnInit() {
        this.getDetail();
    }
    public getDetail() {
        this._http.get(`${environment.base_url}/me`)
            .subscribe((response: Response) => {
                this.UserInfo = response.json();
                this.form.patchValue({
                    accountData: {
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
        let account = <any>this.form.controls.accountData;
        let data = {
            name: account.controls.fullName.value,
            mobile: account.controls.mobile.value,
        }
        this._http.put(`${environment.base_url}/managers/${this.UserInfo._id}`, data)
            .subscribe((response: Response) => {
                this._snackbar.open(arabicText.Account_updated_successfully, 'HIDE', { duration: 3000 });
                this.isEdit = false;
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
            });
    }
}