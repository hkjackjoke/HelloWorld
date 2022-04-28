import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-time-out-modal",
  templateUrl: "./time-out-modal.component.html",
  styleUrls: ["./time-out-modal.component.scss"]
})
export class TimeOutModalComponent {

  @Output() eventOut = new EventEmitter<string>();

  close(): void {
    this.eventOut.emit("close");
  }

}
