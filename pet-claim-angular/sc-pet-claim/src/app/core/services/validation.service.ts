import { Injectable } from '@angular/core';
import CoreState from '../core.state';
import bankValidator from 'nz-bank-account-validator/lib/NZ-Bank-Account-Validator';
@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    validateNumberInput(event: any): boolean {
        if (event.charCode >= 48 && event.charCode <= 57 || event.keyCode === 8 ||
            event.charCode === 32 || event.keyCode === 39 || event.keyCode === 37 || event.keyCode === 46) {
            return true;
        }
        return false;
    }
    validatePhone(phone: string): boolean {
        if (phone === undefined) {
          return false;
        }
        if (phone.length < 7) {
          return false;
        }
        const reg: RegExp = /^((03|04|06|07|09)\d{7})|((021|022|025|027|028|029|020)\d{6,8})|((0508|0800|0900)\d{5,8})$/;
        return reg.test(phone);
    }
    validateEmail(email: string): boolean {
        const reg: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    }
    setDateTextValue(date: Date): string{
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() ;
    }
    validateYourDetails(state: CoreState): boolean{
        let valid = true;
        if (this.isEmptyString(state.firstName)) {
            valid = false;
        }
        if (this.isEmptyString(state.lastName)) {
            valid = false;
        }
        if (this.isEmptyString(state.petName)) {
            valid = false;
        }
        if (!this.validateEmail(state.email)){
            valid = false;
        }
        if (!this.validatePhone(state.contactNumber)){
            valid = false;
        }
        return valid;
    }
    isEmptyString(value: string): boolean{
        if (value === undefined || value === null){
            return true;
        }
        if (value.trim() === ''){
            return true;
        }
        return false;
    }
    validateBankAccount(accountNumber: string): boolean{
        const bankValue = accountNumber.substr(0, 2);
        const branchValue = accountNumber.substr(2, 4);
        const accountValue = accountNumber.substr(6, 7);
        const suffixValue = accountNumber.substr(13, 3);
        return bankValidator.validate(bankValue + '-' + branchValue + '-' + accountValue + '-' + suffixValue);
    }
    currencyFormat(value: string): string{
        return new Intl.NumberFormat('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}).format(Number(value));
    }
    urlParam(name: string): boolean{
        const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null){
           return false;
        } else {
           return true;
        }
    }
}
