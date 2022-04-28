import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { inputFieldsetControlValueAccessor } from '../../value.accessors';
import bankValidator from 'nz-bank-account-validator/lib/NZ-Bank-Account-Validator';
import { TrackingService } from 'src/app/core/services/tracking.service';


@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
  providers: [inputFieldsetControlValueAccessor(BankAccountComponent)]
})
export class BankAccountComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  public value: string;
  public bankValue = '';
  public branchValue = '';
  public accountValue = '';
  public suffixValue = '';
  public onChangeCallback: any;
  public error = false;
  public complete = false;
  public errorMessage = 'This doesn\'t look right. Please check.';
  @Input() tabindexValue = 0;
  @Input() interactionName = '';
  @ViewChild('bank', {static: true}) bank: ElementRef;
  @ViewChild('branch', {static: true}) branch: ElementRef;
  @ViewChild('account', {static: true}) account: ElementRef;
  @ViewChild('suffix', {static: true}) suffix: ElementRef;
  @Output() valueChanged = new EventEmitter<any>();
  @Output() inputChange = new EventEmitter<any>();
  @Output() trackError = new EventEmitter<any>();
  constructor(private tracking: TrackingService) { }

  ngOnInit(): void {

  }
  private onChange(): void {
    if (this.onChangeCallback !== undefined) {
      this.callCallBack();
    }
  }
  private callCallBack(): void{
    this.onChangeCallback(
      (this.bank.nativeElement as HTMLInputElement).value + '-' +
      (this.branch.nativeElement as HTMLInputElement).value + '-' +
      (this.account.nativeElement as HTMLInputElement).value + '-' +
      (this.suffix.nativeElement as HTMLInputElement).value
    );
  }
  ngAfterViewInit(): void {
    this.setEvents(this.bank.nativeElement as HTMLInputElement);
    this.setEvents(this.branch.nativeElement as HTMLInputElement);
    this.setEvents(this.account.nativeElement as HTMLInputElement);
    this.setEvents(this.suffix.nativeElement as HTMLInputElement);
  }
  setEvents(input: HTMLInputElement): void {
    input.oninput = () => this.onChange();
    input.onchange = () => this.onChange();
    input.onkeyup = () => this.onChange();
  }
  writeValue(value: any): void {
    if (value !== this.value) {
        this.value = value;
        if (value != null) {
          this.populateInputs(value, false);
        }
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(): void { }

  onPaste(event: any): void {
    const  clipboardData = event.clipboardData || (window as any).clipboardData;
    (this.bank.nativeElement as HTMLInputElement).focus();
    try {
      this.writeValue(clipboardData.getData('Text') as string);
      (this.suffix.nativeElement as HTMLInputElement).focus();
      this.complete = true;
      this.tracking.fieldInteraction(this.interactionName);
    } catch (e) {

    }
  }
  clear(): void{
    this.bankValue = '';
    this.branchValue = '';
    this.accountValue = '';
    this.suffixValue = '';
    this.complete = false;
    this.value = '';
    this.onChangeCallback(this.value);
    this.inputChange.emit(this.value);
  }
  onInput(event: any, id: number): void {
    let remove = false;
    if (event.keyCode === 46 || event.keyCode === 8){
      remove = true;
    }
    switch (id) {
      case 1:
        if (this.bankValue.length === 2) {
          (this.branch.nativeElement as HTMLInputElement).focus();
        }
        break;
      case 2:
        if (this.branchValue.length === 4) {
          (this.account.nativeElement as HTMLInputElement).focus();
        }
        if (this.branchValue.trim() === '' && remove){
          (this.bank.nativeElement as HTMLInputElement).focus();
        }
        break;
      case 3:
        if (this.accountValue.length === 7) {
          (this.suffix.nativeElement as HTMLInputElement).focus();
        }
        if (this.accountValue.trim() === '' && remove){
          (this.branch.nativeElement as HTMLInputElement).focus();
        }
        break;
      case 4:
        if (this.suffixValue.trim() === '' && remove){
          (this.account.nativeElement as HTMLInputElement).focus();
        }
        this.complete = true;
        this.tracking.fieldInteraction(this.interactionName);
        break;
      case 5:
        this.validateInput();
        break;
    }
    this.inputChange.emit(this.value);
  }
  validateInput(): boolean {
    this.error = false;
    if (this.bankValue.length !== 2 && this.branchValue.length !== 4 && this.accountValue.length !== 7 && this.suffixValue.length < 2) {
      this.error = true;
    } else if (!bankValidator.validate(this.bankValue + '-' + this.branchValue + '-' + this.accountValue + '-' + this.suffixValue)) {
      this.error = true;
    }
    this.complete = !this.error;
    return !this.error;
  }
  populateInputs(data: string, validate: boolean = true): void {
    data = data.replace(/-| /gi, (x) => {
      return '';
    });
    this.bankValue = (this.bank.nativeElement as HTMLInputElement).value = data.substr(0, 2);
    this.branchValue = (this.branch.nativeElement as HTMLInputElement).value = data.substr(2, 4);
    this.accountValue = (this.account.nativeElement as HTMLInputElement).value = data.substr(6, 7);
    this.suffixValue = (this.suffix.nativeElement as HTMLInputElement).value = data.substr(13, 3);
    setTimeout(() => {
      if (validate) {
        this.validateInput();
      }
      this.inputChange.emit(this.value);
    }, );
  }
}
