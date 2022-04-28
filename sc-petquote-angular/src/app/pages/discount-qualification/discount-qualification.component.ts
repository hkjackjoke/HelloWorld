import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import {QuoteModel } from "../../models/quote.model";
import {CopyModel } from "../../models/copy.model";
import { MessageService } from "src/app/services/message.service";
import { Subscription } from "rxjs";
import { ReferralModel } from "src/app/models/referral.model";
import { ComponentService } from "src/app/services/component.service";
import { TrackingService } from "src/app/services/tracking.service";
import { RecaptchaComponent } from "ng-recaptcha";
import { AjaxService } from "src/app/services/ajax.service";
import { CustomerLeadModel } from "src/app/models/customer-lead.model";
declare var TweenMax: any;
declare var Quart: any;
declare var $: any;

@Component({
  selector: "app-discount-qualification",
  templateUrl: "./discount-qualification.component.html",
  styleUrls: ["./discount-qualification.component.scss"]
})
export class DiscountQualificationComponent implements OnInit, OnDestroy {

  @ViewChild("discountQualification", {static: true}) public discountQualification: ElementRef;
  @ViewChild("captchaRef", {static: false}) captchaRef: RecaptchaComponent;
  public complete = false;
  public formerror = false;
  public submitted = false;
  public showExtraDiscount = "show";
  public quote = QuoteModel.getInstance();
  public subscription: Subscription;
  public referrals: Array<ReferralModel>;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private componentService: ComponentService,
    private ajaxService: AjaxService,
    private tracking: TrackingService
    ) {

      this.subscription = this.messageService.getMessage().subscribe( message => {
        switch (message.id) {
          case MessageService.onBack:
            TweenMax.fromTo(this.discountQualification.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
          case MessageService.onNext:
            TweenMax.fromTo(this.discountQualification.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
        }
      });
  }

  ngOnInit(): void {
    this.tracking.virtualPageView("/discount-qualification", "Extra Discount");
    this.tracking.whenPageLoads();
    this.checkCompleted();
    this.referrals = CopyModel.referrals;
    this.componentService.setGreenBannerSlide("2");

  }
  public focusinField(field: string): void  {
    switch(field){
      case "promo_code":
        this.tracking.customInteract("Extra Discount | 3","where_hear_about_us",this.quote.promoCode)
        break;
    }
  }
  public validate(showerrors: boolean = false): boolean {
    this.formerror = false;
    this.complete = true;
    if (this.quote.alreadyHavePetInsuranceUs === undefined || this.quote.alreadyHavePetInsuranceUs === null) {
      this.complete = false;
    }
    if (this.quote.southernCrossSocietyMember === undefined || this.quote.southernCrossSocietyMember === null) {
      this.complete = false;
    }
    return this.formerror;
  }
  public checkCompleted(field: string = ""): void {
    switch (field) {
      case "insure":
        this.tracking.customInteract("Extra Discount | 3","pet_insured_with_us",(this.quote.alreadyHavePetInsuranceUs ? "Yes" : "No"))
      break;
      case "member":
        this.tracking.customInteract("Extra Discount | 3","sc_member",(this.quote.southernCrossSocietyMember ? "Yes" : "No"))
        break;
      case "referrals":
        this.tracking.customInteract("Extra Discount | 3","where_hear_about_us",this.quote.whereHearAboutUs.label)
        break;
    }
    if (!this.quote.southernCrossSocietyMember) {
      this.quote.memberNumber = "";
    }
    this.validate();
    this.componentService.setGreenBannerSlide("");
  }
  public submit(token: string): void {
    if(!this.submitted) {
      this.submitted = true;
      this.ajaxService.leadSubmit(token).subscribe((app: CustomerLeadModel) => {
        return;
      });
    }
  }
  public next(): void {
    if (this.complete) {
      this.tracking.submitDiscountPage();
      this.tracking.selectContent("Extra Discount | 3","Next");
      this.captchaRef.execute();
      TweenMax.to(this.discountQualification.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(["choose-a-plan"]).then( (e) => {
          this.messageService.sendMessage(MessageService.onNext);
        });
      }, ease: Quart.easeOut});
    }
  }
  public back(): void {
    this.tracking.selectContent("Extra Discount | 3","Back");
    TweenMax.to(this.discountQualification.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate(["applicant-details"]).then( (e) => {
        this.messageService.sendMessage(MessageService.onBack);
      });
    }, ease: Quart.easeOut});
  }
  ngOnDestroy(): void  {
    this.subscription.unsubscribe();
  }
}
