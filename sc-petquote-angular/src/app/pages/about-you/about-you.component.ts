import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit  } from "@angular/core";
import { Router } from "@angular/router";
import { QuoteModel } from "../../models/quote.model";
import { CopyModel } from "../../models/copy.model";
import { MessageService } from "src/app/services/message.service";
import { Subscription } from "rxjs";
import { TextInputComponent } from "src/app/components/text-input/text-input.component";
declare var TweenMax: any;
declare var Quart: any;

@Component({
  selector: "app-about-you",
  templateUrl: "./about-you.component.html",
  styleUrls: ["./about-you.component.scss"]
})
export class AboutYouComponent implements OnInit, OnDestroy, AfterViewInit  {

  @ViewChild("aboutYou", {static: true}) public aboutYou: ElementRef;
  @ViewChild("fullname") public fullname: TextInputComponent;
  @ViewChild("email") public email: TextInputComponent;
  public complete = false;
  public formerror = false;
  public showExtraDiscount = "";
  public quote: QuoteModel;
  public copy = CopyModel;
  public subscription: Subscription;

  constructor(private router: Router, private messageService: MessageService) {
    this.quote = QuoteModel.getInstance();
    this.subscription = this.messageService.getMessage().subscribe( message => {
      if (document.getElementById("tooltip") !== null)  {
        document.getElementById("tooltip").remove();
      }
      switch (message.id) {
        case MessageService.onBack:
          TweenMax.fromTo(this.aboutYou.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          break;
        case MessageService.onNext:
          TweenMax.fromTo(this.aboutYou.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          // focus first element
          break;
      }
    });
  }

  ngOnInit(): void {
    this.checkCompleted();
  }
  ngAfterViewInit(): void {
    this.fullname.focusOn();
  }
  public validate(showerrors: boolean = false): boolean {
    this.formerror = false;
    if (!this.fullname.isValid()) {
      if (showerrors) {
        this.fullname.validate();
      }
      this.formerror = true;
    }
    if (!this.email.isValid()) {
      if (showerrors) {
        this.email.validate();
      }
      this.formerror = true;
    }
    return this.formerror;
  }
  public checkCompleted(): void {
    this.complete = true;
    if (this.quote.firstname === "") {
      this.complete = false;
    }
    if (this.quote.lastname === "") {
      this.complete = false;
    }
    if (!this.quote.validateEmail(this.quote.email)) {
      this.complete = false;
    }
    this.showExtraDiscount = this.complete ? "show" : "";
    if (this.quote.alreadyHavePetInsuranceUs === undefined) {
      this.complete = false;
    }
    if (this.quote.southernCrossSocietyMember === undefined) {
      this.complete = false;
    }
    if (this.quote.whereHearAboutUs.id === 0) {
      this.complete = false;
    }
  }
  public next(): void {
    if (this.complete) {
      TweenMax.to(this.aboutYou.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(["choose-a-plan"]).then( (e) => {
          this.messageService.sendMessage(MessageService.onNext);
        });
      }, ease: Quart.easeOut});
    }
  }
  public back(): void {

    TweenMax.to(this.aboutYou.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate([""]).then( (e) => {
        this.messageService.sendMessage(MessageService.onBack);
      });
    }, ease: Quart.easeOut});
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
