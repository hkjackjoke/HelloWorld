import { Component, Input, Output, EventEmitter, forwardRef, ViewChild } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { RadioBtnComponent } from "../radio-btn/radio-btn.component";
export function yesNoControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}

@Component({
  selector: "app-yes-no-radio-buttons",
  templateUrl: "./yes-no-radio-buttons.component.html",
  styleUrls: ["./yes-no-radio-buttons.component.scss"],
  providers: [yesNoControlValueAccessor(YesNoRadioButtonsComponent)]
})
export class YesNoRadioButtonsComponent implements ControlValueAccessor {

  public isFocus = false;
  @Input() value: boolean;
  @Input() label: string;
  @Input() help: string;
  @Input() configCss: string;
  @Input() tab: string;
  @Output() valueChange = new EventEmitter<boolean>();

  @ViewChild("yesBtn") yesBtn: RadioBtnComponent;
  @ViewChild("yesBtn") noBtn: RadioBtnComponent;

  private onChangeCallback: any;
  private touched: any;


  writeValue(value: any): void {
    if (value !== this.value) {
        this.value = value;
    }
  }
  registerOnChange(fn: any): void  {
      this.onChangeCallback = fn;
  }
  registerOnTouched(): void {
    this.touched = true;
  }
  setYes(): void {
    this.value = true;
    this.onChangeCallback(true);
    this.valueChange.emit(true);
  }
  setNo(): void {
    this.value = false;
    this.yesBtn.checked = false;
    this.onChangeCallback(false);
    this.valueChange.emit(false);
  }
  public tabIn(): void {
    this.isFocus = true;
  }
  public tabOut(): void {
    this.isFocus = false;
  }
  public keydown(e: any): void {
    switch (e.keyCode) {
      case 39:
        this.setNo();
        break;
      case 37:
        this.setYes();
        break;
    }
  }
}
