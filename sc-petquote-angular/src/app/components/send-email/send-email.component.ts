import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from "@angular/core";
import { TextInputComponent } from "src/app/components/text-input/text-input.component";
import { QuoteModel } from "src/app/models/quote.model";
import { ValidateModel } from "src/app/models/validate.model";
import { TrackingService } from "src/app/services/tracking.service";


@Component({
  selector: "app-send-email",
  templateUrl: "./send-email.component.html",
  styleUrls: ["./send-email.component.scss"]
})
export class SendEmailComponent implements AfterViewInit  {

  public firstname = "";
  public email = "";
  public complete = false;
  public firstnameChanged = false;
  public emailChanged = false;


  @Input() show: boolean;

  @Output() cancel = new EventEmitter<any>();
  @Output() send = new EventEmitter<any>();


  @ViewChild("emailInput") public emailInput: TextInputComponent;
  @ViewChild("firstnameInput") public firstnameInput: TextInputComponent;
  constructor(private tracking:TrackingService) {
 
  }
  ngAfterViewInit(): void {
    this.firstname = QuoteModel.getInstance().firstname;
    this.email = QuoteModel.getInstance().email;
    if(ValidateModel.validateEmail(this.email) && this.firstname.trim() !== ""){
      this.complete = true;
    }
  }
  validateForm(name: string=""): void {
    this.complete = true;
    if (name){
      if(name === "firstname"){
        this.firstnameChanged = true;
      }
      if(name === "email"){
        this.emailChanged = true;
      }
    }
    if (!this.firstnameInput.isValid()) {
      this.complete = false;
    }
    if (!this.emailInput.isValid()) {
      this.complete = false;
    }
  }
  track(name: string){
    if(name === "firstname" && !this.firstnameChanged){
      return;
    }
    if(name === "email" && !this.emailChanged){
      return;
    }
    this.tracking.push({
      event: "formFieldInteraction",
      event_info: {
      category: "Quote and apply",
      action: "Email quote",
      label_1: name,
      label_2: "updated",
      }
    });
  }
  close(): void {
    this.cancel.emit();
    this.tracking.push({
      event: "select_content",
      event_info: {
      category: "Quote and apply",
      action: "Email quote",
      label_1: "button",
      label_2: "Cancel"
      },
    });
  }
  submit(): void {
    this.send.emit();
    this.tracking.push({
      event: "select_content",
      event_info: {
      category: "Quote and apply",
      action: "Email quote",
      label_1: "button",
      label_2: "Send"
      },
    });
  }
}
