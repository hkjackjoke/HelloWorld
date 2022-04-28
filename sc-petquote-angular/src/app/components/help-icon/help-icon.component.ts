import { Component, OnInit, Input, ElementRef, ViewChild, HostListener } from "@angular/core";
import { CopyModel } from "src/app/models/copy.model";
import { ComponentService } from "src/app/services/component.service";
import { ToolTipComponent } from "../tool-tip/tool-tip.component";


@Component({
  selector: "app-help-icon",
  templateUrl: "./help-icon.component.html",
  styleUrls: ["./help-icon.component.scss"]
})
export class HelpIconComponent implements OnInit {
  @ViewChild("helpIcon", {static: true}) helpIcon: ElementRef;

  @Input() public helpId: string;
  @Input() public offsetY = 5;
  public show = false;
  public onState = false;
  public icon = "/Content/images/pet-quote/icon-help.svg";
  public copy: string;
  public copyModel = CopyModel;


  public toolTip: ToolTipComponent;

  constructor(private el: ElementRef, private componentService: ComponentService) { }

  ngOnInit(): void {
    this.setCopy();
  }
  public setCopy(): void {
    this.copy = this.helpId === undefined ? "" : this.copyModel.helpCopy[this.helpId];
  }
  public toggleShow(event: any): void {
    event.stopPropagation();
    this.show = !this.show;
    this.onState = this.show;
    this.setIcon();
    if (this.show) {
      this.copy = this.helpId === undefined ? "" : this.copyModel.helpCopy[this.helpId];
      this.expandToolTip();
    } else {
      this.show = false;
      this.componentService.destroyToolTip(this.helpId);
    }
  }
  public expandToolTip(): void  {
    this.toolTip =  this.componentService.toolTip(this.copy, this.helpId);
    this.toolTip.helpIcon = this;
    this.toolTip.isReady.subscribe(() => {
       this.position();
    });
    this.toolTip.closeToolTip.subscribe(() => {
      this.show = false;
      this.componentService.destroyToolTip(this.helpId);
    });
    this.toolTip.popup.subscribe((helpId: string) => {
      if (helpId === "co-payment") {
        this.componentService.coPaymentModal();
      }
    });
  }
  public position(): void {
    if (this.show) {
      const tipRect: any = (this.toolTip.element.nativeElement as HTMLInputElement).getBoundingClientRect();
      const offset: any = this.componentService.offset(this.helpIcon.nativeElement);
      this.toolTip.top = offset.offsetTop  - tipRect.height - this.offsetY;
      this.toolTip.left = Math.min(Math.max(10, window.innerWidth - 355), Math.max(10, offset.offsetLeft - 155));
      this.toolTip.arrowLeft = offset.offsetLeft - this.toolTip.left;
    }
  }
  @HostListener("window:resize", ["$event"])
  public onResize(event: any): void {
    this.position();
  }
  @HostListener("window:mousedown", ["$event"])
  onWindowMouseDown(event: any): void {
    if (this.show) {
      this.show = false;
      this.toolTip.close();
    }
  }
  @HostListener("mousedown", ["$event"])
  onLocalMouseDown(event: any): void {
    event.stopPropagation();
  }
  public setIcon(): void {
    this.icon = "/Content/images/pet-quote/" + ( this.onState ? "icon-help-hover-state.svg" : "icon-help.svg");
  }
}
