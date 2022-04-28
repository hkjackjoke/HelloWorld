import { Component, OnInit , Input, Output,  EventEmitter, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-pet-question-typeahead",
  templateUrl: "./pet-question-typeahead.component.html",
  styleUrls: ["./pet-question-typeahead.component.scss"]
})
export class PetQuestionTypeaheadComponent implements OnInit {

  @Input() items: Array<any>;
  public popularOptions: Array<any>;
  @Input() popularOptionId: Array<any> = [];
  @Input() value: any;
  @Input() tab = 0;
  @Input() inputId = null;

  @Input() selectClass: string;
  @Output() selectChange = new EventEmitter<any>();

  @ViewChild("field", {static: true}) field: ElementRef;
  @ViewChild("searchinput", {static: true}) searchinput: ElementRef;
  @ViewChild("searchInputWidth", {static: true}) searchInputWidth: ElementRef;

  public open = false;
  public selectOpen = false;
  public showOptionTitle = true;
  public selectedIndex = -1;
  public testText = "";

  @Input() result: Array<any>;
  public showInput = false;
  ngOnInit(): void {
    this.value = {label: "", id: -1};
  }
  close(event: any): void {
    if (event.target.className === "typeahead-input" || event.target.className === "typeahead-search-img") {
      return;
    }
    this.open = this.selectOpen = false;
    this.validate();
    (this.searchinput.nativeElement as HTMLInputElement).blur();
  }
  toggleOpen(event: any): void {
    this.open = !this.open;
    if (this.open) {
      this.tabIn(true) ;
    } else {
      this.selectOpen = false;
    }
    event.stopPropagation();
  }
  tabIn(focus: boolean = false): void {
    this.open = true;
    this.selectOpen = true;
    if ((this.searchinput.nativeElement as HTMLInputElement).value === "") {
      this.result = this.items;
      this.showOptionTitle = this.popularOptionId.length > 0;
      if (this.showOptionTitle) {
        this.popularOptions = [];
        this.popularOptionId.forEach((id: any, i: number) => {
          this.items.forEach((value: any, index: number) => {
            if (id === value.Code) {
              this.popularOptions.push(value);
            }
          });
         });
      }
    }
    if (focus) {
      setTimeout(() => {
        (this.searchinput.nativeElement as HTMLInputElement).focus();
      }, 1);
    }
  }
  tabOut(): void {
    setTimeout(() => {
      this.open = this.selectOpen = false;
    }, 300);
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
  setValue(event: any, data: any): void {
    if (event) {
      event.stopPropagation();
    }
    this.value = data;
    (this.searchinput.nativeElement as HTMLInputElement).value = this.value.label;
    this.validate();
    (this.searchinput.nativeElement as HTMLInputElement).value = this.value.label;
    this.selectChange.emit(data);
    this.setInputWidth();
    this.open = this.selectOpen = false;
  }

  search(): void  {
    const result: Array<any> = [];
    const searchValue: string = (this.searchinput.nativeElement as HTMLInputElement).value;
    const searchLength: number = searchValue.length;
    if (this.items !== undefined && searchLength) {
      this.showOptionTitle = false;
      this.popularOptions = [];
      this.items.forEach((value: any, index: number) => {
        const breed: any = value;
        const regex: RegExp = new RegExp( searchValue, "gi" );
        const res: boolean = regex.test(breed.label);
        if (res) {
          result.push(breed);
        }
      });

    } else {
      this.selectChange.emit({id: -1, label: "", Code: ""});
    }
    this.result = result;
    if (!this.result.length) {
      this.result = this.items;
      this.selectOpen = false;
      this.showOptionTitle = true;
    } else {
      this.selectOpen = true;
    }

  }
  validate(): boolean {
    let found: boolean = false;
    if (this.items !== undefined) {
      this.items.forEach((value: any, index: number) => {
        if (value.label === (this.searchinput.nativeElement as HTMLInputElement).value) {
          found = value;
        }
      });
    }
    if (!found) {
      this.value = {label: "", id: -1};
    }
    return found;
  }
  public setInputWidth(): void {
    this.searchinput.nativeElement.style.width = (this.searchInputWidth.nativeElement.offsetWidth + 10) + "px";
  }
}
