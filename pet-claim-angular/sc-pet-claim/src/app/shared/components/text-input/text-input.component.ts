import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { OrganisationModel, emptyOrganisation } from 'src/app/core/models/organisation.model';
import { ComponentService } from 'src/app/core/services/component.service';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { inputFieldsetControlValueAccessor } from '../../value.accessors';
import { CalendarComponent } from '../calendar/calendar.component';


@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    inputFieldsetControlValueAccessor(TextInputComponent)
  ]
})
export class TextInputComponent implements ControlValueAccessor, OnInit {

  @Input() value: any;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() errorMessage = '';
  @Input() tabindexValue = 0;
  @Input() required = true;
  @Input() freeField = true;
  @Input() preventPaste = false;
  @Input() maxlength = '';
  @Input() interactionName = '';
  @Input() prefixedValue = '';
  @Input() searchItems: OrganisationModel[];
  @Input() startRange: Date;
  @Input() endRange: Date;
  @Output() inputChange = new EventEmitter<string>();
  @Output() focusOut = new EventEmitter<string>();
  @Output() calendarSelect = new EventEmitter<any>();
  @ViewChild('calendarInput', {static: false}) calendarInput: ElementRef;
  @ViewChild('searchInput', {static: false}) searchInput: ElementRef;
  @ViewChild('searchList', {static: false}) searchList: ElementRef;
  @ViewChild('currencyInput', {static: false}) currencyInput: ElementRef;
  private onChangeCallback: any;
  private calendar: CalendarComponent;
  private calendarOpen = false;
  public hasEditied = false;
  public complete = false;
  public error = false;
  public dateTextValue = '';
  public inputState = '';
  public searchResults: OrganisationModel[];
  public selectedItem: OrganisationModel;
  public selectedIndex = 0;
  public searchValue = '';
  public displaySearchResults = false;
  constructor(
    private componentService: ComponentService,
    private validation: ValidationService,
    private tracking: TrackingService) {
    if (this.type === 'calendar'){
      if (this.value === undefined){
        this.value = new Date();
      }
      this.setDateTextValue();
    }
  }
  ngOnInit(): void {
    if (this.type === 'calendar'){
      if (this.value === undefined){
        this.value = new Date();
      }
      this.setDateTextValue();
    }
  }
  setDateTextValue(): void{
    this.dateTextValue = this.validation.setDateTextValue(this.value);
  }
  validate(): void{
    this.error = false;
    if (this.required){
      if (this.type === 'currency'){
        this.onChangeCallback(this.value);
      }
      if (this.type === 'text'){
        if (this.validation.isEmptyString(this.value)) {
          this.error = true;
        }
      }
      if (this.type === 'tel'){
        if (!this.validation.validatePhone(this.value)) {
          this.error = true;
        }
      }
      if (this.type === 'email'){
        if (!this.validation.validateEmail(this.value)) {
          this.error = true;
        }
      }
      this.focusOut.emit(this.value);
    }

    this.complete = !this.error && (this.value !== '0.00' && this.value !== '');
    if (this.type === 'search'){
      if (this.value.organisationName === '') {
        this.complete = false;
      }
    }
  }
  search(): void{
    this.searchResults = new Array<OrganisationModel>();
    const keyword = (this.searchInput.nativeElement as HTMLInputElement).value.toLowerCase().trim();
    if (this.freeField){
      this.value = (this.searchInput.nativeElement as HTMLInputElement).value.trim();
      if (this.onChangeCallback !== undefined) {
        this.onChangeCallback(this.value);
      }
      this.inputChange.emit(this.value);
    }
    if (!this.validation.isEmptyString(keyword)){
      this.searchItems.forEach((item: OrganisationModel, index: number) => {
        if (item.organisationName.toLowerCase().indexOf(keyword) !== -1){
          this.searchResults.push(item);
        }
      });
    }
    this.displaySearchResults = this.searchResults.length > 0;
    if (this.displaySearchResults){
      this.selectedIndex = 0;
      this.selectedItem = this.searchResults[0];
    }
  }
  selectSearchItem(item: OrganisationModel): void{
    if (this.freeField){
      this.value = item.organisationName;
    } else {
      this.value = item;
    }
    this.displaySearchResults = false;
    this.searchValue = item.organisationName;
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.hasEditied = true;
    this.complete = true;
    this.inputChange.emit(this.value);
  }
  onPaste(event: any): void{
    if (this.type === 'currency' || this.type === 'policy-number' || this.type === 'tel'){
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      const pastedData = clipboardData.getData('Text');
      if (isNaN(Number((pastedData)))) {
        event.preventDefault();
      }
    }
  }
  onInput(): void{
    if (this.type === 'currency'){
      const current = this.value;
      if (current.indexOf('.') > -1){
        const a = current.split('');
        let dollar = '';
        let cents = '';
        let dotFound = false;
        a.forEach((value: string, index: number) => {
          if (value !== '.'){
            if (dotFound){
              cents += value;
            }else{
              dollar += value;
            }
          }else{
            dotFound = true;
          }
        });
        if (dollar.length > 6){
          dollar = dollar.substr(0, 6);
        }
        this.value = dollar + '.' + cents.substr(0, 2);
        (this.currencyInput.nativeElement as HTMLInputElement).value = this.value;
      }else{
        if (current.length > 6){
          this.value = current.substr(0, 6);
          (this.currencyInput.nativeElement as HTMLInputElement).value = this.value;
        }
      }
    }
    if (this.type === 'tel'){
      this.value = this.value.split('+').join('');
    }
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    this.inputChange.emit(this.value);
    this.hasEditied = true;
  }
  public writeValue(value: any): void {
    if (value !== this.value && value !== null) {
        this.value = value;
        if (this.value){
          this.hasEditied = true;
        }
        if (this.type === 'search'){
          if (this.freeField){
            this.searchValue = this.value;
          } else {
            this.searchValue = this.value.organisationName;
          }
        }
        if (this.type === 'calendar'){
          this.dateTextValue = this.validation.setDateTextValue(this.value);
        }
        if (this.hasEditied){
          this.validate();
        }
    }
  }
  focusIn(): void{
    switch (this.type){
      case 'search':
        (this.searchInput.nativeElement as HTMLInputElement).focus();
        break;
    }
  }
  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  public registerOnTouched(event: MouseEvent): void { }
  public openCalendar(event: MouseEvent): void{
    event.stopPropagation();
    if (!this.calendarOpen) {
      this.calendarOpen = true;
      this.calendar = this.componentService.calendar();
      this.calendar.selectedDate = this.value === undefined || this.value === null ? new Date() : new Date(this.value.toUTCString());
      this.calendar.currentDate =  this.calendar.selectedDate;
      this.calendar.rememberDate = new Date(this.calendar.selectedDate.toUTCString());
      this.calendar.minDate = this.startRange;
      this.calendar.maxDate = this.endRange;
      this.calendar.dateSelected.subscribe((date: Date) => {
          this.value = date;
          if (this.onChangeCallback !== undefined) {
            this.onChangeCallback(this.value);
          }
          this.dateTextValue = this.validation.setDateTextValue(this.value);
          this.trackField();
          this.closeCalendar();
          this.inputChange.emit(this.value);
          this.calendarSelect.emit(this.value);
      });
      this.calendar.monthChange.subscribe(() => {
        this.onResize(null);
      });
      this.onResize(null);
    }
  }
  clear(): void{
    this.value = '';
    if (this.type === 'search'){
      this.value = emptyOrganisation();
    }
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    if (this.type === 'search'){
      this.searchValue = '';
      this.value = '';
      this.onChangeCallback(this.value);
    }
    this.validate();
    this.inputChange.emit(this.value);
  }
  selectCurrency(): void{
    (this.currencyInput.nativeElement as HTMLInputElement).select();
  }
  closeCalendar(): void {
    this.calendar.show = false;
    this.calendarOpen = false;
    setTimeout(() => {
      this.componentService.destroyCalendar();
    }, 1);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.calendarOpen) {
      const offset = this.componentService.offset(this.calendarInput.nativeElement);
      const diff = this.calendar.hasSixRow ? 400 : 360;
      this.calendar.top = offset.top > 400 ? offset.offsetTop - diff : offset.offsetTop + 42;
      this.calendar.left = Math.max(5, Math.min(window.innerWidth - 360, offset.offsetLeft));
    }
  }
  @HostListener('window:mousedown', ['$event'])
  onWindowMouseDown(event: any): void {
    if (this.calendarOpen) {
      this.closeCalendar();
    }
  }
  @HostListener('mousedown', ['$event'])
  onLocalMouseDown(event: any): void  {
    if (this.type === 'calendar'){
      event.stopPropagation();
    }
  }
  @HostListener('keydown', ['$event'])
  onLocalKeyDown(event: any): void  {
    if (this.type === 'search'){
      switch (event.keyCode){
        case 40:
          this.selectedIndex++;
          if (this.selectedIndex === this.searchResults.length){
            this.selectedIndex = this.searchResults.length - 1;
          }
          this.selectedItem = this.searchResults[this.selectedIndex];
          break;
        case 38:
          this.selectedIndex--;
          if (this.selectedIndex === -1){
            this.selectedIndex = 0;
          }
          this.selectedItem = this.searchResults[this.selectedIndex];
          break;
        case 13:
          this.selectSearchItem(this.selectedItem);
          break;
      }
      const ulList = (this.searchList.nativeElement as HTMLUListElement);
      if (ulList.getElementsByClassName('focused').length) {
        if (typeof ulList.scrollTo === 'function'){
          ulList.scrollTo({top: this.selectedIndex * 42, left: 0, behavior: 'smooth'});
        }else{
          ulList.scrollTop = this.selectedIndex * 42;
        }
      }
    }
  }
  trackByFn(index: any, item: any): any{
    return item.organisationId;
  }
  trackField(): void{
    this.tracking.fieldInteraction(this.interactionName);
  }
}
