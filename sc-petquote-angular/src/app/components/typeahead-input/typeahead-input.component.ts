import { Component, OnInit, Input, Output,  EventEmitter, ViewChild, ElementRef, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
export function typeaheadInputControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}
@Component({
  selector: "app-typeahead-input",
  templateUrl: "./typeahead-input.component.html",
  styleUrls: ["./typeahead-input.component.scss"],
  providers: [typeaheadInputControlValueAccessor(TypeaheadInputComponent)]
})
export class TypeaheadInputComponent implements ControlValueAccessor, OnInit {
  @Input() items: Array<any>;

  @Input() popularId: Array<any> = [];
  @Input() value: any = {label: "", Code: "", id: -1};
  @Input() placeholder: string;
  @Input() error: boolean;
  @Input() tab: number;
  @Input() disabled = false;
  @Input() selectClass: string;
  @Output() selectChange = new EventEmitter<any>();
  @Output() inputFocusout = new EventEmitter<any>();

  @ViewChild("field", {static: true}) field: ElementRef;
  @ViewChild("searchinput", {static: true}) searchinput: ElementRef;
  private onChangeCallback: any;
  private _onTouched: any;
  public popular: Array<any>;
  public open = false;
  public selectOpen = false;
  public showListTitle = false;
  public readonly = false;
  public selectedIndex = -1;
  @Input() result: Array<any> = [{label: "", id: 0}];
  ngOnInit(): void {
    this.value = {label: "", id: -1};
    this.result = this.items;
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
  close(event: any): void {
    if (event.target.className.indexOf("input-field") !== -1) {
      return;
    }
    this.open = this.selectOpen = false;
    this.validate();
    (this.searchinput.nativeElement as HTMLInputElement).blur();
  }
  toggleOpen(event: any): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.open = !this.open;
      if (this.open) {
        this.tabIn(true) ;
        } else {
        this.selectOpen = false;
      }
    }
  }
  tabIn(focus: boolean = false): void {
    if (!this.disabled) {
      this.open = true;
      this.selectOpen = true;
      this.readonly = false;
      this.result = this.items;
      this.showListTitle = this.popularId.length > 0;
      if (this.showListTitle) {
        this.popular = [];
        this.popularId.forEach((id: any, i: number) => {
          this.items.forEach((value: any, index: number) => {
            if (id === value.Code) {
              this.popular.push(value);
            }
          });
        });
      }
      if (focus) {
        setTimeout(() => {
          (this.searchinput.nativeElement as HTMLInputElement).focus();
        }, 1);
      }
    }
  }
  tabOut(): void {
    setTimeout(() => {
      this.open = this.selectOpen = false;
    }, 300);

    (this.searchinput.nativeElement as HTMLInputElement).value = this.value.label;
    this.validate();
    this.inputFocusout.emit();
  }
  setValue(event: any, data: any): void {
    if (event) {
      event.stopPropagation();
    }
    this.value = data;
    this.readonly = true;
    (this.searchinput.nativeElement as HTMLInputElement).value = this.value.label;
    this.validate();
    (this.searchinput.nativeElement as HTMLInputElement).value = this.value.label;
    this.open = this.selectOpen = false;
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.selectChange.emit(this.value);
  }

  search(e: any): void {

    const result:Array<any> = [];
    const searchValue: string = (this.searchinput.nativeElement as HTMLInputElement).value;
    const searchLength: number = searchValue.length;
    if(searchLength){
      this.popular = [];
      this.items.forEach((breed: any, index: number) => {
        const regex: RegExp = new RegExp( searchValue, "gi" );
        if (regex.test(breed.label)) {
          result.push(breed);
        }
      });
      this.result = result;
    }
    if (!this.result.length) {
      this.selectOpen = false;
      this.showListTitle = true;
      this.result = this.items;
    } else {
      this.showListTitle = false;
      this.selectOpen = true;
    }

  }
  validate(): boolean {
    let found: boolean = false;
    this.items.forEach((breed: any, index: number) => {
      if (this.value !== null && this.value !== undefined) {
        if (breed.label === this.value.label) {
          found = breed;
          this.value.id = breed.id;
        }
      }
    });
    if (!found) {
      this.value = {label: "", id: -1};
    }
    return found;
  }
  inputKeyDown(e: any): void {
    switch (e.keyCode) {
      case 40:
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
          if (this.selectedIndex === this.result.length) {
            this.selectedIndex = this.result.length - 1;
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
          this.setValue(e, this.result[this.selectedIndex]);
        }
        break;
    }
  }
}
