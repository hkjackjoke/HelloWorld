import bankValidator from 'nz-bank-account-validator/lib/NZ-Bank-Account-Validator';
import { BankAccountModel } from './bank-account.model';

export class ValidateModel {
    public static validateEmail(email: string): boolean {
        const reg: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    }
    public static validateBankAccount(bankAccount: BankAccountModel | string): boolean {
        let model: BankAccountModel;

        if (typeof bankAccount !== 'string') {
            model = bankAccount;
        } else {
            const { id, branch, base, suffix } = bankValidator.getPartsObject(bankAccount);
            model = new BankAccountModel(id ?? '', branch ?? '', base ?? '', suffix ?? '');
        }
        const isValid = model.bankNumber.length === 2 &&
        model.branch.length === 4 && model.account.length === 7 && model.suffix.length >= 2;

        return (isValid && bankValidator.validate(model.toFormattedString()));
    }
    public static schsPolicyNumber(value: string): boolean {
        return (value.length >= 4 && value.length <= 10) || value.length === 0;
    }
    public static validatePhone(phone: string): boolean {
        if (phone === undefined) {
            return false;

        }
        if (phone.length < 7) {
            return false;
        }
        const reg: RegExp = /^((03|04|06|07|09)\d{7})|((021|022|025|027|028|029|020)\d{6,8})|((0508|0800|0900)\d{5,8})$/;
        return reg.test(phone);
    }

    public static validateDOB(date: string): boolean {
        const reg: RegExp = /^([0-9]{2})+\/([0-9]{2})+\/([0-9]{4})$/;
        if (!reg.test(date)) {
            return false;
        }
        const testdate = new Date();
        const dates = date.split('/');
        const day = dates[0];
        const month = dates[1];
        const year = dates[2];

        const dayInt = Number(day);
        const monthInt = Number(month);
        const yearInt = Number(year);
        if (day.length === 2 && month.length === 2 && year.length === 4) {
            if (yearInt === testdate.getFullYear()) {
                if (monthInt > testdate.getMonth() + 1) {
                    return false;
                }
                if (monthInt === testdate.getMonth() + 1) {
                    if (dayInt > testdate.getDate()) {
                        return false;
                    }
                }
            }
            if (monthInt > 12) {
                return false;
            }
            if (dayInt > 31) {
                return false;
            }
            if (testdate.getFullYear() - yearInt > 110) {
                return false;
            }
            if (testdate.getFullYear() < yearInt) {
                return false;
            }
        }
        return true;
    }

    public static validatePolicyStartDate(date: string): boolean {
        const reg: RegExp = /^([0-9]{2})+\/([0-9]{2})+\/([0-9]{4})$/;
        if (!reg.test(date)) {
            return false;
        }
        const testdate = new Date();
        const dates = date.split('/');
        const day = dates[0];
        const month = dates[1];
        const year = dates[2];

        const dayInt = Number(day);
        const monthInt = Number(month);
        const yearInt = Number(year);
        if (day.length === 2 && month.length === 2 && year.length === 4) {
            if (yearInt === testdate.getFullYear()) {
                if (monthInt < testdate.getMonth() + 1) {
                    return false;
                }
                if (monthInt === testdate.getMonth() + 1) {
                    if (dayInt < testdate.getDate()) {
                        return false;
                    }
                }
            }
            if (monthInt > 12) {
                return false;
            }
            if (dayInt > 31) {
                return false;
            }
            if (testdate.getFullYear() - yearInt > 110) {
                return false;
            }
            if (yearInt < testdate.getFullYear()) {
                return false;
            }
        }
        return true;
    }
}
