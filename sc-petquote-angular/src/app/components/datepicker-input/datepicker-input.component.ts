import {Component, OnInit, Input, Output, EventEmitter, forwardRef,
  ViewChild, ElementRef, HostListener} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import { CalendarComponent } from "../calendar/calendar.component";
import { ComponentService } from "src/app/services/component.service";
import { CopyModel } from "src/app/models/copy.model";

export function datePickerInputControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}



@Component({
  selector: "app-datepicker-input",
  templateUrl: "./datepicker-input.component.html",
  styleUrls: ["./datepicker-input.component.scss"],
  providers: [
    datePickerInputControlValueAccessor(DatepickerInputComponent)
  ]
})
export class DatepickerInputComponent implements ControlValueAccessor, OnInit {


  public day = "";
  public month = "";
  public year = "";
  public ogErrorMessage = "";

  private onChangeCallback: any;
  public lastSelectedDate: Date;
  @Input() value: Date = null;
  @Input() public pickerTarget: string;
  @Input() public tab = "0";
  @Input() public startDate = "";
  @Input() public startRange: Date;
  @Input() public endRange: Date;
  @Input() required = false;
  @Input() error = false;
  @Input() label = "";
  @Input() labelClass = "";
  @Input() errorMessage = "Please enter a valid date";
  @Input() errorMessageRange = "Date is out of range";
  @Input() errorMessageOverRange = "Date is out of range";
  @Input() clearbutton = true;
  @Input() hidepicker = false;
  @Input() isDOB = false;
  @Input() classes = "";
  @Output() valueChange = new EventEmitter<any>();
  @Output() focusInField = new EventEmitter<any>();
  @Output() trackError = new EventEmitter<any>();
  @ViewChild("input", {static: true}) input: ElementRef;
  @ViewChild("inputDay") inputDay: ElementRef;
  @ViewChild("inputMonth") inputMonth: ElementRef;
  @ViewChild("inputYear") inputYear: ElementRef;


  private calendar: CalendarComponent;
  private calendarOpen = false;
  private hasClearedField = false;
  private touched = false;


  constructor(private componentService: ComponentService) { }

  ngOnInit(): void {
    this.lastSelectedDate = new Date();
    this.ogErrorMessage = this.errorMessage;
    this.setValues();
  }

  focusin(field: string): void {
    this.focusInField.emit(field);
  }
  public writeValue(value: any): void {
     this.value = value;
     this.setValues();
  }
  setValues(): void {
    if (this.value !== undefined && this.value !== null) {
      this.day = this.value.getDate() < 10 ? "0" + this.value.getDate().toString() : this.value.getDate().toString();
      this.month = (this.value.getMonth() + 1) < 10 ?
      "0" + (this.value.getMonth() + 1).toString() : (this.value.getMonth() + 1).toString();
      this.year = this.value.getFullYear().toString();
    }
  }
  registerOnChange(fn: any): void {
      this.onChangeCallback = fn;
  }
  registerOnTouched(): void {
    this.touched = true;
   }

  openPicker(event: any): void {
    event.stopPropagation();
    if (!this.calendarOpen) {
      this.calendarOpen = true;
      this.calendar = this.componentService.calendar();

      this.calendar.selectedDate = this.value === null || this.value === undefined ?
      new Date(this.lastSelectedDate.toUTCString()) : new Date(this.value.toUTCString());
      this.calendar.currentDate = this.calendar.selectedDate;
      this.calendar.rememberDate = new Date(this.calendar.selectedDate.toUTCString());
      this.calendar.minDate = this.startRange;
      this.calendar.maxDate = this.endRange;
      this.calendar.dateSelected.subscribe((date: Date) => {
        this.lastSelectedDate = date;
        this.onPickerChange(date);
        this.closeCalendar();
      });
      this.calendar.monthChange.subscribe(() => {
        this.onResize(null);
      });
      this.onResize(null);
    }
  }
  @HostListener("window:resize", ["$event"])
  onResize(event: any): void {
    if (this.calendarOpen) {

      const diff: number = this.calendar.hasSixRow ? 400 : 360;
      const offset: any = this.componentService.offset(this.input.nativeElement);
      this.calendar.top = offset.top > 400 ? offset.offsetTop - diff : offset.offsetTop + 42;
      this.calendar.left = Math.max(5, Math.min(window.innerWidth - 360, offset.offsetLeft));
    }
  }
  @HostListener("window:mousedown", ["$event"])
  onWindowMouseDown(event: any): void {
    if (this.calendarOpen) {
      this.closeCalendar();
    }
  }
  @HostListener("mousedown", ["$event"])
  onLocalMouseDown(event: any): void {
    event.stopPropagation();
  }


