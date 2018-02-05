import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/component';
import { AppWebRoutes } from './app-web-routes';
import { DashboardComponent } from './components/dashboard/component';
import { ChangePasswordComponent } from './components/changepassword/component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot.component';
import { ResetPasswordComponent } from './components/reset-password/reset.component';

// import Manage Business component 
import { BussinessListComponent } from './components/manage_business/list.component'
import { BusinessFormComponent } from './components/manage_business/form.component'
import { ManageBusinesFoodComponent } from './components/manage_business_food/manageBusinessFood.component'
import { BusinesFoodDetailsComponent } from './components/manage_business_food/businessFoodDetails.component'
import { AddChef } from './components/add-chef/add-chef.component'
import { ChefDetails } from './components/add-chef/chefDetails.component'
import { AddMenuFormComponent } from './components/food_menu/addMenu.component'
import { BusinesAccomodationsDetailsComponent } from './components/manage_business_accomodations/businessAccomodationsDetails.component'
import { ManageBusinesAccomodationsComponent } from './components/manage_business_accomodations/manageBusinessAccomodations.component'
import { ManageAccomodationsCategory } from './components/manage_accomodation_category/manageAccomodationsCategory'
import { ManageCategoryDetails } from './components/manage_category_details/manageCategoryDetails.component'
import { AccomodationCategoryDetailsComponent } from './components/accomodation_category_details/accomodationCategoryDetails.component'
import { ManageBanquetMenu } from './components/banquet_menus/banquet-menus.component'
import { BusinesShopDetailsComponent } from './components/manage_business_shop/businessShopDetails.component';
import { ManageBusinesShopComponent } from './components/manage_business_shop/manageBusinessShop.component';
import { ManageBusinesShopItemsComponent } from './components/manage_business_shop_items/manageBusinessShopItems.component'
import { AccountDetailComponent } from './components/account/detail.component';
import { ChangePasswordLoginComponent } from './components/changepasswordlogin/change.component';
import { OfferListComponent } from './components/offer/offerList.component';
import { ManageOfferComponent } from './components/offer/manageOffer.component';
import { QuotationListComponent } from './components/quotation/quotationList.component';
import { ContactListComponent } from './components/contactus/list.component';
import { FeedbackListComponent } from './components/feedback/list.component';
import { HomeComponent } from './components/home/home.component';

const dashboardRoutes = [
    { path: AppWebRoutes.MANAGE_BUSINESS, component: BussinessListComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_EDIT, component: BusinessFormComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_FOOD_ADD, component: ManageBusinesFoodComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_FOOD_UPDATE, component: ManageBusinesFoodComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_FOOD_DETAILS, component: BusinesFoodDetailsComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_ACCOMODATIONS_ADD, component: ManageBusinesAccomodationsComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_ACCOMODATIONS_UPDATE, component: ManageBusinesAccomodationsComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_ACCOMODATIONS_DETAILS, component: BusinesAccomodationsDetailsComponent },
    { path: AppWebRoutes.ACCOMODATIONS_ADD_CATEGORY, component: ManageAccomodationsCategory },
    { path: AppWebRoutes.ACCOMODATIONS_EDIT_CATEGORY, component: ManageAccomodationsCategory },
    { path: AppWebRoutes.ACCOMODATIONS_DETAILS_CATEGORY, component: ManageCategoryDetails },
    { path: AppWebRoutes.ADD_CHEF, component: AddChef },
    { path: AppWebRoutes.EDIT_CHEF, component: AddChef },
    { path: AppWebRoutes.CHEF_DETAILS, component: ChefDetails },
    { path: AppWebRoutes.ADD_MENU, component: AddMenuFormComponent },
    { path: AppWebRoutes.EDIT_MENU, component: AddMenuFormComponent },
    { path: AppWebRoutes.CATEGORY_DETAILS, component: AccomodationCategoryDetailsComponent },
    { path: AppWebRoutes.CATEGORY_DETAILS_BANQUET, component: AccomodationCategoryDetailsComponent },
    { path: AppWebRoutes.ADD_BANQUET_MENU, component: ManageBanquetMenu },
    { path: AppWebRoutes.EDIT_BANQUET_MENU, component: ManageBanquetMenu },
    { path: AppWebRoutes.MANAGE_BUSINESS_SHOP_ADD, component: ManageBusinesShopComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_SHOP_UPDATE, component: ManageBusinesShopComponent },
    { path: AppWebRoutes.MANAGE_BUSINESS_SHOP_DETAILS, component: BusinesShopDetailsComponent },
    { path: AppWebRoutes.ADD_SHOP_ITEMS, component: ManageBusinesShopItemsComponent },
    { path: AppWebRoutes.EDIT_SHOP_ITEMS, component: ManageBusinesShopItemsComponent },
    { path: AppWebRoutes.ACCOUNT, component: AccountDetailComponent },
    { path: AppWebRoutes.CHANGE_PASSWORD_LOGINED, component: ChangePasswordLoginComponent },
    { path: AppWebRoutes.MANAGE_OFFER, component: OfferListComponent },
    { path: AppWebRoutes.MANAGE_OFFER_ADD, component: ManageOfferComponent },
    { path: AppWebRoutes.MANAGE_QUOTATION, component: QuotationListComponent },
    { path: AppWebRoutes.MANAGE_OFFER_EDIT, component: ManageOfferComponent },
    { path: AppWebRoutes.MANAGE_CONTACT, component: ContactListComponent },
    { path: AppWebRoutes.MANAGE_FEEDBACK, component: FeedbackListComponent },
    { path: '', component: HomeComponent },
    { path: AppWebRoutes.DASHBOARD, component: HomeComponent },
];

const appRoutes: Routes = [
    { path: AppWebRoutes.LOGIN, component: LoginComponent },
    { path: AppWebRoutes.CHANGE_PASSWORD, component: ChangePasswordComponent },
    { path: AppWebRoutes.FORGOT_PASSWORD, component: ForgotPasswordComponent },
    { path: AppWebRoutes.RESET_PASSWORD, component: ResetPasswordComponent },
    { path: '', component: DashboardComponent, children: dashboardRoutes },
];

export const routing = RouterModule.forRoot(appRoutes);