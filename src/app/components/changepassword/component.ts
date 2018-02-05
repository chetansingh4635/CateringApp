import { Component, ViewContainerRef } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { environment } from '../../../environments/environment';
import { emailRegexp, arabicText } from '../../constants'
import { CustomValidationService } from '../../customValidation/validation';

@Component({
    selector: 'app-login',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class ChangePasswordComponent {
    public form: any;
    public arabicText = arabicText;
    public submittedOnce: boolean = false;

    constructor(
        public _http: HttpService,
        public formBuilder: FormBuilder,
        public _snackbar: MdSnackBar,
        public custumValidator: CustomValidationService,
        public vcr: ViewContainerRef,
        public _router: Router
    ) {

        // login form validations
        this.form = this.formBuilder.group({
            changePassword: this.formBuilder.group({
            oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
            newPassword: ['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
            confirmPassword:['', Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(16)])],
        },{ validator: this.custumValidator.validateChangeConfirmPassword })
        });
    }

    // To check authentication of user
      change(): void {
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
                    LocalStorage.clear();
                    this._router.navigateByUrl('/login');
                }, (error: Response) => {
                    this._snackbar.open(error.json().description, 'HIDE', { duration: 3000 });
                });
    }
}
