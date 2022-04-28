import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy} from "@angular/core";
import { QuoteModel } from "../../models/quote.model";
import { CopyModel } from "../../models/copy.model";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MessageService } from "src/app/services/message.service";
import { CheckDescriptionBoxComponent } from "src/app/components/check-description-box/check-description-box.component";
import { TextInputComponent } from "src/app/components/text-input/text-input.component";
import { SelectBoxComponent } from "src/app/components/select-box/select-box.component";
import { DatepickerInputComponent } from "src/app/components/datepicker-input/datepicker-input.component";
import { YesNoRadioButtonsComponent } from "src/app/components/yes-no-radio-buttons/yes-no-radio-buttons.component";
import { PrivacyStatementModalComponent } from "src/app/components/privacy-statement-modal/privacy-statement-modal.component";
import { AjaxService } from "src/app/services/ajax.service";
import { AddressSearchInputComponent } from "src/app/components/address-search-input/address-search-input.component";
import { TrackingService } from "src/app/services/tracking.service";
import { ComponentService } from "src/app/services/component.service";

declare var $: any;

declare var TweenMax: any;
declare var Quart: any;


@Component({
  selector: "app-apply",
  templateUrl: "./apply.component.html",
  styleUrls: ["./apply.component.scss"]
})
export class ApplyComponent implements OnInit, AfterViewInit, OnDestroy {

  public quote = QuoteModel.getInstance();
  public copy = CopyModel;
  public complete = false;
  public subscription: Subscription;
  public formerror = true;
  public checkafterinit = false;
  public showOtherPerson = false;
  public doEditAuthorisedPerson = false;
  public showPrivacyStatement = false;
  public addressSearchValue = "";
  public dobEndRange: Date;
  public dobStartRange: Date;

  @ViewChild("applyAboutYou", { static: true }) public applyAboutYou: ElementRef;
  @ViewChild("authorisedPersonSection", { static: true }) public authorisedPersonSection: ElementRef;

  @ViewChild("disclodeAuthorisedPerson") public disclodeAuthorisedPerson: CheckDescriptionBoxComponent;
  @ViewChild("agreeToTerms") public agreeToTerms: CheckDescriptionBoxComponent;
  @ViewChild("title") public title: SelectBoxComponent;
  @ViewChild("firstname") public firstname: TextInputComponent;
  @ViewChild("lastname") public lastname: TextInputComponent;
  @ViewChild("dob") public dob: DatepickerInputComponent;
  @ViewChild("addressSearch") public addressSearch: AddressSearchInputComponent;
  @ViewChild("phone") public phone: TextInputComponent;
  @ViewChild("email") public email: TextInputComponent;
  @ViewChild("petInsuranceNumber") public petInsuranceNumber: TextInputComponent;
  @ViewChild("memberCardNumber") public memberCardNumber: TextInputComponent;
  @ViewChild("authorisedPersonRadio") public authorisedPersonRadio: YesNoRadioButtonsComponent;
  @ViewChild("otherTitle") public otherTitle: SelectBoxComponent;
  @ViewChild("otherFirstname") public otherFirstname: TextInputComponent;
  @ViewChild("otherLastname") public otherLastname: TextInputComponent;
  @ViewChild("otherDOB") public otherDOB: DatepickerInputComponent;
  @ViewChild("otherPhone") public otherPhone: TextInputComponent;
  @ViewChild("otherEmail") public otherEmail: TextInputComponent;
  @ViewChild("privacyStatementModel") public privacyStatementModel: PrivacyStatementModalComponent;


