import { Component, ViewChild,  ElementRef, Output, Input, EventEmitter, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { CopyModel } from "src/app/models/copy.model";




export function dobControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}


export const MY_FORMATS: any = {
  parse: {
    dateInput: "MMM d y",
  },
  display: {
    dateInput: "D MMM YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-dobinput",
  templateUrl: "./dobinput.component.html",
  styleUrls: ["./dobinput.component.scss"],
  providers: [
    dobControlValueAccessor(DOBInputComponent)
  ]
})

export class DOBInputComponent implements ControlValueAccessor {

  @ViewChild("inputDay") inputDay: ElementRef;
  @ViewChild("inputMonth") inputMonth: ElementRef;
  @ViewChild("inputYear") inputYear: ElementRef;


  @Input() public keepInRange = false;
  @Input() public startRange: Date;
  @Input() public endRange: Date;
  @Input() public pickerTarget: string;
  @Input() public starttoday = false;

  @Input() label: string;
  @Input() seperator = "";
  @Input() value: string;
  @Input() tab1: number;
  @Input() tab2: number;
  @Input() tab3: number;
  @Input() minYear: number;
  @Input() error = false;
  @Input() clearbutton = false;
  @Input() errorMessage = "";
  @Input() required = false;

  @Output() valueChange = new EventEmitter<any>();
  @Output() focusInField = new EventEmitter<any>();

  public onChangeCallback: any;
  public touched: boolean;
  @Input() day = "";
  @Input() month = "";
  @Input() year = "";
  public message = "Please enter a valid date of birth.";

  writeValue(value: any): any {
    if (value !== this.value) {
        this.value = value;
        const testDate: Date = new Date(this.value);
        if (this.keepInRange && this.startRange !== undefined) {
          if (testDate.getTime() < this.startRange.getTime()) {
            this.value = this.getFormattedDate(this.startRange);
          }
        }

        if (this.keepInRange && this.endRange !== undefined) {
          if (testDate.getTime() > this.endRange.getTime()) {
            this.value = this.getFormattedDate(this.endRange);
          }
        }

        if (this.value) {
          this.day = this.value.substr(0, 2);
          this.month = this.value.substr(3, 2);
          this.year = this.value.substr(6, 4);
        }
    }
  }
  getFormattedDate(date: Date): string {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(): void {
    this.touched = true;
   }
  focusin(field: string): void  {
    this.focusInField.emit(field);
  }
  focusout(id: number): void {
    const dayInt: number = parseInt(this.day, 0);
    const monthInt: number = parseInt(this.month, 0);
    switch (id) {
      case 1:
        if (this.day.length === 1 && dayInt < 10) {
          this.day = "0" + this.day;
        }
        break;
      case 2:
        if (this.month.length === 1 && monthInt < 10) {
          this.month = "0" + this.month;
        }
        break;
    }
  }
  onChange(dateText: string): void {
    if (dateText !== "" && dateText !== null) {
      let finalDate: Date = new Date(dateText);
      if (this.keepInRange && this.startRange !== undefined) {
        if (finalDate.getTime() < this.startRange.getTime()) {
          finalDate = new Date(this.startRange);
        }
      }
      if (this.keepInRange && this.endRange !== undefined) {
        if (finalDate.getTime() > this.endRange.getTime()) {
          finalDate = new Date(this.endRange);
        }
      }
      this.value = this.getFormattedDate(finalDate);
    } else {
      this.value = "";
    }
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.valueChange.emit(new Date(this.value));
  }
  validate(id: number): boolean {
    const date: Date = new Date();
    const dayInt: number = Number(this.day);
    const monthInt: number  = Number(this.month);
    const yearInt: number  = Number(this.year);
    if (!this.required && dayInt === 0 && monthInt === 0 && yearInt === 0) {
      this.valueChange.emit(this.value);
      return;
    }
    switch (id) {
      case 1:
        if (this.day.length === 2) {
          this.error = dayInt > 31 || dayInt === 0;
          if (!this.error) {
            (this.inputMonth.nativeElement as HTMLInputElement).focus();
          }
        }
        break;
      case 2:
          if (this.month.length === 2) {
            this.error = monthInt > 12 || monthInt === 0;
            if (!this.error) {
              (this.inputYear.nativeElement as HTMLInputElement).focus();
            }
          }
          break;
      case 3:
          this.error = yearInt > date.getFullYear() || yearInt === 0 || this.year === "0000";
          if (!this.error) {
            if (this.minYear !== undefined) {
              if (yearInt < this.minYear) {
                this.error = true;
              }
            }
          }
          break;
      case 4:
          this.error = (this.day.length !== 2 || this.month.length !== 2 || this.year.length !== 4);
          break;
    }
    if (this.day.length === 2 && this.month.length === 2 && this.year.length === 4 && !this.error) {
      this.value = this.day + "/" + this.month + "/" + this.year;
      if (yearInt === date.getFullYear()) {
        if (monthInt > date.getMonth() + 1) {
          this.value = "";
          this.error = true;
        }
        if (monthInt === date.getMonth() + 1) {
          if (dayInt > date.getDate()) {
            this.value = "";
            this.error = true;
          }
        }
      }
      if (monthInt > 12) {
        this.value = "";
        this.error = true;
      }
      if (dayInt > 31) {
        this.value = "";
        this.error = true;
      }
      if (date.getFullYear() - yearInt > 110) {
        this.value = "";
        this.error = true;
      }
      if (yearInt > date.getFullYear()) {
        this.value = "";
        this.error = true;
      }
      if (!CopyModel.isValidDateString(this.value)) {
        this.value = "";
        this.error = true;
      }
    } else {
      this.value = "";
    }
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.valueChange.emit(this.value);
    return this.error;
  }
  public clearfield(): void {
    this.value = this.day = this.month = this.year = "";
    this.validate(4);
    this.valueChange.emit(this.value);
  }
}
