import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MaterialModule,MdNativeDateModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './component';
import { AgmCoreModule } from "angular2-google-maps/core";
import { YoutubePlayerModule } from 'ng2-youtube-player';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap';
import { environment } from '../../../environments/environment';
import { ConfirmDialog } from '../confirm-popup/confirm.popup'
import { DateTimePickerModule } from 'ng-pick-datetime';
import { AccordionModule } from 'ngx-bootstrap/accordion';

//Manage Business Component
import { BussinessListComponent } from '../manage_business/list.component';
import { BusinessFormComponent } from '../manage_business/form.component';
import { ManageBusinesFoodComponent } from '../manage_business_food/manageBusinessFood.component';
import { BusinesFoodDetailsComponent } from '../manage_business_food/businessFoodDetails.component';
import { AddChef } from '../add-chef/add-chef.component';
import { ChefDetails } from '../add-chef/chefDetails.component'
import { AddMenuFormComponent } from '../food_menu/addMenu.component'
import { BusinesAccomodationsDetailsComponent } from '../manage_business_accomodations/businessAccomodationsDetails.component'
import { ManageBusinesAccomodationsComponent } from '../manage_business_accomodations/manageBusinessAccomodations.component'
import { ManageAccomodationsCategory } from '../manage_accomodation_category/manageAccomodationsCategory'
import { ManageCategoryDetails } from '../manage_category_details/manageCategoryDetails.component'
import { AccomodationCategoryDetailsComponent } from '../accomodation_category_details/accomodationCategoryDetails.component'
import { ManageBanquetMenu } from '../banquet_menus/banquet-menus.component';
import { BusinesShopDetailsComponent } from '../manage_business_shop/businessShopDetails.component';
import { ManageBusinesShopComponent } from '../manage_business_shop/manageBusinessShop.component';
import { ManageBusinesShopItemsComponent } from '../manage_business_shop_items/manageBusinessShopItems.component'
/* Account*/
import { AccountDetailComponent } from '../account/detail.component'
/* Change Password Login*/
import { ChangePasswordLoginComponent } from '../changepasswordlogin/change.component'
/* Offers*/
import { OfferListComponent } from '../offer/offerList.component';
import { ManageOfferComponent } from '../offer/manageOffer.component';
/* quotation*/
import { QuotationListComponent } from '../quotation/quotationList.component';
/* Contact Us*/
import { ContactListComponent } from '../contactus/list.component';
/* feedback*/
import { FeedbackListComponent, ImageDialog } from '../feedback/list.component'
/* home */
import { HomeComponent } from '../home/home.component';


@NgModule({
    declarations: [
        DashboardComponent,
        BussinessListComponent,
        BusinessFormComponent,
        ManageBusinesFoodComponent,
        BusinesFoodDetailsComponent,
        AddChef,
        ChefDetails,
        AddMenuFormComponent,
        BusinesAccomodationsDetailsComponent,
        ManageBusinesAccomodationsComponent,
        ManageAccomodationsCategory,
        ManageCategoryDetails,
        AccomodationCategoryDetailsComponent,
        ManageBanquetMenu,
        BusinesShopDetailsComponent,
        ManageBusinesShopComponent,
        ManageBusinesShopItemsComponent,
        AccountDetailComponent,
        ChangePasswordLoginComponent,
        OfferListComponent,
        ManageOfferComponent,
        QuotationListComponent,
        ContactListComponent,
        FeedbackListComponent,
        ImageDialog,
        HomeComponent,
        ConfirmDialog
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        DateTimePickerModule,
        AgmCoreModule.forRoot({
            apiKey: environment.GoogleMapsServicesApiKey,
            libraries: ["places"],
            language: 'ar'
        }),
        YoutubePlayerModule,
        NgxPaginationModule,
        PaginationModule.forRoot(),
        MdNativeDateModule,
        AccordionModule.forRoot(),
        NgbModule.forRoot()
    ],
    entryComponents :[
        ConfirmDialog,
        ImageDialog
    ],
    providers: [
    ],
    bootstrap: [DashboardComponent]
})
export class DashboardModule { }