  constructor(
    private router: Router,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private tracking: TrackingService,
    private componentService: ComponentService
    ) {
      this.subscription = this.messageService.getMessage().subscribe( message => {
        if (document.getElementById("tooltip") !== null)  {
          document.getElementById("tooltip").remove();
        }
        switch (message.id) {
          case MessageService.onBack:
            TweenMax.fromTo(this.applyAboutYou.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            this.checkafterinit = true;
            break;
          case MessageService.onNext:
            TweenMax.fromTo(this.applyAboutYou.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
          case MessageService.editAuthorisedPerson:
            TweenMax.fromTo(this.applyAboutYou.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
              this.doEditAuthorisedPerson = true;
            }, ease: Quart.easeOut});
            break;
        }
      });

      this.dobEndRange = new Date();
      this.dobEndRange.setFullYear( new Date().getFullYear() - 18);
      this.dobStartRange = new Date();
      this.dobStartRange.setFullYear( new Date().getFullYear() - 120);
  }
  ngOnInit(): void {
    this.tracking.virtualPageView("/apply/about-you", "Policyholder Details");
    this.tracking.whenPageLoads();
    this.tracking.applyLoad();

  }
  trackFieldError(error: string, name: string): void {
    this.tracking.formError(5, name, error);
  }
  trackField(name: string): void {
    this.tracking.formInteract(5, name);
  }
  trackDOBField(field: string): void {
    this.tracking.formInteract(5, "dob_" + field);
  }
  trackOtherDOBField(field: string): void {
    this.tracking.formInteract(5, "other_dob_" + field);
  }
  trackAuthPer(value: boolean): void {
    this.tracking.formInteract(5, "add_authorised_person_" + (value ? "yes" : "no"));
  }
  trackAddressField(field: string): void {
    this.tracking.formInteract(5, "address_" + field);
  }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.validateForm();
      if (this.doEditAuthorisedPerson) {
        this.showOtherPerson = true;
        this.quote.addAnotherAuthorisedPerson = true;
        this.otherTitle.tabIn();
        this.componentService.scrollTo((this.authorisedPersonSection.nativeElement as HTMLDivElement).offsetTop - 10);

      } else {
        this.showOtherPerson = this.quote.agreedTerms;
      }
    }, 1000);
  }
  private checkShowErrors(showerrors: boolean, target: any): void {
    if (showerrors) {
      target.validate();
    }
  }
  public validateTitle(): void {
    if (!this.title.isValid()) {
      this.checkShowErrors(true, this.title);
    }
  }
  public validateOtherTitle(): void {
    if (!this.otherTitle.isValid()) {
      this.checkShowErrors(true, this.otherTitle);
    }
  }
  public validate(showerrors: boolean = false): boolean {

    this.formerror = false;
    if (!this.title.isValid()) {
      this.checkShowErrors(showerrors, this.title);
      this.formerror = true;
    }
    if (!this.firstname.isValid()) {
      this.checkShowErrors(showerrors, this.firstname);
      this.formerror = true;
    }
    if (!this.lastname.isValid()) {
      this.checkShowErrors(showerrors, this.lastname);
      this.formerror = true;
    }
    const doberror: boolean = this.quote.dob === undefined || this.quote.dob == null;
    if (doberror) {
      this.formerror = true;
    }
    if (!this.phone.isValid()) {
      this.checkShowErrors(showerrors, this.phone);
      this.formerror = true;
    }
    if (!this.addressSearch.isValid()) {
      this.checkShowErrors(showerrors, this.addressSearch);
      this.formerror = true;
    }
    this.quote.addressIsManual = this.addressSearch.showManualFields;

    if (!this.email.isValid()) {
      this.checkShowErrors(showerrors, this.email);
      this.formerror = true;
    }
    if (!this.quote.agreedTerms) {
      this.checkShowErrors(showerrors, this.agreeToTerms);
      this.formerror = true;
    }
    this.showOtherPerson = !this.formerror || this.quote.hasShownOtherPerson;
    if (this.showOtherPerson) {
      this.quote.hasShownOtherPerson = true;
    }
    if (this.quote.addAnotherAuthorisedPerson === null || this.quote.addAnotherAuthorisedPerson === undefined ) {
      this.formerror = true;
    }
    if (this.quote.addAnotherAuthorisedPerson) {
      if (!this.otherTitle.isValid()) {
        this.checkShowErrors(showerrors, this.otherTitle);
        this.formerror = true;
      }
      if (!this.otherFirstname.isValid()) {
        this.checkShowErrors(showerrors, this.otherFirstname);
        this.formerror = true;
      }
      if (!this.otherLastname.isValid()) {
        this.checkShowErrors(showerrors, this.otherLastname);
        this.formerror = true;
      }
      if (!this.otherDOB.isValid() || this.otherDOB.value === null) {
        if (showerrors) {
          this.otherDOB.validateInputFields(4);
        }
        this.formerror = true;
      }
      if (!this.otherPhone.isValid()) {
        this.checkShowErrors(showerrors, this.otherPhone);
        this.formerror = true;
      }
      if (!this.otherEmail.isValid()) {
        this.checkShowErrors(showerrors, this.otherEmail);
        this.formerror = true;
      }
    }
    if (this.quote.addAnotherAuthorisedPerson && !this.quote.authorisedToDiscloseOther) {
      this.disclodeAuthorisedPerson.error = showerrors;
      this.formerror = true;
    }
    return this.formerror;
  }
  focusFirstName(): void {
    this.firstname.focusOn();
  }
  focusOtherFirstName(): void {
    this.otherFirstname.focusOn();
  }

  validateForm(): void {

    this.complete = !this.validate();
  }
  public privacyStatementChange(): void {
    this.validateForm();
    if (this.quote.agreedTerms) {
        setTimeout(() => {
          this.componentService.scrollTo((this.authorisedPersonSection.nativeElement as HTMLDivElement).offsetTop - 10);
        }, 250);
    }
  }
  public privacyStatementShow(event: any): void {
    this.showPrivacyStatement = true;
    this.privacyStatementModel.show = true;
  }
  public closeAcceptTerms(): void {
    this.agreeToTerms.show = false;
    this.showPrivacyStatement = false;
  }
  public toggleAcceptTerms(event: any): void {
    this.quote.agreedTerms = event.value === "1";
    this.agreeToTerms.show = false;
    this.validateForm();
    this.agreeToTerms.error = !this.quote.agreedTerms;
  }
  next(captchaToken: string): void {
    if (this.complete) {
      this.ajaxService.application(captchaToken).subscribe(() => {
        TweenMax.to(this.applyAboutYou.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
          this.messageService.sendMessage(MessageService.scrollToTimeline);
          this.router.navigate(["apply/some-more-pet-details"]).then( (e) => {
            this.messageService.sendMessage(MessageService.onNext);
          });
        }, ease: Quart.easeOut});
      },
      (err) => {
        this.ajaxService.handleError("Ajax apply next save application error", err);
      });
    }
  }
  back(): void {
    TweenMax.to(this.applyAboutYou.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate(["quote-summary"]).then( (e) => {
        this.messageService.sendMessage(MessageService.onBack);
      });
    }, ease: Quart.easeOut});
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  josnstringify(object: any): string {
    return JSON.stringify(object);
  }
}
