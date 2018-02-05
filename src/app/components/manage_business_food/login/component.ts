import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { environment } from '../../../environments/environment';
import { emailRegexp, arabicText } from '../../constants'

@Component({
    selector: 'app-login',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class LoginComponent implements OnInit {
    public form: any;
    public arabicText = arabicText;
    public submittedOnce: boolean = false;

    constructor(
        public _http: HttpService,
        public formBuilder: FormBuilder,
        public _snackbar: MdSnackBar,
        public vcr: ViewContainerRef,
        public _router: Router
    ) {

        // login form validations
        this.form = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegexp)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
    }

    ngOnInit() {
        let authStore = new LocalStorage(environment.localStorageKeys.TOKEN).value;

        /* check if already login redirect to default url. */
        if ((authStore && authStore.token)) {
            this._router.navigateByUrl('');
        }
    }

    // To check authentication of user
    login() {
        this.submittedOnce = true;
         if (this.form.invalid) return;
        let { email, password } = this.form.controls;
        this._http.post(`${environment.base_url}/managers/login`, { email: email.value, password: password.value })
            .subscribe((response: Response) => {
               let { user, auth } = response.json();
                user = {business: user.business,isPasswordChanged:user.isPasswordChanged};
                let userStore = new LocalStorage(environment.localStorageKeys.USER),
                    authStore = new LocalStorage(environment.localStorageKeys.TOKEN);
                userStore.value = user;
                authStore.value = auth;
                if(user.isPasswordChanged){
                    this._router.navigateByUrl('/');
                }else{
                    this._router.navigateByUrl('/changepassword');
                }
                
            }, (error: Response) => {
                this._snackbar.open(error.json().description, 'OK', { duration: 5000 });
            });
    }
}
