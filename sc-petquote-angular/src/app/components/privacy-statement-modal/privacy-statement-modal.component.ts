import { Component, Input, Output, EventEmitter } from "@angular/core";
import { QuoteModel } from "../../models/quote.model";

@Component({
  selector: "app-privacy-statement-modal",
  templateUrl: "./privacy-statement-modal.component.html",
  styleUrls: ["./privacy-statement-modal.component.scss"]
})
export class PrivacyStatementModalComponent {

  @Input() show: boolean;

  @Input() title: string;
  @Input() copy: string;
  @Input() description: string;
  @Input() quote: QuoteModel;
  @Output() acceptPolicy = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  public selected = false;

  public showMe(): void {
    this.show = true;
  }

  public cancel(): void {
    this.show = false;
    this.closePopup.emit();

  }

  public confirm($event: any): void {
    this.acceptPolicy.emit($event);
    this.show = false;
  }
}
