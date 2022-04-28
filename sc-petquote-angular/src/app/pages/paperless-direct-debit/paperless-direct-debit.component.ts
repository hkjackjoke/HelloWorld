import { Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import {QuoteModel } from "../../models/quote.model";
import { MessageService } from "src/app/services/message.service";
import { Subscription } from "rxjs";
declare var TweenMax: any;
declare var Quart: any;

@Component({
  selector: "app-paperless-direct-debit",
  templateUrl: "./paperless-direct-debit.component.html",
  styleUrls: ["./paperless-direct-debit.component.scss"]
})
export class PaperlessDirectDebitComponent {

  @ViewChild("directDebitSection", {static: true}) public directDebitSection: ElementRef;
  public quote: QuoteModel;
  public subscription: Subscription;
  public complete = false;

  // form fields
  public petInsuranceNumber: string;
  public fullName: string;
  public phone: string;
  public email: string;
  public bankAccountHolder: string;
  public bankAccountNumber: string;
  public nameOfBank: string;
  public nameOfBranch: string;
  public frequency: any;
  public applyChangesToOtherPets: boolean;
  public readAndAccepted: boolean;
  public acceptedAuthorityToDirectDebit: boolean;
  public soleAuthority: boolean;
  // viewContent

  public frequencyItems = [
    {label: "Weekly", id: "1"},
    {label: "Fortnightly", id: "2"},
    {label: "Monthly", id: "3"},
  ];

  constructor(private router: Router, private messageService: MessageService) {
    this.quote = QuoteModel.getInstance();
    this.subscription = this.messageService.getMessage().subscribe( message => {
      switch (message.id) {
        case MessageService.onBack:
          this.messageService.sendMessage(MessageService.scrollToTimeline);
          TweenMax.fromTo(this.directDebitSection.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          break;
        case MessageService.onNext:
          this.messageService.sendMessage(MessageService.scrollToTimeline);
          TweenMax.fromTo(this.directDebitSection.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          // focus first element
          break;
      }
    });
  }

}
