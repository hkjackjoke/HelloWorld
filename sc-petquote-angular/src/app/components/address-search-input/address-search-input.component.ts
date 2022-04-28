import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, HostListener } from "@angular/core";
import { AjaxService } from "src/app/services/ajax.service";
import { inputFieldsetControlValueAccessor } from "../text-input/text-input.component";
import { ControlValueAccessor } from "@angular/forms";
import { AddressSearchResponse } from "src/app/models/address.search.response";
import { AddressSearchResponseAddress } from "src/app/models/address.search.reponse.address";
import { AddressModel } from "src/app/models/address.model";
import { AddressSelectResponse } from "src/app/models/address.selected.response";
import { Subscription } from "rxjs";

@Component({
  selector: "app-address-search-input",
  templateUrl: "./address-search-input.component.html",
  styleUrls: ["./address-search-input.component.scss"],
  providers: [
    inputFieldsetControlValueAccessor(AddressSearchInputComponent)
  ]
})
export class AddressSearchInputComponent {
  @Input() label = "";
  @Input() placeholder = "";
  @Input() clearbutton = false;
  @Input() value = new AddressModel();
  @Input() showManualFields = false;
  @Input() inputId = null;
  @Input() tab = 0;
  @Input() error = false;
  @Input() errorMessage = "";
  @Input() help: string;
  @Output() inputChange = new EventEmitter<any>();
  @Output() inputFocusout = new EventEmitter<any>();
  @Output() inputFocusin = new EventEmitter<any>();
  @Output() manualInputFocusin = new EventEmitter<any>();
  @Output() trackError = new EventEmitter<any>();
  public selectedIndex = -1;

  @ViewChild("inputTextElement") public inputTextElement: ElementRef;

  private onChangeCallback: any;
  public searchingAddress = false;
  public hasSearchResults = false;
  public noSearchResults = false;
  public searchError = false;

  public hasSelectedAddress = false;
  public responseAddresses: Array<AddressSearchResponseAddress>;


  public timeoutId: any;
  public searchSubscription: Subscription;
  public searchValue = "";

  public errorAddress = false;
  public errorSuburb = false;
  public errorCity = false;
  public errorPostcode = false;
  public _onTouched = false;

  constructor(private ajaxService: AjaxService) { }

