import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafePipe } from '../core/pipes/safe.pipe';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { NumberOnlyDirective } from '../core/directives/number-only.directive';
import { NextBackComponent } from './components/next-back/next-back.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ToolTipComponent } from './components/tool-tip/tool-tip.component';
import { HelpIconComponent } from './components/help-icon/help-icon.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CurrencyOnlyDirective } from '../core/directives/currency-only.directive';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ReviewInvoiceComponent } from './components/review-invoice/review-invoice.component';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { SummaryHeaderComponent } from './components/summary-header/summary-header.component';
import { HeaderComponent } from './components/header/header.component';
import { PopupComponent } from './components/popup/popup.component';
import { LoadingNotificationComponent } from './components/loading-notification/loading-notification.component';
import { PetAnimationComponent } from './components/pet-animation/pet-animation.component';
import { TwoDigitDecimaNumberDirective } from '../core/directives/two-digit-decimal-number.directive';
import { NoPasteDirective } from '../core/directives/no-paste.directive';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { LettersNumbersDirective } from '../core/directives/letters-numbers.directive';
import { UploadMultipleFilesComponent } from './upload-multiple-files/upload-multiple-files.component';
@NgModule({
    declarations: [
        SafePipe,
        ProgressBarComponent,
        TextInputComponent,
        NumberOnlyDirective,
        LettersNumbersDirective,
        NoPasteDirective,
        TwoDigitDecimaNumberDirective,
        CurrencyOnlyDirective,
        CheckBoxComponent,
        NextBackComponent,
        CalendarComponent,
        ToolTipComponent,
        HelpIconComponent,
        ShoppingCartComponent,
        CartItemComponent,
        UploadFileComponent,
        ReviewInvoiceComponent,
        BankAccountComponent,
        SummaryHeaderComponent,
        HeaderComponent,
        PopupComponent,
        LoadingNotificationComponent,
        PetAnimationComponent,
        ErrorMessageComponent,
        UploadMultipleFilesComponent
    ],
    imports: [
        CommonModule,
        RecaptchaModule,
        FormsModule
    ],
    exports: [
        SafePipe,
        ProgressBarComponent,
        TextInputComponent,
        NumberOnlyDirective,
        LettersNumbersDirective,
        NoPasteDirective,
        TwoDigitDecimaNumberDirective,
        CurrencyOnlyDirective,
        CheckBoxComponent,
        NextBackComponent,
        CalendarComponent,
        ToolTipComponent,
        HelpIconComponent,
        ShoppingCartComponent,
        CartItemComponent,
        FormsModule,
        CommonModule,
        UploadFileComponent,
        ReviewInvoiceComponent,
        BankAccountComponent,
        SummaryHeaderComponent,
        RecaptchaModule,
        HeaderComponent,
        PopupComponent,
        LoadingNotificationComponent,
        PetAnimationComponent,
        ErrorMessageComponent,
        UploadMultipleFilesComponent
    ],
})
export class SharedModule { }
