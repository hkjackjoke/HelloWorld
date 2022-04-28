import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import {QuoteModel } from "../../models/quote.model";
import { Router, NavigationEnd } from "@angular/router";
import { MessageService } from "src/app/services/message.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {

  public quote: QuoteModel;
  @Output() toggleMenu = new EventEmitter<boolean>();
  public windowWidth: any;
  public svgDepth: any;
  public svgValue: string;
  public hideBanner = false;
  public showMenu = false;
  public navHeight = "44px";
  public subscription: Subscription;

  public headerTitle = "Get your cat and dog insurance quote and apply today.";
  public headerSubtitle = "Apply in minutes";
  public headerButtonText = "";
  public noteText = "*First 1000 policies in December 2021. Free cover and renewals not included";

  constructor(private router: Router, private messageService: MessageService) {
    this.quote = QuoteModel.getInstance();
    this.subscription = this.messageService.getMessage().subscribe( message => {
      switch (message.id) {
        case MessageService.onSubmit:
        case MessageService.submitSuccess:
          this.setSubmitHeader();
          break;
      }
    });
    this.router.events.subscribe((event: NavigationEnd) => {
      if (event.url) {
        switch (event.url) {
          case "/apply/submit":
            this.setSubmitHeader();
            break;
          default:
            this.hideBanner = false;
            this.headerTitle = "Happy pet, happy life.";
            this.headerSubtitle = "Apply in minutes";
            this.headerButtonText = "";
            this.noteText = "*First 1000 policies in December 2021. Free cover and renewals not included";
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.setBannerSVG();
  }
  setSubmitHeader(): void {
    this.headerTitle = "Congratulations!";
    this.headerSubtitle = "Your application has been sent.";
    this.headerButtonText = "";
    this.noteText = "";
  }
  setBannerSVG(): void {
    this.svgDepth = 11 + Math.max((this.windowWidth - 375) / 825 * 6, 0);
    this.svgValue = "<svg width=\"100%\" height=\"100%\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">" +
    "<path d=\"M0 0 C " + (this.windowWidth / 4) + " " + this.svgDepth + "," +
    (this.windowWidth - this.windowWidth / 4) + " " + this.svgDepth + ", " +
    this.windowWidth + "  0 L " + this.windowWidth + " 30 L 0 30 L 0 0\" fill=\"#ffffff\"></path></svg>";
  }
  public toggleShowMenu(): void {
    this.showMenu = !this.showMenu;
    this.toggleMenu.emit(this.showMenu);
    this.setNavHeight();
  }
  public onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    this.setBannerSVG();
    this.setNavHeight();
  }
  public setNavHeight(): void {
    this.navHeight = this.showMenu && window.innerWidth < 990 ? Math.max(470, (window.innerHeight - 86)) + "px" : "44px";
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
