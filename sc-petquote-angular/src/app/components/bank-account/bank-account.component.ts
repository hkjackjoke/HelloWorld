import { Component, ViewChild, ElementRef, AfterViewInit, forwardRef, Output, EventEmitter } from "@angular/core";
import { ValidateModel } from "src/app/models/validate.model";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { BankAccountModel } from "src/app/models/bank-account.model";

export function bankNumberControlValueAccessor(extendedInputComponent: any): any {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => extendedInputComponent),
    multi: true
  };
}

@Component({
  selector: "app-bank-account",
  templateUrl: "./bank-account.component.html",
  styleUrls: ["./bank-account.component.scss"],
  providers: [bankNumberControlValueAccessor(BankAccountComponent)]
})
export class BankAccountComponent implements AfterViewInit {

  public value: string;
  public bankValue = "";
  public branchValue = "";
  public accountValue = "";
  public suffixValue = "";
  public onChangeCallback: any;
  public error = false;
  public _onTouched = false;
  public errorCatch: any;
  public errorMessage = "This doesn't look right. Please check.";
  @ViewChild("bank", { static: true }) bank: ElementRef;
  @ViewChild("branch", { static: true }) branch: ElementRef;
  @ViewChild("account", { static: true }) account: ElementRef;
  @ViewChild("suffix", { static: true }) suffix: ElementRef;
  @Output() valueChanged = new EventEmitter<any>();
  @Output() inputChanged = new EventEmitter<any>();
  @Output() trackError = new EventEmitter<any>();

  private onChange(): void {
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(
        (this.bank.nativeElement as HTMLInputElement).value + "-" +
        (this.branch.nativeElement as HTMLInputElement).value + "-" +
        (this.account.nativeElement as HTMLInputElement).value + "-" +
        (this.suffix.nativeElement as HTMLInputElement).value
      );
    }
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
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  onPaste(event: any): void {
    const clipboardData: any = event.clipboardData || (window as any).clipboardData;
    (this.bank.nativeElement as HTMLInputElement).focus();
    try {
      this.populateInputs(clipboardData.getData("Text") as string);
    } catch (e: any) {
        this.errorCatch = e;
    }
  }

  onInput(event: any, id: number): void {
    let remove: boolean = false;
    if (event.keyCode === 46 || event.keyCode === 8) {
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
        if (this.branchValue.trim() === "" && remove) {
          (this.bank.nativeElement as HTMLInputElement).focus();
        }
        break;
      case 3:
        if (this.accountValue.length === 7) {
          (this.suffix.nativeElement as HTMLInputElement).focus();
        }
        if (this.accountValue.trim() === "" && remove) {
          (this.branch.nativeElement as HTMLInputElement).focus();
        }
        break;
      case 4:
        if (this.suffixValue.trim() === "" && remove) {
          (this.account.nativeElement as HTMLInputElement).focus();
        }
        break;
      case 5:
        this.validateInput();
        break;
    }
    setTimeout(() => {
      this.inputChanged.emit();
    }, 1);
  }
  validateInput(): boolean {
    this.error = false;
    // eslint-disable-next-line max-len
    if (!ValidateModel.validateBankAccount(new BankAccountModel(this.bankValue, this.branchValue, this.accountValue, this.suffixValue))) {
      this.error = true;
      this.trackError.emit(this.errorMessage);
    }
    return !this.error;
  }
  populateInputs(data: string, validate: boolean = true): void {
    data = data.replace(/-| /gi, (x) => {
      return "";
    });
    this.bankValue = (this.bank.nativeElement as HTMLInputElement).value = data.substr(0, 2);
    this.branchValue = (this.branch.nativeElement as HTMLInputElement).value = data.substr(2, 4);
    this.accountValue = (this.account.nativeElement as HTMLInputElement).value = data.substr(6, 7);
    this.suffixValue = (this.suffix.nativeElement as HTMLInputElement).value = data.substr(13, 3);

    setTimeout(() => {
      if (validate) {
        this.validateInput();
      }
      this.inputChanged.emit();
    }, 1);
  }
}
