import {Component, Input, Output, EventEmitter,
  forwardRef, ViewChild, ElementRef, HostListener} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";
import { CalendarComponent } from "../calendar/calendar.component";
import { ComponentService } from "src/app/services/component.service";


export function datePickerControlValueAccessor(extendedInputComponent: any): any {
  return {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => extendedInputComponent),
      multi: true
  };
}


@Component({
  selector: "app-date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"],
  providers: [
    datePickerControlValueAccessor(DatePickerComponent)
  ]
})
export class DatePickerComponent implements ControlValueAccessor {

  @ViewChild("input", {static: true}) input: ElementRef;
  @Output() dateSelected = new EventEmitter<any>();
  @Output() calendarOpened = new EventEmitter<any>();
  @Output() calendarClosed = new EventEmitter<any>();

  @Input() public keepInRange = false;
  @Input() public startRange: Date;
  @Input() public endRange: Date;
  @Input() public pickerTarget: string;
  @Input() public tab = "0";
  @Input() public title = "Select date";
  public value: Date;
  public lastSelectedDate: Date;
  public valueText: string;
  private onChangeCallback: any;
  private calendar: CalendarComponent;
  private calendarOpen = false;
  private touch = false;
  constructor(private componentService: ComponentService) { }

  openPicker(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.calendarOpen) {
      this.calendarOpen = true;
      this.calendar = this.componentService.calendar();
      this.calendar.selectedDate = this.value === undefined || this.value === null ? new Date() : new Date(this.value.toUTCString());
      this.calendar.currentDate =  this.calendar.selectedDate;
      this.calendar.rememberDate = new Date(this.calendar.selectedDate.toUTCString());
      this.calendar.minDate = this.startRange;
      this.calendar.maxDate = this.endRange;
      this.calendar.title = this.title;
      this.calendar.dateSelected.subscribe((date: Date) => {
          this.lastSelectedDate = date;
          this.onChange(date);
          this.closeCalendar();
      });
      this.calendar.monthChange.subscribe(() => {
        this.onResize(null);
      });
      this.calendarOpened.emit();
      this.onResize(null);
    }
  }
  @HostListener("window:resize", ["$event"])
  onResize(event: any): void {
    if (this.calendarOpen) {
      const offset: any = this.componentService.offset(this.input.nativeElement);
      const diff: any  = this.calendar.hasSixRow ? 400 : 360;
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
  onLocalMouseDown(event: any): void  {
    event.stopPropagation();
  }
  closeCalendar(): void  {
    setTimeout(() => {
      this.calendar.show = false;
      this.calendarOpen = false;
      setTimeout(() => {
        this.componentService.destroyCalendar();
      }, 1);
      (this.input.nativeElement as HTMLInputElement).focus();
      this.calendarClosed.emit();
    }, 300);
  }
  writeValue(value: any): void  {
    if (value !== this.value && value !== null) {
        this.value = value;
        this.valueText = this.getDisplayDate(this.value);
    }
  }
  registerOnChange(fn: any): void  {
      this.onChangeCallback = fn;
  }
  registerOnTouched(): void  {
    this.touch = true;
  }
  onChange(date: Date): void  {
    this.value = new Date(date.toUTCString());
    this.valueText = this.getDisplayDate(this.value);
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.dateSelected.emit(new Date(this.value));
  }
  getFormattedDate(date: Date): string  {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }
  getDisplayDate(date: Date): string {
    const months: Array<string> = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
  }

  public keydown(e: any): void {
    switch (e.keyCode) {
      case 13:
        this.openPicker(e);
        break;
    }
  }
}
