import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ComponentService } from 'src/app/services/component.service';
import { HelpIconComponent } from '../help-icon/help-icon.component';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss']
})
export class ToolTipComponent implements OnInit {

  @ViewChild('tooltip', {static: true}) tooltip: ElementRef;
  @ViewChild('arrow', {static: true}) arrow: ElementRef;
  @Output() isReady = new EventEmitter<any>();
  @Output() closeToolTip = new EventEmitter<any>();
  @Output() popup = new EventEmitter<any>();
  @Input() public helpId: string;
  @Input() public copy: string;
  @Input() public top = 0;
  @Input() public left = 0;
  @Input() public arrowLeft = 0;
  public element: ElementRef;
  public show = false;
  public helpIcon: HelpIconComponent;

  constructor() {}
  ngOnInit() {
    setTimeout(() => {
      this.show = true;
      this.element = this.tooltip;
      this.isReady.emit();
    }, 50);

  }
  @HostListener('mousedown', ['$event'])
  onLocalMouseDown(event: any) {
    event.stopPropagation();
  }
  showPopup() {
    this.popup.emit(this.helpId);
  }
  close() {
    this.closeToolTip.emit();
  }
}
