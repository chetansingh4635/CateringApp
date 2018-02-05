import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { LocalStorage } from '../../services/localStorage.service';
import { HttpService } from '../../services/http.service';
import { emailRegexp, userType, arabicText } from '../../constants'
import { environment } from '../../../environments/environment';
import { ResetPasswordService } from '../../services/resetPassword.service';
import { CustomValidationService } from '../../customValidation/validation';

@Component({
    selector: 'account-list',
    templateUrl: './reset.template.html',
    styleUrls: ['./style.scss']
})
export class ResetPasswordComponent implements OnInit {
    public form: FormGroup;
    public arabicText = arabicText;
    public submittedOnce: boolean = false;
    public key: string = "";
    constructor(public _http: HttpService, public _router: Router, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar, public formBuilder: FormBuilder, public resetPasswordService: ResetPasswordService, public _route: ActivatedRoute, public custumValidator: CustomValidationService) {
        this.form = this.formBuilder.group({
            resetPassword: this.formBuilder.group({
                newPassword: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(16)])],
                confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(16)])],
            }, { validator: this.custumValidator.validateConfirmPassword })
        });

    }

    ngOnInit() {
         let params = <any>this._route.queryParams;
         this.key = params.value.key;
    }
    public resetPassword(): void {
        if (!this.submittedOnce) this.submittedOnce = true;

        if (this.form.invalid) return;
        let resetPassword = <any>this.form.controls.resetPassword;
        let body = {
            newPassword: resetPassword.controls.newPassword.value,
            key: this.key
        }
        this.resetPasswordService.resetPassword(body)
            .subscribe(data => {
                this._snackbar.open("Password Changed Successfully", 'HIDE', { duration: 3000 });
                this._router.navigateByUrl('/login');
            }, error => {
                this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });
            })
    }


}