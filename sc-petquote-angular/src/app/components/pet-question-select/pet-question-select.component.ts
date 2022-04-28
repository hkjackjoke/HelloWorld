import { Component, OnInit , Input, Output,  EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-pet-question-select',
  templateUrl: './pet-question-select.component.html',
  styleUrls: ['./pet-question-select.component.scss']
})
export class PetQuestionSelectComponent implements OnInit {

  constructor() { }
  @Input() items: Array<any>;
  @Input() value: any;
  @Input() tab = 0;
  @Input() inputId = null;
  @Input() quietLabel = null;
  @Input() singularise = false;

  @Input() selectClass: string;
  @Output() selectChange = new EventEmitter<any>();

  @ViewChild('field', {static: true}) field: ElementRef;
  public open = false;
  public selectedIndex = -1;
  ngOnInit() {
    this.value = {label: '&nbsp;', id: -1};
  }
  close(): void {
    this.open = false;
  }
  focusQuestion(): void {
    (this.field.nativeElement as HTMLInputElement).focus();
  }
  toggleOpen(event: any): void {
    this.open = !this.open;
    if (this.open) {
      (this.field.nativeElement as HTMLInputElement).focus();
    }
    event.stopPropagation();
  }
  tabIn(): void {
    this.open = true;
  }
  tabOut(): void {
    const scope = this;
    setTimeout(() => {
      scope.open = false;
    }, 300);
  }
  inputKeyDown(e: any): void {
    switch (e.keyCode) {
      case 40:
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
          if (this.selectedIndex === this.items.length) {
            this.selectedIndex = this.items.length - 1;
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
          this.setValue(e, this.items[this.selectedIndex]);
          this.close();
        }
        break;
    }
  }
  setValue(event: any, data: any): void {
    event.stopPropagation();
    this.value = data;
    this.selectChange.emit(data);

  }
  makeSingular(text: string) {
    return text.substring(0, text.length - 1);
  }
}
