import { Component, Input, Output, EventEmitter } from "@angular/core";

import { QuoteModel } from "src/app/models/quote.model";
import { TitlesModel } from "src/app/models/titles.model";
@Component({
  selector: "app-remove-authorised-person-confirm",
  templateUrl: "./remove-authorised-person-confirm.component.html",
  styleUrls: ["./remove-authorised-person-confirm.component.scss"]
})
export class RemoveAuthorisedPersonConfirmComponent  {

  @Input() show: boolean;
  @Input() windowClass = "";
  @Input() quote: QuoteModel;
  @Output() closePopup = new EventEmitter<any>();
  @Output() removePerson = new EventEmitter<any>();
  @Output() editPerson = new EventEmitter<any>();

  public showMe(): void {
    this.show = true;

  }

  public cancel(): void {
    this.closePopup.emit();
    this.show = false;
  }

  public confirm(): void {

    this.quote.addAnotherAuthorisedPerson = false;
    this.quote.otherTitle = new TitlesModel("", "", " ", -1);
    this.quote.otherFirstname = "";
    this.quote.otherLastname = "";
    this.quote.otherDOB = null;
    this.quote.otherPhone = "";
    this.quote.otherEmail = "";
    this.quote.authorisedToDiscloseOther = false;

    this.removePerson.emit();
    this.show = false;
  }

  public edit(): void {
    this.editPerson.emit();
    this.show = false;
  }
}
