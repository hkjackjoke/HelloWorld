import { Component, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-accessable-select',
  templateUrl: './accessable-select.component.html',
  styleUrls: ['./accessable-select.component.scss']
})
export class AccessableSelectComponent {
  @Input() items: Array<any>;
  @Input() value: any;
  @Input() inputId = null;
  @Input() label = null;
  @Input() selectClass = null;

  @Output() selectChange = new EventEmitter<any>();
  @ViewChildren('listItem') listItems: QueryList<HTMLElement>;

  SPACEBAR_KEY_CODE: number[] = [0, 32];
  ENTER_KEY_CODE = 13;
  DOWN_ARROW_KEY_CODE = 40;
  UP_ARROW_KEY_CODE = 38;
  ESCAPE_KEY_CODE = 27;

  public isOpen = false;
  public selectedIndex = -1;

  setValue(event: any, data: any): void {
    event.stopPropagation();
    this.value = data;
    this.selectChange.emit(data);
  }
  close(): void {
    this.isOpen = false;
  }
  open(): void {
    this.isOpen = true;
  }
  toggleListVisibility(e: any): void {
    const openDropDown = (this.SPACEBAR_KEY_CODE.indexOf(e.keyCode) !== -1) || e.keyCode === this.ENTER_KEY_CODE;
    if (e.keyCode === this.ESCAPE_KEY_CODE) {
      this.close();
    }
    if (e.type === 'click' || openDropDown) {
      this.open();
    }
    if (e.keyCode === this.DOWN_ARROW_KEY_CODE) {
      this.focusNextListItem(this.DOWN_ARROW_KEY_CODE);
    }
    if (e.keyCode === this.UP_ARROW_KEY_CODE) {
      this.focusNextListItem(this.UP_ARROW_KEY_CODE);
    }
  }
  focusNextListItem(direction: number) {
    if (this.selectedIndex === -1) {
      this.selectedIndex++;
    } else {
      if (direction === this.DOWN_ARROW_KEY_CODE) {
        if ((this.selectedIndex + 1) !== this.items.length) {
          this.selectedIndex++;
        }
      } else if (direction === this.UP_ARROW_KEY_CODE) {
        if (this.selectedIndex > 0) {
          this.selectedIndex--;
        }
      }
    }
    this.listItems.forEach((item: HTMLElement, index: number) => {
      if (index === this.selectedIndex) {
        item.focus();
      }
    });
  }
  listItemKeyEvent(e: any): void {
    switch (e.keyCode) {
      case this.ENTER_KEY_CODE:
        this.setValue(e, this.items[this.selectedIndex]);
        this.close();
        return;

      case this.DOWN_ARROW_KEY_CODE:
        this.focusNextListItem(this.DOWN_ARROW_KEY_CODE);
        return;

      case this.UP_ARROW_KEY_CODE:
        this.focusNextListItem(this.UP_ARROW_KEY_CODE);
        return;

      case this.ESCAPE_KEY_CODE:
        this.close();
        return;

      default:
        return;
    }
  }
}
