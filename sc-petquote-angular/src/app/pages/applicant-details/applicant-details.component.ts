import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { RecaptchaComponent } from "ng-recaptcha";
import { CustomerLeadModel } from "src/app/models/customer-lead.model";
import { QuoteModel } from "src/app/models/quote.model";
import { ValidateModel } from "src/app/models/validate.model";
import { AjaxService } from "src/app/services/ajax.service";
import { MessageService } from "src/app/services/message.service";
import { TrackingService } from "src/app/services/tracking.service";
declare var TweenMax: any;
declare var Quart: any;

@Component({
  selector: "app-applicant-details",
  templateUrl: "./applicant-details.component.html",
  styleUrls: ["./applicant-details.component.scss"]
})
export class ApplicantDetailsComponent implements OnInit {
  public quote: QuoteModel;
  public complete: boolean = false;
  public hasChanged: boolean = false;
  public submitted: boolean = false;

  public notice = "We may use the details you submit throughout this form to contact you about our products and services, conduct analysis, and learn more about your use of this quote tool.  To find out more about your right to access and correct your information and where your information will be held, please <a href='https://www.southerncrosspet.co.nz/privacy-statement' target='_blank'>read our full Privacy Statement</a>.";

  @ViewChild("aboutYou", { static: true }) public aboutYou: ElementRef;
  @ViewChild("captchaRef", { static: false }) captchaRef: RecaptchaComponent;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private tracking: TrackingService,
    private ajaxService: AjaxService) {
    this.quote = QuoteModel.getInstance();
  }
  ngOnInit(): void {
    this.hasChanged = false;
    this.submitted = false;
    this.checkCompleted();
  }
  populate(): void {
    this.quote.firstname = "Fracture";
    this.quote.lastname = "Test";
    this.quote.email = "r@b.com";
    this.quote.phone = "021000000";
    this.hasChanged = true;
  }
  trackFieldError(error: string, name: string): void {
    this.tracking.formError(5, name, error);
  }
  trackField(name: string): void {
    this.tracking.formInteract(10, name);
  }
  public fieldsChanged(): void {
    this.checkCompleted();
    this.hasChanged = true;
  }
  public checkCompleted(): void {
    this.complete = true;
    if (this.quote.firstname === "") {
      this.complete = false;
    }
    if (this.quote.lastname === "") {
      this.complete = false;
    }
    if (!ValidateModel.validatePhone(this.quote.phone)) {
      this.complete = false;
    }
    if (!this.quote.validateEmail(this.quote.email)) {
      this.complete = false;
    }
  }
  public submit(token: string): void {
    if (!this.submitted) {
      this.submitted = true;
      this.ajaxService.leadSubmit(token).subscribe((app: CustomerLeadModel) => {
        return;
      });
    }
  }
  public checkSave(): void {
    if (this.hasChanged) {
      this.captchaRef.execute();
    }
  }
  public next(): void {
    if (this.complete) {
      this.checkSave();
      this.tracking.selectContent("Policyholder Details | 2","Next");
      TweenMax.to(this.aboutYou.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(["discount-qualification"]).then( (e) => {
          this.messageService.sendMessage(MessageService.onNext);
        });
      }, ease: Quart.easeOut});
    }
  }
  public back(): void {
    this.tracking.selectContent("Policyholder Details | 2","Back");
    TweenMax.to(this.aboutYou.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate([""]).then( (e) => {
        this.messageService.sendMessage(MessageService.onBack);
      });
    }, ease: Quart.easeOut});
  }

}
