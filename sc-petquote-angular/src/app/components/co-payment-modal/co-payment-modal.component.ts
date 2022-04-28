import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-co-payment-modal",
  templateUrl: "./co-payment-modal.component.html",
  styleUrls: ["./co-payment-modal.component.scss"]
})
export class CoPaymentModalComponent {

  @Output() eventOut = new EventEmitter<string>();

  close(): void {
    this.eventOut.emit("close");
  }
}
