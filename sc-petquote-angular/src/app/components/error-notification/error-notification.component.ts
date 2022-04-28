import { Component } from "@angular/core";

@Component({
  selector: "app-error-notification",
  templateUrl: "./error-notification.component.html",
  styleUrls: ["./error-notification.component.scss"]
})
export class ErrorNotificationComponent {

  public message: string;
  public closed = false;


  close(): void {
    this.closed = true;
  }
}
