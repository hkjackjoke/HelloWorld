import { Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { QuoteModel } from "src/app/models/quote.model";
import { CopyModel } from "src/app/models/copy.model";
import { Pet } from "src/app/models/pet.model";
import { MessageService } from "src/app/services/message.service";
import { Subscription } from "rxjs";
import { RemovePetConfirmComponent } from "src/app/components/remove-pet-confirm/remove-pet-confirm.component";
import { SendEmailComponent } from "src/app/components/send-email/send-email.component";
import { AjaxService } from "src/app/services/ajax.service";
import { ComponentService } from "src/app/services/component.service";
import { QuoteAnimalModel } from "src/app/models/quote.animal.model";
import { QuoteResultModel } from "src/app/models/quote.result.model";
import { PetSummaryComponent } from "src/app/components/pet-summary/pet-summary.component";
import { TrackingService } from "src/app/services/tracking.service";
declare var TweenMax: any;
declare var Quart: any;
declare var $: any;

@Component({
  selector: "app-quote-summary",
  templateUrl: "./quote-summary.component.html",
  styleUrls: ["./quote-summary.component.scss"]
})
export class QuoteSummaryComponent implements OnInit, OnDestroy {

  @ViewChild("quoteSummary", {static: true}) public quoteSummary: ElementRef;
  @ViewChild("removePetPopup", {static: true}) public removePetPopup: RemovePetConfirmComponent;
  @ViewChild("emailForm", {static: true}) public emailForm: SendEmailComponent;
  @ViewChildren(PetSummaryComponent) petSummarys: QueryList<PetSummaryComponent>;

  public quote = QuoteModel.getInstance();
  public total: number;
  public totalDollars: string;
  public totalCents: string;
  public confirmRemovePet = "";
  public confirmRemovePetModel: Pet  = new Pet();
  public confirmRemovePetIndex = 0;
  public subscription: Subscription;
  public showEmailForm = false;
  public showEmailSent = false;
  public useReCaptchaForEmail = true;
  constructor(
    private router: Router,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private componentService: ComponentService,
    private tracking: TrackingService) {
      this.subscription = this.messageService.getMessage().subscribe( message => {
        switch (message.id) {
          case MessageService.onBack:
            TweenMax.fromTo(this.quoteSummary.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
          case MessageService.onNext:
            TweenMax.fromTo(this.quoteSummary.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
        }
      });
      this.componentService.setGreenBannerSlide("");
  }
  ngOnInit(): void {
    this.tracking.virtualPageView("/quote-summary", "Quote Summary");
    this.tracking.whenPageLoads();
    this.setTotals();

  }
  public setTotals(): void {
    let t: number = 0;
    this.quote.pets.forEach((pet: Pet, index: number) => {
      t += pet.animalQuote.total;
    });
    this.total = t;
    const a: string[] = t.toFixed(2).toString().split(".");
    this.totalDollars = a[0];
    this.totalCents = a.length > 1 ? a[1] : "00";
  }
  editPet(value: any): void {
    TweenMax.to(this.quoteSummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.router.navigate([""]).then( (e) => {
        this.messageService.sendMessage(MessageService.editPet, {from: "quote-summary", pet: value.pet, petIndex: value.index});
      });
    }, ease: Quart.easeOut});
  }
  removePet(data: any): void {
    this.confirmRemovePet = "show";
    this.confirmRemovePetIndex = data.index;
    this.confirmRemovePetModel = data.pet;
    this.removePetPopup.showMe();
    this.tracking.push({
      event: "popup_view",
      event_info: {
      category: "Quote and apply",
      action: "Remove pet",
      content_type: "popup_view",
      content_name: "Remove pet",
      label_1: data.pet.name
    }});
  }
  closeConfirmRemovePet(): void {
    this.confirmRemovePet = "";

  }
  hasRemovedPet(petIndex: number): void {
    this.confirmRemovePet = "";
    if (!this.quote.pets.length) {
      TweenMax.to(this.quoteSummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate([""]).then( (e) => {
          this.messageService.sendMessage(MessageService.onBack);
        });
      }, ease: Quart.easeOut});
    } else {
      this.componentService.loadingNotification("Loading quote data");
      this.ajaxService.getQuote(this.quote.quoteBody(0, 0, -1)).subscribe((quoteValue: QuoteResultModel) => {
        this.quote.quoteResultModel = quoteValue;
        quoteValue.Animals.forEach((pet: QuoteAnimalModel, index: number) => {
           this.quote.pets[index].animalQuote = pet;
        });
        this.componentService.destroyLoading();
        this.setTotals();
        this.petSummarys.forEach((item: PetSummaryComponent, index: number) => {
          item.pet = this.quote.pets[index];
          item.setValues();
        });
      },
      (err: any) => {
        this.ajaxService.handleError("Load Get Quote Error", err);
      });
    }
  }
  editDateStart(): void {
    this.tracking.editQuote();
    TweenMax.to(this.quoteSummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.router.navigate(["choose-a-plan"]).then( (e) => {
        this.messageService.sendMessage(MessageService.editFrom, "quote-summary");
      });
    }, ease: Quart.easeOut});
  }
  apply(): void {

    if (this.showEmailForm) {
      return;
    }
    this.tracking.push({
      event: "select_content",
      event_info: {
      category: "Quote and apply",
      action: "Apply Now",
      label_1: "button",
      }
    });
    TweenMax.to(this.quoteSummary.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate(["apply/about-you"]).then( (e) => {
        this.messageService.sendMessage(MessageService.onNext);
      });
    }, ease: Quart.easeOut});
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  formatDate(date: Date): string {
    let datestring: string = "";

    datestring += " " + date.getDate();
    datestring += " " + CopyModel.months[date.getMonth()];
    datestring += " " + date.getFullYear();

    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear()) {
        datestring += " (Tomorrow)";
    }
    return datestring;
  }
  toggleShowEmailForm(state: boolean = false): void {
    this.showEmailForm = state;
    this.tracking.push({
        event: "select_content", 
        event_info: { 
          category: "Quote and apply", 
          action: "Email quote", 
          label_1: "button", 
          label_2: state ? "Open" : "close", 
        }
    });
  }
  captchaResolved(captchaToken: string): void {
    // need to check that a token was retrieved
    if (captchaToken) {
      this.sendEmail(captchaToken);
    }
  }
  sendEmail(captchaToken: string): void {
    this.componentService.loadingNotification("");
    this.ajaxService.sendEmail(this.quote.emailBody(this.emailForm.firstname, this.emailForm.email), captchaToken).subscribe(() => {
      this.showEmailForm = false;
      this.showEmailSent = true;
      this.componentService.destroyLoading();
      this.tracking.emailQuote();
    },
    (err: any) => {
      this.ajaxService.handleError("Ajax send email error", err);
      this.componentService.destroyLoading();
    });
  }
}
