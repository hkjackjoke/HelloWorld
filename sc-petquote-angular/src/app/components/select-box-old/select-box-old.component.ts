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
  selector: "app-select-box-old",
  templateUrl: "./select-box-old.component.html",
  styleUrls: ["./select-box-old.component.scss"],
  providers: [selectBoxControlValueAccessor(SelectBoxOldComponent)]
})
export class SelectBoxOldComponent implements ControlValueAccessor, OnInit {


  open = false;
  @Input() value = {label: "", id: -1};
  @Input() items: Array<any>;
  @Input() placeholder = "Please select…";
  @Input() tab: string;
  @Input() disabled = false;

  @Output() selectChange = new EventEmitter<any>();
  @ViewChild("tabInput", {static: true}) tabInput: ElementRef;
  private onChangeCallback: any;
  private _onTouched: any;
  public selectedIndex = -1;
  ngOnInit(): void {
    this.items = JSON.parse(JSON.stringify(this.items));
    this.items.unshift({label: this.placeholder, id: -1});
  }
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
      this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  toggleOpen(event: any): void {
    if (!this.disabled) {
      this.open = !this.open;
      if (this.open) {
        (this.tabInput.nativeElement as HTMLInputElement).focus();
      }
      event.stopPropagation();
    }
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
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.selectChange.emit(this.value);
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
    return this.value !== null && this.value !== undefined ? this.value.id : 0;
  }
  public reset(): void {
    this.value = {label: "", id: -1};
    this.selectChange.emit(this.value);
  }
}
