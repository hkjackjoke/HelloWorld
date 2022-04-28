import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: 'app-discount-modal',
  templateUrl: './discount-modal.component.html',
  styleUrls: ['./discount-modal.component.scss']
})
export class DiscountModalComponent implements OnInit {

  @Output() eventOut = new EventEmitter<string>();
  public index = 0;
  constructor(private tracking: TrackingService) { }

  ngOnInit() {
    this.tracking.discountOverlay();
  }
  back() {
    this.index--;
    if (this.index === -1) {
      this.index = 3;
    }
  }
  next() {
    this.index++;
    if (this.index === 4) {
      this.index = 0;
    }
  }
  setIndex(value: number) {
    this.index = value;
  }
  close() {
    this.eventOut.emit('close-discount-modal');
    this.tracking.discountOverlayGetQuote();
  }
}
