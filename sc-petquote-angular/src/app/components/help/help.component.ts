import { Component,  Input } from "@angular/core";

@Component({
  selector: "app-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.scss"]
})
export class HelpComponent  {
  @Input() menuOpen = false;



}
