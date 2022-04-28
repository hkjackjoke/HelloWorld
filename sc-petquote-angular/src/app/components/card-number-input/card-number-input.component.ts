import { Component, ViewChild, forwardRef, ElementRef, Input, AfterViewInit, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
export function cardNumberControlValueAccessor(extendedInputComponent: any): any {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => extendedInputComponent),
        multi: true
    };
}


@Component({
  selector: "app-card-number-input",
  templateUrl: "./card-number-input.component.html",
  styleUrls: ["./card-number-input.component.scss"],
  providers: [cardNumberControlValueAccessor(CardNumberInputComponent)]
})
export class CardNumberInputComponent implements ControlValueAccessor, AfterViewInit {

  @ViewChild("inputA") inputA: ElementRef;
  @ViewChild("inputB") inputB: ElementRef;
  @ViewChild("inputC") inputC: ElementRef;
  @ViewChild("inputD") inputD: ElementRef;
  value = "";
  @Output() valueChange = new EventEmitter<any>();
  @Input() tab1: number;
  @Input() tab2: number;
  @Input() tab3: number;
  @Input() tab4: number;
  public valueA = "";
  public valueB = "";
  public valueC = "";
  public valueD = "";
  public touched = false;
  onChangeCallback: any;



  writeValue(value: any): void {
    if (value !== this.value) {
        this.value = value;
        if (value != null) {
          this.valueA = this.value.substr(0, 4);
          this.valueB = this.value.substr(4, 4);
          this.valueC = this.value.substr(8, 4);
          this.valueD = this.value.substr(12, 4);
        }
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(): void {
    this.touched = true;
  }
  private onChange(): void {
    this.valueA = (this.inputA.nativeElement as HTMLInputElement).value;
    this.valueB = (this.inputB.nativeElement as HTMLInputElement).value;
    this.valueC = (this.inputC.nativeElement as HTMLInputElement).value;
    this.valueD = (this.inputD.nativeElement as HTMLInputElement).value;
    this.onChangeCallback(this.valueA + this.valueB + this.valueC + this.valueD);
    this.valueChange.emit();
    if (this.valueA.length === 4) {
      (this.inputB.nativeElement as HTMLInputElement).focus();
    } else {
      return;
    }
    if (this.valueB.length === 4) {
      (this.inputC.nativeElement as HTMLInputElement).focus();
    } else {
      return;
    }
    if (this.valueC.length === 4) {
      (this.inputD.nativeElement as HTMLInputElement).focus();
    }

  }

  ngAfterViewInit(): void {
    this.setEvents(this.inputA.nativeElement as HTMLInputElement);
    this.setEvents(this.inputB.nativeElement as HTMLInputElement);
    this.setEvents(this.inputC.nativeElement as HTMLInputElement);
    this.setEvents(this.inputD.nativeElement as HTMLInputElement);
  }
  setEvents(input: HTMLInputElement): void {
    input.onchange = () => this.onChange();
    input.onkeyup = () => this.onChange();
  }

}
