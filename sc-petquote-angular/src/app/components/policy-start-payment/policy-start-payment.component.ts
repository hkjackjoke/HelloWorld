import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from "@angular/core";
import { CopyModel } from "../../models/copy.model";
import { QuoteModel } from "../../models/quote.model";
import { RadioBtnComponent } from "src/app/components/radio-btn/radio-btn.component";

@Component({
  selector: "app-policy-start-payment",
  templateUrl: "./policy-start-payment.component.html",
  styleUrls: ["./policy-start-payment.component.scss"]
})
export class PolicyStartPaymentComponent implements OnInit {


  @ViewChild("paymentMethod0", {static: true}) public paymentMethod0: RadioBtnComponent;
  @ViewChild("paymentMethod1", {static: true}) public paymentMethod1: RadioBtnComponent;

  public isFocus = false;
  copy = CopyModel;
  date: Date;
  policyStartDate: Date;
  policyStartRange: Date = new Date();
  policyEndRange: Date = new Date();
  @Input() show = "";
  @Input() quote: QuoteModel;

  @Output() detailsChanged = new EventEmitter<any>();
  @Output() paymentMethodChanged = new EventEmitter<any>();
  @Output() paymentFreqChanged = new EventEmitter<any>();
  @Output() whenCalendarOpen = new EventEmitter<any>();
  @Output() whenCalendarClosed = new EventEmitter<any>();
  constructor() {
    this.policyStartRange.setDate(this.policyStartRange.getDate() + 1);
    this.policyEndRange.setDate(this.policyEndRange.getDate() + 31);

  }

  ngOnInit(): void {
    this.date = new Date();
    this.policyStartDate = this.quote.policyStartDate !== null ? this.quote.policyStartDate : new Date(this.date.getDate() + 1);
  }
  choosePolicyStartDate(date: Date): void {

    this.quote.policyStartDate = date;
    this.resetPaymentDate();
    this.emitDetailsChanged();
  }
  resetPaymentDate(): void  {
    const paymentStartRange: Date = new Date(this.quote.policyStartDate);
    paymentStartRange.setDate(paymentStartRange.getDate() + (this.quote.paymentMethod.Code === "DD" ? 13 : 1));
    this.quote.paymentDate = paymentStartRange;
  }
  setMethod(value: any): void {
    this.emitDetailsChanged();
  }
  setFrequency(value: any): void {
    this.emitDetailsChanged();
  }
  emitDetailsChanged(): void {
    this.detailsChanged.emit({date: this.date});
  }
  updatePaymentMethod(method: any): void {
    method.id === 2 ? this.paymentMethod1.checked = false : this.paymentMethod0.checked = false;
    this.quote.paymentMethod = method;
    this.resetPaymentDate();
    this.paymentMethodChanged.emit({value: method});
  }
  freqChanged(): void  {
    this.paymentFreqChanged.emit();
  }
  calendarClosed(): void  {
    this.whenCalendarClosed.emit();
  }
  calendarOpened(): void {
    this.whenCalendarOpen.emit();
  }
  public tabIn(): void {
    this.isFocus = true;
  }
  public tabOut(): void {
    this.isFocus = false;
  }
  public keydown(e: any): void {
    switch (e.keyCode) {
      case 39:
        this.updatePaymentMethod(this.copy.paymentMethods[3]);
        break;
      case 37:
        this.updatePaymentMethod(this.copy.paymentMethods[2]);
        break;
    }
  }
}

