import { Component, OnInit, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import { ValidateModel } from "src/app/models/validate.model";
import { CopyModel } from "src/app/models/copy.model";

export function inputFieldsetControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}

@Component({
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
  styleUrls: ["./text-input.component.scss"],
  providers: [
    inputFieldsetControlValueAccessor(TextInputComponent)
  ]
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  private static instanceNum = 0;
  @Input() label = "";
  @Input() value = "";
  @Input() type = "text";
  @Input() validateType = "text";
  @Input() errorMessage = "";
  @Input() fieldname = "";
  @Input() placeholder = "";
  @Input() required = false;
  @Input() error = false;
  @Input() capitalize = false;
  @Input() tab = 0;
  @Input() clearbutton = false;
  @Input() displayMaxLength = false;
  @Input() pattern = "";
  @Input() inputId = null;
  @Input() help: string;
  @Input() classes = "";
  @Input() labelclass = "";
  @Input() tableclass = "";
  @Input() subtext = "";
  @Input() maxlength: number;

  @Output() inputChange = new EventEmitter<any>();
  @Output() inputFocusout = new EventEmitter<any>();
  @Output() inputFocusin = new EventEmitter<any>();
  @Output() checkChanged = new EventEmitter<any>();
  @Output() trackError = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();
  @ViewChild("inputTextElement") public inputTextElement: ElementRef;
  @ViewChild("inputTelElement") public inputTelElement: ElementRef;

  private onChangeCallback: any;
  private _onTouched: any;




  ngOnInit(): void {
    if (this.inputId === null || this.inputId === "") {
      TextInputComponent.instanceNum++;
      this.inputId = "input_" + TextInputComponent.instanceNum;
    }
  }
  public writeValue(value: any): void {
    if (value !== this.value && value !== null) {
        this.value = value;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public input(): void {
    this.value = this.value.trim();
    if (this.validateType === "email") {
      (this.inputTextElement.nativeElement as HTMLInputElement).value = this.value;
    }
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    if (this.capitalize) {
      this.value = CopyModel.capitalize(this.value);
    }
    this.inputChange.emit(this.value);
  }
  public focusout(): void {
    this.validate();
    this.value = this.value.trim();
    this.inputFocusout.emit(this.value);
  }
  public validate(): void {
    this.error = !this.isValid();
    if (this.error) {
      this.trackError.emit(this.errorMessage);
    }
  }
  public focusin(): void {
    this.inputFocusin.emit(this.value);
  }
  public isValid(): boolean {
    if (this.required) {
      switch (this.validateType) {
        case "phone":
          return ValidateModel.validatePhone(this.value);
        case "email":
          return ValidateModel.validateEmail(this.value);
        case "schspolicy":
          return ValidateModel.schsPolicyNumber(this.value);
        default:
          return (this.value.trim() !== "" && this.value !== undefined);
      }
    }
    return true;
  }
  public checkBoxChange(value: any): void {
    this.checkChanged.emit(value);
    this.error = false;
    if (value) {
      this.value = "";
    }
  }
  public clearfield(): void {
    this.value = "";
    this.focusOn();
    this.input();
    this.inputClear.emit();
  }
  public focusOn(): void {
    if (this.type === "tel") {
      (this.inputTelElement.nativeElement as HTMLInputElement).focus();
    } else {
      (this.inputTextElement.nativeElement as HTMLInputElement).focus();
    }
  }
}
