import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-popup-modal",
  templateUrl: "./popup-modal.component.html",
  styleUrls: ["./popup-modal.component.scss"]
})
export class PopupModalComponent {

  @Input() show: boolean;
  @Input() title = "";
  @Input() copy: string;
  @Input() windowClass = "";
  @Input() cancelText = "OK";
  @Output() closePopup = new EventEmitter<any>();
  public showMe(): void {
    this.show = true;

  }
  public cancel(): void {
    this.closePopup.emit();
    this.show = false;
  }
}
