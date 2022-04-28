import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import { TrackingService } from 'src/app/core/services/tracking.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {


  @Output() toggleMenu = new EventEmitter<boolean>();
  public windowWidth: any;
  public svgDepth: any;
  public svgValue: string;
  public hideBanner = false;
  public showMenu = false;
  public navHeight = '44px';
  public subscription: Subscription;

  public headerTitle = 'Make a pet insurance claim';
  public headerSubtitle = 'It\'s as easy as 1, 2, 3.';
  public headerButtonText = '';
  public state$: Observable<CoreState>;

  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private tracking: TrackingService) {
    this.state$ = this.store.pipe(select('core'));
  }

  ngOnInit(): void {
    this.state$.pipe(
      map(state => {
        this.hideBanner = state.started;
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.windowWidth = window.innerWidth;
    this.setBannerSVG();
  }
  makeClaim(): void{
    this.tracking.callToAction('Claim home header > Make a claim');
    this.router.navigate(['your-details']);
  }
  setSubmitHeader(): void{
    this.headerTitle = 'Congratulations!';
    this.headerSubtitle = 'Your application has been sent.';
    this.headerButtonText = '';
  }
  bannerResize(event: any): void {

  }
  setBannerSVG(): void {
    this.svgDepth = 11 + Math.max((this.windowWidth - 375) / 825 * 6, 0);
    this.svgValue = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
    '<path d="M0 0 C ' + (this.windowWidth / 4) + ' ' + this.svgDepth + ',' +
    (this.windowWidth - this.windowWidth / 4) + ' ' + this.svgDepth + ', ' +
    this.windowWidth + '  0 L ' + this.windowWidth + ' 30 L 0 30 L 0 0" fill="#ffffff"></path></svg>';
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
    this.navHeight = this.showMenu && window.innerWidth < 990 ? Math.max(470, (window.innerHeight - 86)) + 'px' : '44px';
  }
  ngOnDestroy(): void {

  }
}
