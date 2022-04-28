import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appBaseOnly]'
})
export class BaseDirective {

  public navigationKeys = [
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

  public keyCodeDigitValues = {
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
  };
  public keyCodeEmailValues = {
    50: '@',
    53: '%',
    107: '-',
    109: '+',
    189: '_',
    190: '.',
  };
  public keyCodeAlphaValues = {
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z'
  };

  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }


  // @HostListener('paste', ['$event'])
  // onPaste(event: ClipboardEvent) {
  //   event.preventDefault();
  //   const pastedInput: string = event.clipboardData
  //     .getData('text/plain')
  //     .replace(/\D/g, '');
  //   document.execCommand('insertText', false, pastedInput);
  // }
  @HostListener('paste', ['$event'])
  onPaste($event) {
    $event.preventDefault();
    let clipboardData;
    if ((window as any).clipboardData) { // IE
       clipboardData = (window as any).clipboardData;
    } else {
       clipboardData = $event.clipboardData;
    }
    const pastedInput: string = clipboardData.getData('text/plain').replace(/\D/g, '');
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text').replace(/\D/g, '');
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }

}
