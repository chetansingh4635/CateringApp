import { FormControl, FormGroup, NG_VALIDATORS } from '@angular/forms';
import { Component, Injectable, Inject, forwardRef, Directive } from '@angular/core';
import { environment } from '../../environments/environment';
// validation function

@Injectable()
export class CustomValidationService {
    MinLenghthValue(min: FormControl) {
            if(min && min.value >= 0 && min.value < 1000){
                return null;
            }
            else {
                return {minNumberValue : true};
            }

    }
    MaxLenghthValue(max: FormControl) {
            if(max && max.value < 1000){
                return null;
            }
            else {
                return {maxNumberValue : true};
            }

    }
     valueRelay(group: FormGroup) {
         let min = group.controls["meterMin"].value, max = group.controls["meterMax"].value, value = group.controls["meterValue"].value;
            if(value && min && max && value > min && value <= max){
                 return null;
            }
            else {
                if(max < min){
                    return {maxInValid : true};
                }else{
                    return {ValueInValid : true};
                }          
            }
    }
    validateConfirmPassword(group: FormGroup){
        let newPassword = group.controls["newPassword"].value, confirmPassword = group.controls["confirmPassword"].value;
        if(newPassword && confirmPassword && confirmPassword === newPassword){
            return null;
        }else{
            return {
                confirmPasswordInvalid : true
            }
        }
    }
     validateChangeConfirmPassword(group: FormGroup){
        let newPassword = group.controls["newPassword"].value, confirmPassword = group.controls["confirmPassword"].value, oldPassword = group.controls["oldPassword"].value;
         if(oldPassword != newPassword){
             if(newPassword && confirmPassword && confirmPassword === newPassword){
            return null;
        }
        else{
            return {
                confirmPasswordInvalid : true
            }
        }
        }else{
            return {
                oldNewPasswordSame : true
            }
        }
       
    }
    ValidateOfferData(group: FormGroup){
        let flag = { 
            offerInvalid : true,
            dateInvalid : true,
            dateInvalidFrom:true
        };
        let date = new Date();
        let offerType = group.controls["offerType"].value, offerValue = group.controls["offerValue"].value, validFrom = group.controls["validFrom"].value,validTill = group.controls["validTill"].value
        let edit = group.controls["edit"].value;
        validTill = new Date(validTill);
        validFrom = new Date(validFrom);
        if(offerType && offerValue){
            if(offerType == environment.offersType[0].type && offerValue > 0 && offerValue <= 100){
                flag.offerInvalid = false;
            }
            else if(offerType == environment.offersType[1].type && offerValue > 0 && offerValue <= 9999){
                flag.offerInvalid = false;
            }
        }
        if(offerType && offerType == environment.offersType[2].type){
            flag.offerInvalid = false;
        }
        if((validFrom && validTill && (validTill > validFrom || (validFrom.getMonth()===validTill.getMonth() && validFrom.getDay() === validTill.getDay() && validFrom.getFullYear() === validTill.getFullYear())))){
            flag.dateInvalid = false;
        }
        if(edit || (validFrom > date || (validFrom.getMonth()===date.getMonth() && validFrom.getDay() === date.getDay() && validFrom.getFullYear() === date.getFullYear()) )){
            flag.dateInvalidFrom = false;
        }
        if(!flag.offerInvalid && !flag.dateInvalid && !flag.dateInvalidFrom) {
            return null;
        }else{
            if(!flag.offerInvalid)
            delete flag['offerInvalid'];
             if(!flag.dateInvalid)
            delete flag['dateInvalid'];
             if(!flag.dateInvalidFrom)
            delete flag['dateInvalidFrom'];
            return flag;
        }
 }
}
