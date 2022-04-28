import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoPaste]'
})
export class NoPasteDirective {

  private navigationKeys = [
    'Paste'
  ];
  constructor(public el: ElementRef) {

  }
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): any {
    if (this.navigationKeys.indexOf(e.key) > -1 || (e.key === 'v' && e.ctrlKey === true)) {
      e.preventDefault();
    }
  }
}
