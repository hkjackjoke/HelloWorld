import { Component, OnInit, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
export function selectBoxControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}

@Component({
  selector: "app-select-box",
  templateUrl: "./select-box.component.html",
  styleUrls: ["./select-box.component.scss"],
  providers: [selectBoxControlValueAccessor(SelectBoxComponent)]
})
export class SelectBoxComponent implements ControlValueAccessor, OnInit {


  open = false;
  @Input() value = {label: "", id: -1};
  @Input() items: Array<any>;
  @Input() placeholder = "Please select…";
  @Input() required = false;
  @Input() includePlaceHolder = false;
  @Input() includeLabel = true;
  @Input() errorMessage = "";
  @Input() tab: string;
  @Input() label: string;
  @Input() size: string;
  @Input() classes = "";
  @Output() selectChange = new EventEmitter<any>();
  @Output() trackError = new EventEmitter<any>();

  @ViewChild("tabInput", {static: true}) tabInput: ElementRef;

  private onChangeCallback: any;

  public selectedIndex = -1;
  public error = false;
  public touched = false;

  ngOnInit(): void {
    this.items = JSON.parse(JSON.stringify(this.items));
  }
  reset(): void {
    this.value = {label: "", id: -1};
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.selectChange.emit(this.value);
  }
  writeValue(value: any): void {
    this.value = value;
  }
  public isValid(): boolean {
     return this.value == null ? false : this.value.id == null ? false : this.value.id !== -1;
  }
  registerOnChange(fn: any): void {
      this.onChangeCallback = fn;
  }
  registerOnTouched(): void {
    this.touched = true;
  }

  toggleOpen(event: any): void {
    this.open = !this.open;
    if (this.open) {
      (this.tabInput.nativeElement as HTMLInputElement).focus();
    }
    event.stopPropagation();
  }
  close(event: any): void {
    this.open = false;
  }
  setValue(event: any, value: any): void {
    event.stopPropagation();
    this.open = false;
    if (value.id === -1) {
      return;
    }
    this.value = value;
    this.validate();
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.selectChange.emit(this.value);
  }
  public validate(): void {
    if (this.isValid()) {
      this.error = false;
    } else {
      this.trackError.emit(this.errorMessage);
      this.error = true;
    }
  }
  public tabIn(): void {
    this.open = true;
  }
  public tabOut(): void {
    setTimeout(() => {
      this.open = false;
    }, 100);
  }
  public keydown(e: any): void {
    switch (e.keyCode) {
      case 40:
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
          if (this.selectedIndex === this.items.length) {
            this.selectedIndex = this.items.length - 1;
          }
        }
        break;
      case 38:
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex--;
          if (this.selectedIndex === -1) {
            this.selectedIndex = 0;
          }
        }
        break;
      case 13:
        if (this.selectedIndex !== -1) {
          this.setValue(e, this.items[this.selectedIndex]);
        }
        break;
    }
  }
  public getlabel(): string {
    return this.value !== null && this.value !== undefined  ?
    (this.value.label === "" ? this.placeholder : this.value.label) : this.placeholder;
  }
  public getid(): any {
    return this.value !== null && this.value !== undefined ? this.value.id : null;
  }
}
