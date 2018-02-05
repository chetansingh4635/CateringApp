import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, RequestOptions, Http, XHRBackend } from '@angular/http';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Login Component
import { LoginComponent } from './components/login/component'
import { ChangePasswordComponent } from './components/changepassword/component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot.component';
import { ResetPasswordComponent } from './components/reset-password/reset.component';

//Dashboard Component
import { DashboardModule } from './components/dashboard/module';
/**
 * Services 
 */
import { HttpService } from './services/http.service';
import { LocalStorage } from './services/localStorage.service';
import { ForgotPasswordService } from './services/forgotPassword.service';
import { ResetPasswordService } from './services/resetPassword.service';
import { BusinessService } from './services/manageBusiness.service';
import { BusinessFoodService } from './services/manageBusinessFood.service'
import { MapService } from './services/map.service';
import { ManageChef } from './services/manageChef.service';
import { AddMenu } from './services/addMenu.service';
import { BusinessAccomodationsService } from './services/manageBusinessAccomodations.service';
import { ManageAccomodationCategoryService } from './services/manageAccomodationsCategory.services';
import { BanquetMenuServices } from './services/banquetMenu.service';
import { BusinessShopService } from './services/manageBusinessShop.service';
import { BusinessShopItemsService } from './services/manageBusinessShopItems.service';
import { OfferService } from './services/offer.service';
import { HomeService } from './services/home.services';

/* Validation*/
import { CustomValidationService } from './customValidation/validation';

/**
 * 
 * @param backend 
 * @param defaultOptions 
 * @param router 
 */
export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions, router: Router) {
  return new HttpService(backend, defaultOptions, router);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MaterialModule,
    DashboardModule,
    ReactiveFormsModule,
    routing,
    HttpModule,
    MdNativeDateModule,
    // NgbModule
  ],
  providers: [
    {
      provide: HttpService,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, Router]
    },
     { provide: LocalStorage, useValue: 'test' },
    CustomValidationService,
    ForgotPasswordService,
    ResetPasswordService,
    BusinessService,
    BusinessFoodService,
    ManageChef,
    MapService,
    AddMenu,
    BusinessAccomodationsService,
    ManageAccomodationCategoryService,
    BanquetMenuServices,
    BusinessShopService,
    BusinessShopItemsService,
    OfferService,
    HomeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
