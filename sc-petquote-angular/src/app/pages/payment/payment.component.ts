import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from "@angular/core";
import { QuoteModel } from "src/app/models/quote.model";
import { CopyModel } from "src/app/models/copy.model";
import { QuoteFormComponent } from "src/app/components/quote-form/quote-form.component";
import { Router } from "@angular/router";
import { HelpIconComponent } from "src/app/components/help-icon/help-icon.component";
import { MessageService } from "src/app/services/message.service";
import { ValidateModel } from "src/app/models/validate.model";
import { DatePickerComponent } from "src/app/components/date-picker/date-picker.component";
import { Subscription } from "rxjs";
import { Pet } from "src/app/models/pet.model";
import { AjaxService } from "src/app/services/ajax.service";
import { QuoteResultModel } from "src/app/models/quote.result.model";
import { QuoteAnimalModel } from "src/app/models/quote.animal.model";
import { ComponentService } from "src/app/services/component.service";
import { TrackingService } from "src/app/services/tracking.service";
import { CheckDescriptionBoxComponent } from "src/app/components/check-description-box/check-description-box.component";
import { RecaptchaComponent } from "ng-recaptcha";
import { CustomerLeadModel } from "src/app/models/customer-lead.model";
import { ApplicationBodyModel } from "src/app/models/application.body.model";
declare var TweenMax: any;
declare var Quart: any;
declare var $: any;

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements OnInit, OnDestroy,  AfterViewInit  {

  @ViewChild("paymentSection", {static: true}) paymentSection: ElementRef;
  @ViewChild("quoteform", {static: true}) quoteForm: QuoteFormComponent;
  @ViewChild("premiumHelp", {static: true}) premiumHelp: HelpIconComponent;
  @ViewChild("premiumDatePicker", {static: true}) premiumDatePicker: DatePickerComponent;
  @ViewChild("declarationBox", {static: false}) declarationBox: CheckDescriptionBoxComponent;
  @ViewChild("agreeCCTermsBox", {static: false}) agreeCCTermsBox: CheckDescriptionBoxComponent;
  @ViewChild("captchaRef", {static: false}) captchaRef: RecaptchaComponent;
  public quote: QuoteModel;
  public copy = CopyModel;
  public complete = false;
  public paymentStartRange: Date;
  public paymentEndRange: Date;
  public subscription: Subscription;
  public showNotAccountHolderPopup = false;
  public showPaymentDeclined = false;
  public enableBack = true;
  public showBack = true;
  public declarationCopy: string;
  public totalDollar = "";
  public totalCents = "";

  public focusMethod = false;
  public declarationInvalid = false;
  public creditCardTermsInvalid = false;
  public submitClicked = false;
  public updateLeadData = false;
  public applicationBody: ApplicationBodyModel;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private componentService: ComponentService,
    private tracking: TrackingService) {

      this.quote = QuoteModel.getInstance();
      this.chooseDateRange();
      this.validate();
      this.subscription = this.messageService.getMessage().subscribe( message => {
        switch (message.id) {
          case MessageService.onNext:
            TweenMax.fromTo(this.paymentSection.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
          case MessageService.applicationComplete:
            this.applicationComplete(message.body);
            break;
        }
      });
  }
  ngOnInit(): void {
    this.tracking.virtualPageView("/apply/payment", "Payment");
    this.tracking.whenPageLoads();
    let hasPetCare: boolean = false;
    let hasAccipet: boolean = false;
    this.quote.pets.forEach((pet: Pet, index: number) => {
      if (pet.selectedPlan === "petcare") {
        hasPetCare = true;
      }
      if (pet.selectedPlan === "accipet") {
        hasAccipet = true;
      }
    });
    if (hasAccipet && hasPetCare) {
      this.declarationCopy = CopyModel.declarationPetBoth;
    } else if (hasPetCare) {
      this.declarationCopy = CopyModel.declarationPetCare;
    } else if (hasAccipet) {
      this.declarationCopy = CopyModel.declarationAcciPet;
    } else {
      this.declarationCopy = CopyModel.declarationPetBoth;
    }
    this.calculateTotals();
    this.showPaymentDeclined = this.quote.paymentDeclined;
    if (this.showPaymentDeclined) {
      this.quote.agreedCreditCardTerms = true;
      this.quote.readDeclaration = true;
      this.complete = true;
      this.enableBack = false;
      this.messageService.sendMessage(MessageService.creditCardFail);
      this.loadQuote();

    } else {
      this.tracking.payemntLoad();
    }

  }
  displayValidation(): void {

    this.declarationInvalid = false;
    this.creditCardTermsInvalid = false;
    if (!this.quote.readDeclaration) {
      this.declarationInvalid = true;
      this.declarationBox.setError(true);
    }
    if (this.quote.paymentMethod.Code === "CREDIT") {
      if (!this.quote.agreedCreditCardTerms) {
        this.creditCardTermsInvalid = true;
      }
    }
  }
  trackField(name: string): void {
    this.tracking.formInteract(8, name);
  }
  trackFieldError(error: string, name: string): void {
    this.tracking.formError(8, name, error);
  }
  ngAfterViewInit(): void {
    this.setDateRange();
  }
  calculateTotals(): void {
    if (this.quote.quoteResultModel !== undefined) {
      const d: any = this.quote.quoteResultModel.Total.toFixed(2).toString().split(".");
      this.totalDollar = d[0];
      this.totalCents = d[1];
      if (this.totalCents.length === 1) {
        this.totalCents += "0";
      }
    }
  }
  private chooseDateRange(): void {
    this.setDateRange();
  }
  loadQuote(): void {
    this.componentService.loadingNotification("Loading quote data");
    this.ajaxService.getQuote(this.quote.quoteBody(0, 0, -1)).subscribe((quoteValue: QuoteResultModel) => {
      this.quote.quoteResultModel = quoteValue;
      quoteValue.Animals.forEach((pet: QuoteAnimalModel, index: number) => {
         this.quote.pets[index].animalQuote = pet;
      });
      this.calculateTotals();
      this.componentService.destroyLoading();
      this.validate();
      if (this.showPaymentDeclined) {
        this.tracking.payemntLoad();
      }
    },
    (err: any) => {
      this.ajaxService.handleError("Ajax payment page load quote error", err);
    });
  }
  setPaymentMethod(code: string): void {
    this.quote.paymentMethod = CopyModel.getPaymentMethod(code);
    this.chooseDateRange();
    this.quote.paymentDate = new Date(this.paymentStartRange);
    this.loadQuote();
  }
  private setDateRange(): void {
    this.paymentStartRange = new Date(this.quote.policyStartDate);
    this.paymentStartRange.setDate(this.paymentStartRange.getDate() + (this.quote.paymentMethod.Code === "DD" ? 13 : 1));
    this.paymentEndRange = new Date(this.quote.policyStartDate);
    this.paymentEndRange.setDate(this.paymentEndRange.getDate() + 30);
    if (this.quote.paymentDate === undefined || this.quote.paymentDate === null) {
      this.quote.paymentDate = this.paymentStartRange;
    }
  }
  public validate(): void {
    this.complete = true;
    if (this.quote.paymentMethod.Code === "DD") {
      if (this.quote.bankAccountHolderName.trim() === "") {
        this.complete = false;
      }
      if (!this.quote.authorityToOperateBankAccount) {
        this.complete = false;
      }
      if (!ValidateModel.validateBankAccount(this.quote.bankAccountNumber)) {
        this.complete = false;
      }
    } else if (this.quote.paymentMethod.Code === "CREDIT") {
      if (!this.quote.agreedCreditCardTerms) {
        this.complete = false;
      }
    }
    if (!this.quote.readDeclaration) {
      this.complete = false;
    }
  }
  public back(): void {
    this.quote.readDeclaration = false;
    if (this.quote.paymentDeclined) {
      this.quote.paymentDeclined = false;
      this.router.navigate(["apply/summary"]).then( (e) => {
        this.messageService.sendMessage(MessageService.onBack);
      });
    } else {
      TweenMax.to(this.paymentSection.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(["apply/summary"]).then( (e) => {
          this.messageService.sendMessage(MessageService.onBack);
        });
      }, ease: Quart.easeOut});
    }
  }
  public executeReCaptcha(): void {
    if (!this.submitClicked) {
      this.submitClicked = true;
      this.captchaRef.execute();
    }
  }
  public submit(captchaToken: string): void {
    if(this.updateLeadData) {
      this.ajaxService.leadSubmit(captchaToken,"completed").subscribe((app: CustomerLeadModel) => {
        this.componentService.destroyLoading();
        if (this.applicationBody.paymentMethodCode === "DD") {
          this.router.navigate(["/apply/submit"]);
        }
        if ( this.applicationBody.paymentMethodCode === "CREDIT") {
          window.location.href =  this.applicationBody.paymentPage;
        }
      });
    } else {
      if (this.complete) {
        this.quote.receiveEmailsAboutEllenco = true;
        this.quote.receiveEmailsAboutSx = true;
        this.quote.paymentDeclined = false;
        this.ajaxService.applicationSubmit(captchaToken);
      }
    }
  }
  public applicationComplete(value: ApplicationBodyModel):void {
    this.updateLeadData = true;
    this.applicationBody = value;
    this.captchaRef.reset();
    this.captchaRef.execute();
    console.log(MessageService.applicationComplete + " Payment");
  }
  public authorityChange(): void {
    this.showNotAccountHolderPopup = this.quote.authorityToOperateBankAccount === false;
    if (this.quote.authorityToOperateBankAccount && this.quote.paymentMethod.Code === "DD" &&
    this.quote.bankAccountHolderName.trim() === "") {
      this.quote.bankAccountHolderName = this.quote.firstname + " " + this.quote.lastname;
    }
    this.validate();
  }
  public closeNotAccountHolderPopup(): void {
    this.showNotAccountHolderPopup = false;
  }
  public closePaymentDeclined(): void {
    this.showPaymentDeclined = false;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.updateLeadData = false;
  }
  tabInMethod(): void {
    this.focusMethod = true;
  }
  tabOutMethod(): void {
    this.focusMethod = false;
  }
  keydownMethod(e: any): void {
    switch (e.keyCode) {
      case 39:
        this.setPaymentMethod("CREDIT");
        break;
      case 37:
        this.setPaymentMethod("DD");
        break;
    }
  }
}
