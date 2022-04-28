import { Component, ChangeDetectorRef, Output, EventEmitter } from "@angular/core";
import { TrackingService } from "src/app/services/tracking.service";

@Component({
  selector: "app-green-banner",
  templateUrl: "./green-banner.component.html",
  styleUrls: ["./green-banner.component.scss"]
})
export class GreenBannerComponent {

  @Output() eventOut = new EventEmitter<string>();
  public currentSlide = "0";
  public close = "";

  constructor(private cdr: ChangeDetectorRef, private tracking: TrackingService) { }

  showDiscountModal(): void {
    this.eventOut.emit("discount-modal");
    this.tracking.discountBannerClick();
  }
  setCurrentSlide(value: string): void  {
    this.currentSlide = value;
    this.close = value === "" ? "close" : "";
    if (value === "0") {
      this.tracking.discountBanner();
    }
    this.cdr.detectChanges();
  }
  closeAttentionBar(): void  {
    this.currentSlide = "";
    this.close = "close";
  }
}
