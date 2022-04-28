import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-payment-declined-modal",
  templateUrl: "./payment-declined-modal.component.html",
  styleUrls: ["./payment-declined-modal.component.scss"]
})
export class PaymentDeclinedModalComponent  {

  @Input() show: boolean;
  @Output() closePopup = new EventEmitter<any>();
  @Output() tryAgain = new EventEmitter<any>();

  public showMe(): void {
    this.show = true;

  }
  public cancel(): void {
    this.closePopup.emit();
    this.show = false;
  }
  confirm(): void {
    this.tryAgain.emit();
    this.show = false;
  }
}
