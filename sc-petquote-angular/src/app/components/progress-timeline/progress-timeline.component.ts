import { Component, Input, ViewChild, ElementRef } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { MessageService } from "src/app/services/message.service";
import { Subscription } from "rxjs";
import { ComponentService } from "src/app/services/component.service";
declare var TweenMax: any;
declare var Quart: any;
declare var $: any;


@Component({
  selector: "app-progress-timeline",
  templateUrl: "./progress-timeline.component.html",
  styleUrls: ["./progress-timeline.component.scss"]
})
export class ProgressTimelineComponent  {
  @ViewChild("progressTimeline", { static: true}) public progressTimeline: ElementRef;

  @Input() progress = 0;
  @Input() menuOpen = false;

  public hideProgress = false;
  public subscription: Subscription;


  constructor(private router: Router, private messageService: MessageService, private componentService: ComponentService) {
    this.router.events.subscribe((event: NavigationEnd) => {
      if (event.url) {
        switch (event.url) {
          case "/":
            this.progress = 0;
            break;
          case "/choose-a-plan":
            this.progress = 1;
            break;
          case "/quote-summary":
          case "/apply/about-you":
          case "/apply/some-more-pet-details":
          case "/apply/payment":
          case "/apply/summary":
            this.progress = 2;
            break;
          case "/apply/submit":
            this.hideProgress = true;
            break;
        }
      }
    });


    this.subscription = this.messageService.getMessage().subscribe( message => {
      let offset: number = this.getPosition(this.progressTimeline.nativeElement as HTMLDivElement).y;
      offset -= window.innerWidth > 768 ? 44 : 0;
      switch (message.id) {
        case MessageService.scrollToWindowTop:
          this.componentService.scrollTo(86);
          break;
        case MessageService.scrollToTimelineWithDuration:
          this.componentService.scrollTo(offset);
          break;
        case MessageService.scrollToTimeline:
          this.componentService.scrollTo(offset);
          break;
        case MessageService.creditCardFail:
          this.progress = 2;
          break;
        case MessageService.submitSuccess:
            this.hideProgress = true;
            break;
      }
    });
  }

  public getPosition(element: any): any {
    let xPosition: number = 0;
    let yPosition: number = 0;
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
  }
}
