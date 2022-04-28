import { Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import { InvoiceModel } from 'src/app/core/models/invoice.model';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { ValidationService } from 'src/app/core/services/validation.service';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, AfterViewInit {

  public state$: Observable<CoreState>;
  public invoices: Array<InvoiceModel>;
  public firstLook = true;
  public show = false;
  public hideBg = false;
  public tranIn = false;
  public scrollFixed = false;
  public complete = false;
  public cartEnabled = false;
  public displayCart = true;
  public started = false;
  public freeCover = false;
  public freeCoverTotalOver = false;
  public petName = '';
  public invoiceTotalTipCopy = 'You\'ve reached the maximum number of invoice details you can add for this claim. If you have more items to claim for, please complete and submit this claim and then start a new claim.';
  public totalItems = 0;
  public invoiceTotal = 8;
  public cartTotalValue = 8;
  public cartTotal = '';
  public toggleText = 'Show claims';
  @ViewChild('shoppingCart', {static: false}) shoppingCart: ElementRef;
  @ViewChild('mobileCheck', {static: false}) mobileCheck: ElementRef;
  @ViewChild('invoicesList', {static: false}) invoicesList: ElementRef;
  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private validation: ValidationService,
    private tracking: TrackingService,
    private logging: LoggingService) {
    this.state$ = this.store.pipe(select('core'));
  }
  ngOnInit(): void {
    this.state$.pipe(
      map(state => {
        this.freeCover = state.freeCover;
        this.invoices = state.invoices;
        this.totalItems = this.invoices.length;
        this.complete = this.totalItems > 0 && this.validation.validateYourDetails(state);
        this.started = state.started && this.totalItems > 0;
        this.invoiceTotal = state.invoiceTotal;
        this.displayCart = state.displayCart;
        if (state.showCart && !this.show){
          this.showCart();
        }
        if (!state.showCart && this.show){
          this.hideCart();
        }
        this.cartEnabled = this.validation.validateYourDetails(state);
        if (!this.validation.isEmptyString(state.petName)){
          this.petName = state.petName;
        } else {
          this.petName = '&nbsp;';
        }
        this.cartTotal = state.cartTotal;
        this.cartTotalValue = state.cartTotalValue;
        if (this.freeCover && this.cartTotalValue > 2000){
          this.freeCoverTotalOver = true;
        } else {
          this.freeCoverTotalOver = false;
        }
        if (this.totalItems === 0 && this.show){
          this.hideCart();
          setTimeout(() => {
            this.store.dispatch(CoreActions.hideCart());
          }, 600);
          if (this.isMobileView()){
            this.router.navigate(['claim-details']);
          }
        }
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();

  }
  ngAfterViewInit(): void{
    setTimeout(() => {
      this.onResize(null);
    }, 50);

  }
  showCart(): void{
    this.show = true;
    this.toggleText = 'Hide Claims';
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    document.body.classList.add('show-cart');

    setTimeout(() => {
      this.tranIn = true;
      this.cartShowResize();
      if (this.firstLook){
        setTimeout(() => {
          this.firstLook = false;
        }, 20);
      }
    }, 20);
  }
  hideCart(): void{
    this.toggleText = 'Show Claims';
    this.tranIn = false;
    this.hideBg = true;
    document.body.classList.remove('show-cart');
    if (this.isMobileView()){
      this.show = false;
      this.cartHideResize();
      this.hideBg = false ;
    } else {
      setTimeout(() => {
        this.show = false;
        this.cartHideResize();
        this.hideBg = false ;
      }, 500);
    }
  }
  trackElement(index: any, item: any): any{
    return item.id;
  }
  next(): void{
    if (this.complete){
      this.tracking.callToAction('Claim Summary > Next step');
      this.store.dispatch(CoreActions.hideCart());
      this.store.dispatch(CoreActions.editInvoiceComplete());
      this.router.navigate(['upload-documents']);
    }
    this.logging.logTrace('<Upload Document>');
  }
  addAnother(): void{
    if (this.invoices.length < this.invoiceTotal){
      this.tracking.callToAction('Claim Summary > Add more');
      this.store.dispatch(CoreActions.hideCart());
      this.store.dispatch(CoreActions.addAnotherInvoice());
      this.router.navigate(['claim-details']);
    }

    this.logging.logTrace('<Add Another Invoice>');
  }
  close(): void{
    this.store.dispatch(CoreActions.hideCart());
  }
  showHideCart(): void{
    if (this.cartEnabled){
      this.show ? this.store.dispatch(CoreActions.hideCart()) :  this.store.dispatch(CoreActions.showCart());
    }
  }
  viewInvoice(index: number): void{
    this.router.navigate(['claim-details']);
    this.store.dispatch(CoreActions.hideCart());
    this.store.dispatch(CoreActions.editInvoice({index}));
  }
  removeInvoice(index: number): void{
    this.store.dispatch(CoreActions.removeInvoice({index}));
    this.store.dispatch(CoreActions.setCartTotal());
  }
  invoiceAdded(index: number): void{
    this.store.dispatch(CoreActions.invoiceAdded({index}));
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (this.isMobileView()){
      if (window.scrollY >= 130){
        if (!this.scrollFixed){
          this.scrollFixed = true;
        }
      }else if (this.scrollFixed){
        this.scrollFixed = false;
      }
    }
  }
  cartHideResize(): void{
    (this.shoppingCart.nativeElement as HTMLElement).style.height = this.isMobileView() ? '85px' : '0px';
    (this.shoppingCart.nativeElement as HTMLElement).style.minHeight = '0px';
  }
  cartShowResize(): void{
    const neededHeight = (this.invoicesList.nativeElement as HTMLElement).clientHeight + 550;

    const startHeight = this.isMobileView() ? Math.max(neededHeight, window.innerHeight - 20) : document.body.scrollHeight - 100;
    (this.shoppingCart.nativeElement as HTMLElement).style.height = 'auto';
    (this.shoppingCart.nativeElement as HTMLElement).style.minHeight = (startHeight - 130)  + 'px';
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (!this.show){
      this.cartHideResize();
    }else{
      this.cartShowResize();
    }
  }
  isMobileView(): boolean{
    return window.getComputedStyle((this.mobileCheck.nativeElement as HTMLElement)).display !== 'none';
  }
}
