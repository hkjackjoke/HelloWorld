import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from "@angular/core";
import { RECAPTCHA_CLIENT_TOKEN } from "./recaptcha-token";
import { Observable } from "rxjs";
import { RecaptchaComponent as NgRecaptchaComponent } from "ng-recaptcha";

@Component({
  selector: "app-recaptcha",
  templateUrl: "./recaptcha.component.html",
  styleUrls: ["./recaptcha.component.css"],
})
export class RecaptchaComponent {
  @ViewChild(NgRecaptchaComponent) private recaptchaComponent: RecaptchaComponent;
  @ViewChild("captchaRef") private captchaRef: RecaptchaComponent;
  @Output() public resolved = new EventEmitter<string>();

  constructor(@Inject(RECAPTCHA_CLIENT_TOKEN) public clientToken: string) {}
  public reset(): void {
    this.captchaRef.reset();
  }
  public execute(): Observable<string> {
    return this.recaptchaComponent.execute();
  }
}
