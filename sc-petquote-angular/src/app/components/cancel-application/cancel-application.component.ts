import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-cancel-application",
  templateUrl: "./cancel-application.component.html",
  styleUrls: ["./cancel-application.component.scss"]
})
export class CancelApplicationComponent {

  @Input() show = false;

  @Output() closePopup = new EventEmitter<any>();
  @Output() cancelApplication = new EventEmitter<any>();



  public cancel(): void {
    this.closePopup.emit();
    this.show = false;
  }

  public confirm(): void {
    this.cancelApplication.emit();
    this.show = false;
  }
}
