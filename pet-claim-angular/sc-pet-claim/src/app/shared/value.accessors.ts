import {forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
export function inputFieldsetControlValueAccessor(extendedInputComponent: any): any {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => extendedInputComponent),
        multi: true
    };
}
export function validateEmail(email: string): boolean {
    const reg: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
}
