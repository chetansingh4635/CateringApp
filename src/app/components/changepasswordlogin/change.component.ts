import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { LocalStorage } from '../../services/localStorage.service';
import { HttpService } from '../../services/http.service';
import { contactRegExp, arabicText } from '../../constants';
import { environment } from '../../../environments/environment';
import { CustomValidationService } from '../../customValidation/validation';

@Component({
    selector: 'account-list',
    templateUrl: './change.template.html',
    styleUrls: ['./style.scss', '../manage_business/style.scss']
})
export class ChangePasswordLoginComponent implements OnInit {
    public form: FormGroup;
    public arabicText = arabicText;
    public locationId : string;
    public UserInfo : any;
    public isEdit : boolean = false;
    public categoryType : any =[];
    public submittedOnce: boolean = false;
    public userData : any = new LocalStorage(environment.localStorageKeys.USER).value;
    constructor(public _http: HttpService, public _router: Router, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar,  public formBuilder: FormBuilder,public custumValidator: CustomValidationService,) {
         this.form = this.formBuilder.group({
            changePassword: this.formBuilder.group({
            oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
            newPassword: ['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
            confirmPassword:['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
        },{ validator: this.custumValidator.validateChangeConfirmPassword })
        });

    }

    ngOnInit() {
    }
    public save(): void {
        if(!this.submittedOnce) this.submittedOnce = true;

        if(this.form.invalid) return;
        let changePassword = <any>this.form.controls.changePassword;
         let data = {
             oldPassword:changePassword.controls.oldPassword.value,
             newPassword:changePassword.controls.newPassword.value
         }
          this._http.put(`${environment.base_url}/changepassword`, data)
                .subscribe((response: Response) => {
                    this._snackbar.open(arabicText.Change_Password_Successfuly, 'HIDE', { duration: 3000 });
                    this._router.navigateByUrl('/account');
                }, (error: Response) => {
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
    }

    
}