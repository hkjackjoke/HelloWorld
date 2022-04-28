import { Component, OnInit, Input, forwardRef, Output, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { CheckBoxComponent } from "../check-box/check-box.component";
export function checkDescriptionBoxControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}
@Component({
  selector: "app-check-description-box",
  templateUrl: "./check-description-box.component.html",
  styleUrls: ["./check-description-box.component.scss"],
  providers: [checkDescriptionBoxControlValueAccessor(CheckDescriptionBoxComponent)]
})
export class CheckDescriptionBoxComponent implements ControlValueAccessor, OnInit {

  public isFocus = false;

  @Input() errormessage = "";
  @Input() required = false;
  @Input() title: string;
  @Input() description: string;
  @Input() checkLabel: string;
  @Input() tab: string;
  @Input() expandable = false;
  @Input() show = false;
  @Input() value = false;
  @Input() checkBottom = false;
  @Input() descFull = false;
  @Input() showInvalid = false;
  @Input() copy: string;
  @Input() error = false;
  @Output() valueChanged = new EventEmitter<any>();
  @Output() toggleShow = new EventEmitter<any>();

  @ViewChild("checkBox") checkBox: CheckBoxComponent;
  @ViewChild("checkBoxNext", {static: true}) checkBoxNext: CheckBoxComponent;
  private onChangeCallback: any;
  private _onTouched: any;
  public showCheckbox: boolean;
  ngOnInit(): void {
    this.showCheckbox = this.expandable ? this.value : true;
  }
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
      this.onChangeCallback = fn;
  }
  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onWindowScroll(event: any): void {

    // visible height + pixel scrolled >= total height
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 20) {
      this.showCheckbox = true;
    }
  }
  public toggleExpand(): void {
    this.show = !this.show;
    this.toggleShow.emit({show: this.show});
  }
  public setError(value: boolean): void {
    this.error = value;
  }
  public validate(): void {
    if (this.isValid()) {
      this.error = false;
    } else {
      this.error = true;
    }
  }
  public isValid(): boolean {
    if (this.required) {
      return this.value;
    }
    return true;
  }
  toggleSelected(event: any): void {
    this.value = event.value === "1";
    this.show = false;
    this.validate();
    if ( this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.valueChanged.emit();
  }
  tabIn(): void {
    this.isFocus = true;
    if (window.innerWidth > 767) {
      this.show = true;
    }
  }
  tabOut(): void {
    this.isFocus = false;
  }
  keydown(e: any): void {
    switch (e.keyCode) {
      case 13:
        this.checkBox.toggleChecked();
        break;
    }
  }
}