  @HostListener("mousedown", ["$event"])
  onLocalMouseDown(event: any): void {
    event.stopPropagation();
  }
  @HostListener("window:mousedown", ["$event"])
  onWindowMouseDown(event: any): void {
    this.hasSearchResults = false;
    this.noSearchResults = false;
    this.searchError = false;
  }
  public selectedAddress(resonse: AddressSearchResponseAddress): void {
    this.value.partialAddress = resonse.partialAddress;
    this.hasSearchResults = false;
    this.noSearchResults = false;
    this.ajaxService.addressSelect(resonse).subscribe((repsonse: AddressSelectResponse) => {
      this.value.street = repsonse.line1;
      this.value.suburb = repsonse.suburb === "" ? repsonse.line2 : repsonse.suburb;
      this.value.city = repsonse.city;
      this.value.postCode = repsonse.postCode;
      this.inputChange.emit(this.value);
      this.hasSelectedAddress = true;
      this.validate();
    },
      (err: any) => {
        this.noSearchResults = true;
      });
  }
  public writeValue(value: any): void {
    if (value !== this.value && value !== null) {
      this.value = value;
    }
  }
  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  public validateManual(field: string = ""): void {
    this.validateField(field);
    this.inputChange.emit(this.value);
  }
  public validateField(field: string): void {
    switch (field) {
      case "street":
        this.errorAddress = this.value.street.trim() === "";
        break;
      case "suburb":
        this.errorSuburb = this.value.suburb.trim() === "";
        break;
      case "city":
        this.errorCity = this.value.city.trim() === "";
        break;
      case "postcode":
        this.errorPostcode = this.value.postCode.trim() === "";
        break;
    }
  }
  public validateManualFields(): boolean {
    let valid: boolean = true;
    if (this.value.street.trim() === "") {
      valid = false;
    }
    if (this.value.suburb.trim() === "") {
      valid = false;
    }
    if (this.value.postCode.trim() === "") {
      valid = false;
    }
    if (this.value.city.trim() === "") {
      valid = false;
    }
    if (this.value.country.trim() === "") {
      valid = false;
    }
    return valid;
  }
  public isValid(): boolean {
    if (this.showManualFields) {
      return this.validateManualFields();
    }
    return this.value.isValid(this.noSearchResults === false);
  }
  public validate(): void {
    this.error = !this.value.isValid();
    if (this.error) {
      this.trackError.emit(this.errorMessage);
    }
  }
  public input(): void {
    if (this.onChangeCallback !== undefined) {
      this.onChangeCallback(this.value);
    }
    const value: string = (this.inputTextElement.nativeElement as HTMLInputElement).value;
    if (this.searchingAddress && this.searchSubscription !== undefined) {
      this.searchSubscription.unsubscribe();
      this.searchingAddress = false;
    }
    if (value.length > 6 && !this.searchingAddress) {
      this.searchingAddress = true;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.searchSubscription = this.ajaxService.addressSearch(value.trim()).subscribe((repsonse: AddressSearchResponse) => {
          this.searchingAddress = false;
          this.hasSearchResults = true;
          if (repsonse.totalResults) {
            this.noSearchResults = false;
            this.responseAddresses = repsonse.addresses;
            this.checkAddressReturned(value);
          } else {
            this.responseAddresses = new Array<AddressSearchResponseAddress>();
            this.noSearchResults = true;
          }
        },
          (err: any) => {
            this.searchingAddress = false;
            this.responseAddresses = new Array<AddressSearchResponseAddress>();
            this.noSearchResults = true;
            this.searchError = true;
          });
      }, 100);
    } else {
      if (value.trim() === "" && this.hasSelectedAddress) {
        this.value.street = "";
        this.value.suburb = "";
        this.value.city = "";
        this.value.postCode = "";
        this.inputChange.emit(this.value);
        this.validate();
      }
    }
  }
  public checkAddressReturned(value: string): void {
    let found: boolean = false;
    const regex: RegExp = new RegExp(value.toLowerCase(), "gi");
    this.responseAddresses.forEach((item: AddressSearchResponseAddress, index: number) => {
      if (regex.test(item.labelAddress.toLowerCase())) {
        found = true;
      }
    });
    this.noSearchResults = !found;
  }
  public enterManually(): void {
    this.showManualFields = true;
    this.hasSearchResults = false;
    this.noSearchResults = false;
    this.searchError = false;
    this.value.partialAddress = "";
    this.blur();
  }

  public focusout(): void {
    this.inputFocusout.emit(this.value);
    this.validate();
  }
  public focusin(): void {
    this.inputFocusin.emit(this.value);
    this.showManualFields = false;
  }
  public manualFocus(field: string): void {
    this.manualInputFocusin.emit(field);
  }
  public clearfield(): void {
    this.value.reset();
    this.noSearchResults = false;
    this.hasSearchResults = false;
    this.searchError = false;
    this.onChangeCallback(this.value);
    this.inputChange.emit(this.value);
  }
  public clearCountry(): void {
    this.value.country = "";
  }
  public focusOn(): void {
    (this.inputTextElement.nativeElement as HTMLInputElement).focus();
  }
  public blur(): void {
    (this.inputTextElement.nativeElement as HTMLInputElement).blur();
  }

  public keydown(e: any): void {
    switch (e.keyCode) {
      case 40:
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
          if (this.selectedIndex === this.responseAddresses.length) {
            this.selectedIndex = this.responseAddresses.length - 1;
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
          this.selectedAddress(this.responseAddresses[this.selectedIndex]);
        }
        break;
    }
  }
}
