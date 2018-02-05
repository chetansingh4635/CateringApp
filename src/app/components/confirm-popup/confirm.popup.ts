import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { Response } from "@angular/http";
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { HttpService } from '../../services/http.service';
import { LocalStorage } from '../../services/localStorage.service';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { contactRegExp, arabicText } from '../../constants';



@Component({
    selector: 'dialog-result-example-dialog',
    templateUrl: './confirmPopUp.html',
})
export class ConfirmDialog {
    public arabicText = arabicText;
    constructor(public dialogRef: MdDialogRef<ConfirmDialog>) { }
}