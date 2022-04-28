import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyOnly]'
})
export class CurrencyOnlyDirective {

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
  constructor(public el: ElementRef) {

  }
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): any {
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
      return;
    }
    if (e.key === '.'){
      return;
    }
    if (isNaN(Number(e.key)) || e.key === ' ') {
      e.preventDefault();
    }
  }
}
