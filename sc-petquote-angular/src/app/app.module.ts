import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { SafePipe } from "./pipes/safe.pipe";
import { ProgressTimelineComponent } from "./components/progress-timeline/progress-timeline.component";
import { PetDetailsComponent } from "./pages/pet-details/pet-details.component";
import { PetQuestionSelectComponent } from "./components/pet-question-select/pet-question-select.component";
import { PetItemComponent } from "./components/pet-item/pet-item.component";
import { ChoosePlanComponent } from "./pages/choose-plan/choose-plan.component";
import { PlansBoxesComponent } from "./components/plans-boxes/plans-boxes.component";
import { CheckBoxComponent } from "./components/check-box/check-box.component";
import { PolicyStartPaymentComponent } from "./components/policy-start-payment/policy-start-payment.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { DatepickerInputComponent } from "./components/datepicker-input/datepicker-input.component";
import { SelectBoxComponent } from "./components/select-box/select-box.component";
import { QuoteSummaryComponent } from "./pages/quote-summary/quote-summary.component";
import { RadioBtnComponent } from "./components/radio-btn/radio-btn.component";
import { AboutYouComponent } from "./pages/about-you/about-you.component";
import { DiscountQualificationComponent } from "./pages/discount-qualification/discount-qualification.component";
import { NextBackComponent } from "./components/next-back/next-back.component";
import { PetSummaryComponent } from "./components/pet-summary/pet-summary.component";
import { ApplyComponent } from "./pages/apply/apply.component";
import { CheckDescriptionBoxComponent } from "./components/check-description-box/check-description-box.component";
import { YesNoRadioButtonsComponent } from "./components/yes-no-radio-buttons/yes-no-radio-buttons.component";
import { HelpIconComponent } from "./components/help-icon/help-icon.component";
import { CardNumberInputComponent } from "./components/card-number-input/card-number-input.component";
import { BaseDirective } from "./directives/base.directive";
import { DigitOnlyDirective } from "./directives/digit-only.directive";
import { DOBInputComponent } from "./components/dobinput/dobinput.component";
import { MorePetDetailsComponent } from "./pages/more-pet-details/more-pet-details.component";
import { ApplySummaryComponent } from "./pages/apply-summary/apply-summary.component";
import { PaymentComponent } from "./pages/payment/payment.component";
import { BankAccountComponent } from "./components/bank-account/bank-account.component";
import { QuoteFormComponent } from "./components/quote-form/quote-form.component";
import { SubmitComponent } from "./pages/submit/submit.component";
import { RemovePetConfirmComponent } from "./components/remove-pet-confirm/remove-pet-confirm.component";
import { HelpComponent } from "./components/help/help.component";
import { PetAnimationComponent } from "./components/pet-animation/pet-animation.component";
import { TextInputComponent } from "./components/text-input/text-input.component";
import { SelectBoxOldComponent } from "./components/select-box-old/select-box-old.component";
import { PetQuestionTypeaheadComponent } from "./components/pet-question-typeahead/pet-question-typeahead.component";
import { TypeaheadInputComponent } from "./components/typeahead-input/typeahead-input.component";
import { AccessableSelectComponent } from "./components/accessable-select/accessable-select.component";
import { NoticeComponent } from "./components/notice/notice.component";
import { PaperlessDirectDebitComponent } from "./pages/paperless-direct-debit/paperless-direct-debit.component";
import { DeclarationDetailsComponent } from "./components/declaration-details/declaration-details.component";
import { PopupModalComponent } from "./components/popup-modal/popup-modal.component";
// eslint-disable-next-line max-len
import { RemoveAuthorisedPersonConfirmComponent } from "./components/remove-authorised-person-confirm/remove-authorised-person-confirm.component";

