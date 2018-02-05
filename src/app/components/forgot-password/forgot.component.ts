import { Component, OnInit } from '@angular/core';
import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router'
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { MdSnackBar } from '@angular/material';
import { LocalStorage } from '../../services/localStorage.service';
import { HttpService } from '../../services/http.service';
import { emailRegexp, userType, arabicText } from '../../constants'
import { environment } from '../../../environments/environment';
import { ForgotPasswordService } from '../../services/forgotPassword.service';

@Component({
    selector: 'account-list',
    templateUrl: './forgot.template.html',
   styleUrls: ['./style.scss']
})
export class ForgotPasswordComponent implements OnInit {
    public form: FormGroup;
    public arabicText= arabicText;
    public submittedOnce: boolean = false;
    constructor(public _http: HttpService, public _router: Router, public _formBuilder: FormBuilder, public _snackbar: MdSnackBar,  public formBuilder: FormBuilder,public forgotPasswordService: ForgotPasswordService,) {
         this.form = this.formBuilder.group({
            forgotPassword: this.formBuilder.group({
            email: ['', Validators.compose([Validators.required,Validators.pattern(emailRegexp)])],
            
        },)
        });

    }

    ngOnInit() {
    }
    public forgotPassword(): void {
        if(!this.submittedOnce) this.submittedOnce = true;

        if(this.form.invalid) return;
        let forgotPassword = <any>this.form.controls.forgotPassword;
        let body ={
            email : forgotPassword.controls.email.value,
            userType : userType
        }
         this.forgotPasswordService.forgotPassword(body)
         .subscribe(data => {
            this._snackbar.open(arabicText.Your_Reset_Send, 'HIDE', { duration: 6000 });
             this._router.navigateByUrl('/login');
        }, error => {
        this._snackbar.open(error.json()['description'], 'HIDE', { duration: 3000 });

        })
    }

    
}