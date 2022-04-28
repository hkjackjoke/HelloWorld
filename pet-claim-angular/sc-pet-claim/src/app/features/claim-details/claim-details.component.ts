import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { Router } from '@angular/router';
import { OrganisationModel } from 'src/app/core/models/organisation.model';
import { InvoiceModel } from 'src/app/core/models/invoice.model';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { ComponentService } from 'src/app/core/services/component.service';

@Component({
  selector: 'app-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  public state$: Observable<CoreState>;
  public stateSubscription: Subscription;
  public complete = false;
  public treatmentDate = new Date();
  public maxDate = new Date();
  public vetSpecialist = '';
  public claimAmount: string;
  public selectedInvoiceIndex: number;
  public selectedInvoiceId: number;
  public editInvoice = false;
  public addAnotherInvoice = false;
  public allowShowClaims = false;
  public showErrorMessage = false;
  public firstLoad = false;
  public invoiceTotal = 8;
  public nextLabel = 'Next step';
  public claimAmountCopy = 'Enter the total amount you want to claim for this invoice. We’ll assess your claim and advise what you’re covered for under your policy.';
  public claimAmountCopyFree = 'Enter the total amount you want to claim for this invoice. We’ll assess your claim and advise what you’re covered for.';
  public invoiceTip = 'Whether you have one invoice or multiple invoices to claim for, you can do it all in one claim as long as it\'s for the same pet. Please enter the details for your first invoice and then select ‘next step’. You\'ll then have the option to add another invoice (up to a maximum of 8) or finish your claim. To assess your claim, we use the invoice along with any history records (if requested) so we don\'t need you to add any specific treatment details.';
  public providerTip = 'Enter the name of your vet clinic, specialist, retailer or other treatment provider. If you\'re not sure, the name should be on your invoice or receipt.';
  public searchItems: OrganisationModel[];
  public searchItemsSet = false;
  public showFreeCoverMax = false;
  public showFreeCoverMin = false;
  public freeCover = false;
  public funnelStepValue: string;
  public invoices: Array<InvoiceModel>;
  public petName ='';
  @ViewChild('vetSpecialistInput', {static: false}) vetSpecialistInput: TextInputComponent;
  @ViewChild('mobileCheck', {static: false}) mobileCheck: ElementRef;
  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private tracking: TrackingService,
    private logging: LoggingService,
    private components: ComponentService
    ) {
    this.state$ = this.store.pipe(select('core'));
    this.tracking.page('Claim details');
  }

  ngOnInit(): void {
    this.stateSubscription = this.state$.pipe(
      map(state => {
        this.invoiceTotal = state.invoiceTotal;
        this.invoices = state.invoices;
        this.funnelStepValue = state.funnelStepValue;
        this.freeCover = state.freeCover;
        this.petName = state.petName;
        this.invoiceTip = 'Whether you have one invoice or multiple invoices to claim for, you can do it all in one claim as long as it\'s for the same pet. Please enter the details for your first invoice and then select ‘next step’. You\'ll then have the option to add another invoice (up to a maximum of ' + state.invoiceTotal + ') or finish your claim. To assess your claim, we use the invoice along with any history records (if requested) so we don\'t need you to add any specific treatment details.';
        if (state.invoiceIndex !== -1){
          this.selectedInvoiceIndex = state.invoiceIndex;
          this.editInvoice = true;
          const invoice = state.invoices[this.selectedInvoiceIndex];
          this.selectedInvoiceId = invoice.id;
          this.treatmentDate = invoice.treatmentDate;
          this.vetSpecialist = invoice.vetSpecialist;
          this.claimAmount = invoice.claimAmount;
          this.nextLabel = 'Save changes';
          this.complete = true;
        } else {
          this.editInvoice = false;
          this.nextLabel = 'Next step';
        }
        this.addAnotherInvoice = state.addAnotherInvoice;
        if (this.addAnotherInvoice || state.deleteInvoice){
          this.reset();
        }
        if (state.deleteInvoice){
          this.store.dispatch(CoreActions.onRemoveInvoice());
        }
        this.allowShowClaims = state.invoices.length > 1;
        if (!this.searchItemsSet){
          this.searchItemsSet = true;
          this.searchItems = state.vets;
        }
        if (this.invoices.length === state.invoiceTotal){
          this.showErrorMessage = true;
        }else {
          this.showErrorMessage = false;
        }
        if (this.showErrorMessage){
          if (this.invoices.length < state.invoiceTotal){
            this.showErrorMessage = false;
          }
        }
        if (state.cartTotalValue > 2000 && state.freeCover && !this.showFreeCoverMax){
            this.freeCoverMax();
            this.showFreeCoverMax = true;
        }
        if (state.cartTotalValue < 100 && state.cartTotalValue > 0 && state.freeCover && !this.showFreeCoverMin){
          this.freeCoverMin();
          this.showFreeCoverMin = true;
        }
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.claimStarted({claimStarted: true}));
    this.store.dispatch(CoreActions.setStepState({index: 1, value: 'current'}));
  }
  ngOnDestroy(): void{
    this.stateSubscription.unsubscribe();
  }
  ngAfterViewInit(): void{
    if (this.invoices !== undefined){
      if (this.invoices.length && !this.editInvoice && !this.addAnotherInvoice && !this.isMobileView()){
        this.store.dispatch(CoreActions.showCart());
      }
    }
  }
  freeCoverMax(): void{
    const popup = this.components.popup('free-cover-max', 'Maximum reached', '');
    popup.clickButtonOne.subscribe((value: any) => {
      this.components.destroyPopup();
    });
  }
  freeCoverMin(): void{
    const popup = this.components.popup('free-cover-min', 'Excess applies', '');
    popup.clickButtonOne.subscribe((value: any) => {
      this.components.destroyPopup();
    });
  }
  validate(value: any): void{
    this.complete = true;
    if (this.vetSpecialist.trim() === ''){
      this.complete = false;
    }
    if (/[^\d\.]/.test(this.claimAmount) || Number(this.claimAmount) === 0 || isNaN(Number(this.claimAmount))) {
      this.complete = false;
    }
  }
  focusNext(): void{
    this.vetSpecialistInput.focusIn();
  }
  showClaims(): void{
    this.store.dispatch(CoreActions.showCart());
  }
  reset(): void{
    this.treatmentDate = new Date();
    this.vetSpecialist = '';
    this.claimAmount = '';
    this.complete = false;
  }
  next(): void{
    this.tracking.callToAction('Enter your invoice details > Next step');
    this.showFreeCoverMax = false;
    if (this.editInvoice){

      this.tracking.funnelStep(this.funnelStepValue);
      this.store.dispatch(CoreActions.updateInvoice(
        {
          index: this.selectedInvoiceIndex,
          invoice: {
            id:  this.selectedInvoiceId,
            treatmentDate: this.treatmentDate,
            vetSpecialist: this.vetSpecialist,
            claimAmount: this.claimAmount,
            hasBeenAdded: false,
            hasBeenSaved: true,
          }
         }
      ));
      this.editInvoice = false;
    } else {
      if (this.invoices.length < this.invoiceTotal){
        this.tracking.funnelStep(this.funnelStepValue);
        this.store.dispatch(CoreActions.addInvoice(
          {
            treatmentDate: this.treatmentDate,
            vetSpecialist: this.vetSpecialist,
            claimAmount: this.claimAmount,
            hasBeenAdded: false,
            hasBeenSaved: false
           }
        ));
      } else {
        this.showErrorMessage = true;
      }
    }
    this.store.dispatch(CoreActions.setCartTotal());
    this.store.dispatch(CoreActions.showCart());
    this.reset();

    this.logging.logTrace('<Invoice Next | Save Changes> ' + this.logging.getLogInfo('', '', '', '', '', '', this.invoices));
  }
  back(): void {
    this.tracking.callToAction('Enter your invoice details > Back');
    if (this.editInvoice){
      this.editInvoice = false;
      this.store.dispatch(CoreActions.editInvoiceComplete());
    }
    if (this.allowShowClaims) {
      this.store.dispatch(CoreActions.setStepState({index: 1, value: 'complete'}));
    }
    this.router.navigate(['your-details']);

    this.logging.logTrace('<Invoice Back> ' + this.logging.getLogInfo('', '', '', '', '', '', this.invoices));
  }
  isMobileView(): boolean{
    return window.getComputedStyle((this.mobileCheck.nativeElement as HTMLElement)).display !== 'none';
  }
}