import { PaymentDeclinedModalComponent } from "./components/payment-declined-modal/payment-declined-modal.component";
import { PrivacyStatementModalComponent } from "./components/privacy-statement-modal/privacy-statement-modal.component";
import { CancelApplicationComponent } from "./components/cancel-application/cancel-application.component";
import { SendEmailComponent } from "./components/send-email/send-email.component";
import { HttpClientModule } from "@angular/common/http";
import { AddressSearchInputComponent } from "./components/address-search-input/address-search-input.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { ErrorNotificationComponent } from "./components/error-notification/error-notification.component";
import { LoadingNotificationComponent } from "./components/loading-notification/loading-notification.component";
import { RECAPTCHA_CLIENT_TOKEN } from "./components/recaptcha/recaptcha-token";
import { RecaptchaModule } from "./components/recaptcha/recaptcha.module";
import { loadConfigs } from "./services/config/config-loader";
import { ConfigService } from "./services/config/config.service";
import { getToken } from "./services/config/token-loader";
import { ToolTipComponent } from "./components/tool-tip/tool-tip.component";
import { GreenBannerComponent } from "./components/green-banner/green-banner.component";
import { DiscountModalComponent } from "./components/discount-modal/discount-modal.component";
import { CoPaymentModalComponent } from "./components/co-payment-modal/co-payment-modal.component";
import { TimeOutModalComponent } from "./components/time-out-modal/time-out-modal.component";
import { ApplicantDetailsComponent } from './pages/applicant-details/applicant-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SafePipe,
    ProgressTimelineComponent,
    PetDetailsComponent,
    PetQuestionSelectComponent,
    PetItemComponent,
    ChoosePlanComponent,
    PlansBoxesComponent,
    CheckBoxComponent,
    PolicyStartPaymentComponent,
    DatePickerComponent,
    SelectBoxComponent,
    QuoteSummaryComponent,
    RadioBtnComponent,
    AboutYouComponent,
    NextBackComponent,
    PetSummaryComponent,
    ApplyComponent,
    CheckDescriptionBoxComponent,
    YesNoRadioButtonsComponent,
    HelpIconComponent,
    CardNumberInputComponent,
    BaseDirective,
    DigitOnlyDirective,
    DOBInputComponent,
    MorePetDetailsComponent,
    ApplySummaryComponent,
    PaymentComponent,
    BankAccountComponent,
    QuoteFormComponent,
    SubmitComponent,
    RemovePetConfirmComponent,
    HelpComponent,
    PetAnimationComponent,
    TextInputComponent,
    SelectBoxOldComponent,
    PetQuestionTypeaheadComponent,
    TypeaheadInputComponent,
    AccessableSelectComponent,
    DiscountQualificationComponent,
    NoticeComponent,
    PaperlessDirectDebitComponent,
    DeclarationDetailsComponent,
    DatepickerInputComponent,
    PopupModalComponent,
    RemoveAuthorisedPersonConfirmComponent,
    PaymentDeclinedModalComponent,
    PrivacyStatementModalComponent,
    CancelApplicationComponent,
    AddressSearchInputComponent,
    SendEmailComponent,
    CalendarComponent,
    ErrorNotificationComponent,
    LoadingNotificationComponent,
    ToolTipComponent,
    GreenBannerComponent,
    DiscountModalComponent,
    CoPaymentModalComponent,
    TimeOutModalComponent,
    ApplicantDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: RECAPTCHA_CLIENT_TOKEN,
      useFactory: getToken,
      deps: [ConfigService],
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CalendarComponent,
    ErrorNotificationComponent,
    LoadingNotificationComponent,
    ToolTipComponent,
    GreenBannerComponent,
    DiscountModalComponent,
    CoPaymentModalComponent,
    TimeOutModalComponent
  ],
  exports: [
    CalendarComponent,
    ErrorNotificationComponent,
    LoadingNotificationComponent,
    ToolTipComponent,
    GreenBannerComponent,
    DiscountModalComponent,
    CoPaymentModalComponent,
    TimeOutModalComponent
  ],
})
export class AppModule {}
