import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LocalStorage } from '../../services/localStorage.service';
import { environment } from '../../../environments/environment';
import { arabicText } from '../../constants'
import { AppWebRoutes } from '../../app-web-routes'
import { MdSnackBar, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { BusinessService } from '../../services/manageBusiness.service'
@Component({
    selector: 'dashboard',
    templateUrl: './template.html',
    styleUrls: ['./style.scss']
})
export class DashboardComponent implements OnInit {
    public activeLI: string = '';
    businessId: string = '';
    public arabicText = arabicText;
    public businessDetails: any;
    public nestedUrl = ['', '', ''];
    public navListItems = [
        { path: AppWebRoutes.DASHBOARD, itemName: arabicText.SIDE_MENU.DASHBOARD },
        { path: AppWebRoutes.MANAGE_BUSINESS, itemName: arabicText.SIDE_MENU.MANAGE_BUSINESS },
        { path: null, itemName: arabicText.SIDE_MENU.MANAGE_CATEGORY },
        { path: AppWebRoutes.MANAGE_QUOTATION, itemName: arabicText.SIDE_MENU.MANAGE_QUOTATION },
        { path: AppWebRoutes.MANAGE_OFFER, itemName: arabicText.SIDE_MENU.MANAGE_OFFER },
        { path: AppWebRoutes.MANAGE_FEEDBACK, itemName: arabicText.SIDE_MENU.MANAGE_FEEDBACK },
        { path: AppWebRoutes.ACCOUNT, itemName: arabicText.SIDE_MENU.MANAGE_ACCOUNT },
        { path: AppWebRoutes.MANAGE_CONTACT, itemName: arabicText.SIDE_MENU.MANAGE_CONTACT },
    ]
    public nestedNavList = [];
    constructor(
        public _router: Router,
        public businessService: BusinessService,
        public _snackbar: MdSnackBar,
        public _activeRoute: ActivatedRoute) {

    }

    ngOnInit() {
        let authStore = new LocalStorage(environment.localStorageKeys.TOKEN).value;
        let userStore = new LocalStorage(environment.localStorageKeys.USER).value;
        if (!(authStore && authStore.token)) {
            this._router.navigateByUrl('/login');
        }
        else if (userStore && !userStore.isPasswordChanged) {
            this._router.navigateByUrl('/changepassword');
        }
        this.businessId = userStore ? userStore.business : null;
        if (this.businessId) {
            this.getBusiness();
        }
        this._router.events.subscribe(route => {

        });
    }

    navigate(listItem: any) {
        this.activeLI = listItem.itemName;
        if (listItem.path !== null) {
            this._router.navigateByUrl(listItem.path);
        }

    }
    navigateCategory(category) {
        if (!this.businessDetails.isUpdatedByManager) {
            this._snackbar.open("Update the business first then you are able to Add " + category, 'HIDE', { duration: 3000 });
            return;
        }
        if (this.businessDetails.food && category === 'Food')
            this._router.navigateByUrl(`business/food/details/${this.businessDetails.food._id}`);
        else if (this.businessDetails.shop && category === 'Shop')
            this._router.navigateByUrl(`business/shop/details/${this.businessDetails.shop._id}`);
        else if (category === 'Shop')
            this._router.navigateByUrl('/business/shop/add');
        else if (this.businessDetails.accomodation && category === 'Accomodation')
            this._router.navigateByUrl(`/business/accomodations/details/${this.businessDetails.accomodation._id}`)
        else if (category === 'Accomodation')
            this._router.navigateByUrl('/business/accomodations/add');
    }
    public async getBusiness() {
        this.businessService.getBusinessById(this.businessId)
            .subscribe(data => {
                this.businessDetails = data;
                this.nestedNavList =  this.businessDetails.allowedCategories;
            }, (error: Response) => {
                console.log(error);
            });
    }
    logout() {
        LocalStorage.clear();
        this._router.navigateByUrl('/login');
    }
}