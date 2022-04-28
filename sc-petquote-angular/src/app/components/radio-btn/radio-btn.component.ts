import { Component,  Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-radio-btn",
  templateUrl: "./radio-btn.component.html",
  styleUrls: ["./radio-btn.component.scss"]
})
export class RadioBtnComponent {

  @Input() checked: boolean;
  @Input() label = "";
  @Input() smallLabel = "";
  @Input() disabled = false;
  @Input() focus = false;

  @Output() outChecked = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<boolean>();

  changeChecked(): void {
    if (this.disabled) {
      return;
    }

    if (!this.checked) {
      this.checked = true;
      this.outChecked.emit(this.checked);
    }
    this.changed.emit(this.checked);
  }
}
