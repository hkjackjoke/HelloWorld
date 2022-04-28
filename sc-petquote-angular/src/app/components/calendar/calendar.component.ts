import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @Input() public currentDate = new Date();
  public tmpDate: Date;
  @Input() public selectedDate: Date = new Date();
  @Input() public rememberDate: Date;
  @Input() public minDate: Date;
  @Input() public maxDate: Date;
  @Input() public show = true;
  @Input() public position = "";
  @Input() public title = "Select invoice date";
  @Input() public top = 0;
  @Input() public left = 0;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() calendarInitialised = new EventEmitter<Date>();
  @Output() monthChange = new EventEmitter<any>();
  public row1Dates: Array<any>;
  public row2Dates: Array<any>;
  public row3Dates: Array<any>;
  public row4Dates: Array<any>;
  public row5Dates: Array<any>;
  public row6Dates: Array<any>;
  public row1Months: Array<any>;
  public row2Months: Array<any>;
  public row3Months: Array<any>;
  public row4Months: Array<any>;
  public monthString: string;
  public yearString: string;
  public allowMonthBack = true;
  public allowMonthForward = true;
  public hasSixRow = false;
  public viewMonths = false;
  public viewSelectedDay = true;
  public selectedMonth = -1;
  public monthStrings = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  public monthLengths = [31, (this.isLeapYear() ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  @ViewChild("tabInput") public tabInput: ElementRef;

  ngOnInit(): void {
    this.setView();
    setTimeout(() => {
      this.show = true;
    }, 50);
  }
  ngAfterViewInit(): void  {

    (this.tabInput.nativeElement as HTMLInputElement).focus();
  }

  @HostListener("mousedown", ["$event"])
  onLocalMouseDown(event: any): void  {
    event.stopPropagation();
  }
  selectMonth(month: any): void  {
    if (month.css !== "disabled") {
      this.selectedMonth = month.month;
      this.selectedDate.setMonth(this.selectedMonth);
      this.setView();
      this.monthChange.emit();
      setTimeout(() => {
          this.viewMonths = false;
      }, 500);
    }
  }
  displayMonths(): void  {

    const monthCells: Array<any> = [];
    this.monthStrings.forEach((item: string, index: number) => {
      monthCells.push({value: item, month: index, css: this.getMonthCellStyle(index)});
    });
    this.row1Months = monthCells.slice(0, 3);
    this.row2Months = monthCells.slice(3, 6);
    this.row3Months = monthCells.slice(6, 9);
    this.row4Months = monthCells.slice(9);
    if (this.minDate !== undefined) {
      this.allowMonthBack = this.selectedDate.getFullYear() > this.minDate.getFullYear();
    }
    if (this.maxDate !== undefined) {
      this.allowMonthForward = this.selectedDate.getFullYear() < this.maxDate.getFullYear();
    }
  }
  getMonthCellStyle(month: number): string {
    if (this.minDate !== undefined) {
      if (month < this.minDate.getMonth() && this.minDate.getFullYear() === this.selectedDate.getFullYear()) {
        return "disabled";
      }
    }
    if (this.maxDate !== undefined) {
      if (month > this.maxDate.getMonth() && this.maxDate.getFullYear() === this.selectedDate.getFullYear()) {
        return "disabled";
      }
    }
    return "";
  }
  showMonths(): void {
    this.viewMonths = true;
    this.displayMonths();
  }
  select(): void  {
    if (this.viewMonths) {
      this.viewMonths = false;
      if (this.selectedMonth !== -1) {
        this.selectedDate.setMonth(this.selectedMonth);
      }
      this.setView();
      this.selectedMonth = -1;
    } else {
      setTimeout(() => {
        this.show = false;
        this.dateSelected.emit(this.viewSelectedDay ? this.selectedDate : this.rememberDate);
      }, 500);
    }
  }
  monthPrev(): void  {
    if (this.allowMonthBack) {
      if (this.viewMonths) {
        this.selectedDate.setFullYear( this.selectedDate.getFullYear() - 1);
        this.yearString = this.selectedDate.getFullYear().toString();
        this.displayMonths();
      } else {
        this.viewSelectedDay = false;
        this.selectedDate.setDate(1);
        this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);

        if (this.minDate !== undefined) {
          this.minDate.setHours(0, 0, 0, 1);
          if (this.selectedDate.getTime() <  this.minDate.getTime()) {
            this.selectedDate.setDate(this.minDate.getDate());
          }
        }
        if (this.rememberDate !== undefined) {
          if (this.selectedDate.getMonth() === this.rememberDate.getMonth() &&
           this.selectedDate.getFullYear() === this.rememberDate.getFullYear()) {
            this.selectedDate.setDate(this.rememberDate.getDate());
            this.viewSelectedDay = true;
          }
        }
        this.setView();
        this.monthChange.emit();
      }
    }
  }
  monthNext(): void  {
    if (this.allowMonthForward) {
      if (this.viewMonths) {
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1);
        this.yearString = this.selectedDate.getFullYear().toString();
        this.displayMonths();
      } else {
        this.viewSelectedDay = false;
        this.selectedDate.setDate(1);
        this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
        if (this.rememberDate !== undefined) {
          if (this.selectedDate.getMonth() === this.rememberDate.getMonth() &&
           this.selectedDate.getFullYear() === this.rememberDate.getFullYear()) {
            this.selectedDate.setDate(this.rememberDate.getDate());
            this.viewSelectedDay = true;
          }
        }
        this.setView();
        this.monthChange.emit();
      }
    }
  }
  selectDate(day: any): void  {
    if (day.value && day.css !== "disabled") {
      this.viewSelectedDay = true;
      this.selectedDate.setDate(day.value);
      this.currentDate = this.selectedDate;
      this.setView();
      this.select();
    }
  }
  setView(): void  {
    if (this.selectedDate === undefined) {
      this.selectedDate = new Date();
    }
    const prevMonth: Date = new Date();
    prevMonth.setTime(this.selectedDate.getTime());
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    if (this.minDate !== undefined) {
      this.minDate.setHours(0, 0, 0, 1);
      this.allowMonthBack = this.selectedDate.getMonth() > this.minDate.getMonth() ||
      this.minDate.getFullYear() < this.selectedDate.getFullYear();
    }
    if (this.maxDate !== undefined) {
      this.maxDate.setHours(23, 59, 59, 1);
      this.allowMonthForward = this.selectedDate.getMonth() < this.maxDate.getMonth() ||
      this.maxDate.getFullYear() > this.selectedDate.getFullYear();
    }
    this.tmpDate = new Date(this.selectedDate.toUTCString());
    this.tmpDate.setDate(this.tmpDate.getDate() - this.selectedDate.getDate() + 1);
    const dayStart: any = this.tmpDate.getDay();
    this.monthString = this.monthStrings[this.selectedDate.getMonth()];
    this.yearString = this.selectedDate.getFullYear().toString();
    const monthLength: any = this.monthLengths[this.selectedDate.getMonth()];
    const dayCells: any = [];
    let dayCount: any = 1;
    for (let i: number = 1; i <= 42; i++) {
      if (i >= dayStart && dayCount <= monthLength) {
        const d:Date = new Date(this.tmpDate.toUTCString());
        d.setDate(dayCount);
        d.setHours(0, 0, 0, 1);
        dayCells.push({value: dayCount, css: this.getCellStyle(dayCount, d)});
        dayCount++;
      } else {
        dayCells.push({value: "", css: "disabled"});
      }
    }
    this.row1Dates = dayCells.slice(0, 7);
    this.row2Dates = dayCells.slice(7, 14);
    this.row3Dates = dayCells.slice(14, 21);
    this.row4Dates = dayCells.slice(21, 28);
    this.row5Dates = dayCells.slice(28, 35);
    this.row6Dates = dayCells.slice(35);
    this.hasSixRow = false;
    this.row6Dates.forEach((value: any, index: number) => {
      if (value.value !== "") {
        this.hasSixRow = true;
      }
    });
  }

  getCellStyle(day: number, date: Date ): string {
    if (this.minDate !== undefined) {
      if (date.getTime() < this.minDate.getTime()) {
        return "disabled";
      }
    }
    if (this.maxDate !== undefined) {
      if (date.getTime() > this.maxDate.getTime()) {
        return "disabled";
      }
    }
    const today: Date = new Date();
    return day === this.selectedDate.getDate() &&
    this.selectedDate.getMonth() === this.currentDate.getMonth() &&
    this.selectedDate.getFullYear() === this.currentDate.getFullYear() && this.viewSelectedDay ? "sd" :
    (day === today.getDate() &&
    this.selectedDate.getMonth() === today.getMonth() &&
    this.selectedDate.getFullYear() === today.getFullYear()  ? "cd" : "");
  }
  isLeapYear(): boolean {
    return (this.selectedDate.getFullYear() % 100 === 0)
    ? (this.selectedDate.getFullYear() % 400 === 0) : (this.selectedDate.getFullYear() % 4 === 0);
  }
  setKeyedDate(numberChange: number): void {
    const date: Date = new Date(this.selectedDate.getTime());
    date.setDate(date.getDate() + numberChange);
    if (this.minDate !== undefined) {
      const minDateCompair: Date = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate(), 0, 0, 0);
      if (date < minDateCompair) {
        return;
      }
    }
    if (this.maxDate !== undefined) {
      const maxDateCompair: Date = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate(), 24, 59, 59);
      if (date > maxDateCompair) {
        return;
      }
    }
    this.selectedDate = date;
    this.setView();
  }
  keydown(e: any): void {
    switch (e.keyCode) {
      case 40: // down
        this.setKeyedDate(7);
        break;
      case 38: // up
        this.setKeyedDate(-7);
        break;
      case 37: // left
        this.setKeyedDate(-1);
        break;
      case 39: // right
        this.setKeyedDate(1);
        break;
      case 13: // enter
        this.select();
        break;
    }
  }
}
