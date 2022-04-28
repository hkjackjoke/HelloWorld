import { Component, Output, EventEmitter, Input } from "@angular/core";


@Component({
  selector: "app-next-back",
  templateUrl: "./next-back.component.html",
  styleUrls: ["./next-back.component.scss"]
})
export class NextBackComponent {
  @Output() goNext = new EventEmitter<any>();
  @Output() errorNext = new EventEmitter<any>();
  @Output() goNextNoEnabled = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<any>();
  @Input() enabledNext: boolean;
  @Input() nextTabIndex: string;
  @Input() nextLabel = "Next";
  @Input() backLabel = "Back";
  @Input() showBack = true;
  @Input() allowNextClick = false;

  public nextTabFocus = false;

  next(e: any): void {
    if (this.enabledNext) {
      e.preventDefault();
      this.goNext.emit();
    } else if (this.allowNextClick) {
      this.errorNext.emit();
    }
  }
  back(): void {
    this.goBack.emit();
  }
  public tabToNext(): void {
    if (this.enabledNext) {
      this.nextTabFocus = true;
    }
  }
  public tabFromNext(): void {
    this.nextTabFocus = false;
  }
  public nextKeyDown(e: any): void {
    if (this.enabledNext) {
      if (e.keyCode === 13) {
        this.next(e);
      }
    }
  }
}