  closeCalendar(): void {
    this.calendar.show = false;
    this.calendarOpen = false;
    setTimeout(() => {
      this.componentService.destroyCalendar();
    }, 1);
  }
  onPickerChange(date: Date): void {
    this.day = date.getDate() < 10 ?  "0" + date.getDate().toString() :  date.getDate().toString();
    this.month = (date.getMonth() + 1) < 10 ?  "0" + (date.getMonth() + 1).toString() :  (date.getMonth() + 1).toString();
    this.year = date.getFullYear().toString();
    this.error = false;
    this.value = new Date(date.toUTCString());
    this.lastSelectedDate = date;
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.validateInputFields(6);

  }
  dateInRange(date: Date): boolean {
    if (this.startRange !== null && this.startRange !== undefined) {
      this.startRange.setHours(0, 0, 0, 1);
      if (date < this.startRange) {
        return false;
      }
    }
    if (this.endRange !== null && this.endRange !== undefined) {
      this.endRange.setHours(23, 59, 59, 1);
      if (date > this.endRange) {
        return false;
      }
    }
    return true;
  }
  checkAfterClearFields(id: number): void {
    if (this.hasClearedField) {
      this.validateInputFields(id);
    }
  }
  focusoutInputFeilds(id: number): void {
    const dayInt: number = parseInt(this.day, 0);
    const monthInt: number = parseInt(this.month, 0);
    switch (id) {
      case 1:
        if (this.day.length === 1 && dayInt < 10) {
          this.day = String("00" + this.day).slice(-2);
        }
        break;
      case 2:
        if (this.month.length === 1 && monthInt < 10) {
          this.month = String("00" + this.month).slice(-2);
        }
        break;
    }
    this.checkAfterClearFields(id);
  }
  // manages text input
  validateInputFields(id: number): boolean {
    this.errorMessage = this.ogErrorMessage;
    this.value = null;
    const dayInt: number = Number(this.day);
    const monthInt: number = Number(this.month);
    const yearInt: number = Number(this.year);
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
          if (this.year.length !== 4) {
            break;
          }
          break;
      case 4:
          this.error = (this.day.length !== 2 || this.month.length !== 2 || this.year.length !== 4 || this.year === "0000");
          this.hasClearedField = true;
          break;
    }

    if ((this.day.length === 2 && this.month.length === 2 && this.year.length === 4 && !this.error) || this.hasClearedField) {
      this.value = new Date(monthInt + "/" + dayInt + "/" + yearInt);
      this.value.setHours(0, 0, 0, 1);
      if (!this.dateInRange(this.value)) {
        if (this.value < this.startRange) {
          this.errorMessage = this.errorMessageOverRange;
        } else {
          if (this.isDOB && this.value.getTime() > new Date().getTime()) {
            this.errorMessage = this.errorMessageOverRange;
          } else {
            this.errorMessage = this.errorMessageRange;
          }
        }
        this.value = null;
        this.error = true;
        this.trackError.emit(this.errorMessage);
      }
      const dateString: string = (dayInt < 10 ? "0" + dayInt.toString() : dayInt.toString()) + "/" +
      (monthInt < 10 ? "0" + monthInt.toString() : monthInt.toString()) + "/" + yearInt.toString();
      if (!CopyModel.isValidDateString(dateString)) {
        this.value = null;
        this.error = true;
        this.trackError.emit(this.errorMessage);
      }
    } else {
      this.value = null;
    }
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.valueChange.emit(this.value);
    return this.error;
  }
  clearfield(): void {
    this.hasClearedField = true;
    this.lastSelectedDate = new Date(this.value.toUTCString());
    this.value = null;
    this.day = "";
    this.month = "";
    this.year = "";
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.valueChange.emit(this.value);
    (this.inputDay.nativeElement as HTMLInputElement).focus();
  }
  isValid(): boolean {
    return !this.error;
  }
}
