import { Component, ViewChild, ElementRef, Input } from "@angular/core";

@Component({
  selector: "app-quote-form",
  templateUrl: "./quote-form.component.html",
  styleUrls: ["./quote-form.component.scss"]
})
export class QuoteFormComponent {
  @ViewChild("quoteform", {static: true}) private quoteForm: ElementRef<HTMLFormElement>;


  public submit(): void {
    (this.quoteForm.nativeElement as HTMLFormElement).submit();
  }
}
