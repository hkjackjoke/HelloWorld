import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLettersNumbers]'
})
export class LettersNumbersDirective {
  private regex: RegExp = new RegExp(/^[a-zA-Z0-9\_\- ]*$/);
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];
  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (
      this.navigationKeys.indexOf(e.key) > -1 ||
      (e.key === 'a' && e.ctrlKey === true) ||
      (e.key === 'c' && e.ctrlKey === true) ||
      (e.key === 'v' && e.ctrlKey === true) ||
      (e.key === 'x' && e.ctrlKey === true) ||
      (e.key === 'a' && e.metaKey === true) ||
      (e.key === 'c' && e.metaKey === true) ||
      (e.key === 'v' && e.metaKey === true) ||
      (e.key === 'x' && e.metaKey === true)
    ) {

    } else{
      if (!String(e.key).match(this.regex)) {
        e.preventDefault();
      }
    }
  }
}
