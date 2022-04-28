import { Component, Output, Input, EventEmitter } from "@angular/core";
// import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

// export function checkBoxControlValueAccessor(extendedInputComponent: any) {
//   return {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => extendedInputComponent),
//       multi: true
//   };
// }

@Component({
  selector: "app-check-box",
  templateUrl: "./check-box.component.html",
  styleUrls: ["./check-box.component.scss"],
  providers: [
  //   checkBoxControlValueAccessor(CheckBoxComponent)
  ]
})
export class CheckBoxComponent {

  @Input() value: any;
  @Input() checked = false;
  @Input() inputId = "";
  @Input() disabled = false;
  @Input() fieldname: string;
  @Input() useInput = true;
  @Input() large = false;
  @Input() tab = "0";

  @Input() text = "";
  @Output() checkChange = new EventEmitter<any>();
  public checkboxTabFocus = false;

  toggleChecked(): void {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.checkChange.emit({value: this.checked ? this.value : "", checkbox: this});
  }

  public tabToCheckbox(): void {
    this.checkboxTabFocus = true;
  }
  public tabFromCheckbox(): void {
    this.checkboxTabFocus = false;
  }
  public checkboxKeyDown(e: any): void {
    if (e.keyCode === 13) {
      this.toggleChecked();
    }
  }
}
