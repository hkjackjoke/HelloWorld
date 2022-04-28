import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { InvoiceModel } from 'src/app/core/models/invoice.model';
import { Router } from '@angular/router';
import { UploadModel } from 'src/app/core/models/upload.model';
import { formFromState } from 'src/app/core/models/form.model';
import { ComponentService } from 'src/app/core/services/component.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { RecaptchaComponent, RecaptchaLoaderService  } from 'ng-recaptcha';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';


@Component({
  selector: 'app-review-claim',
  templateUrl: './review-claim.component.html',
  styleUrls: ['./review-claim.component.scss']
})
export class ReviewClaimComponent implements OnInit, OnDestroy, AfterViewInit {

  public state$: Observable<CoreState>;
  public stateSubscription: Subscription;
  private subscription: Subscription;
  public state: CoreState;
  public petName = '';

  public invoices: Array<InvoiceModel>;
  public invoiceUploads: Array<UploadModel>;
  public historyUploads: Array<UploadModel>;
  public totalAmount = '';
  public bankAccount = '';
  public recaptchaKey = '';
  public bankAccountCopy = 'This is the bank account where you want this claim to be paid. These bank details will be updated in our files for future claims payments but will not change the bank account where your premiums are paid from if you pay by direct debit. If you have checked the box to confirm these details belong to your vet, this does not guarantee we will pay your vet directly. We’ll contact you to discuss this further if required.';
  public vetBankAccount = false;
  public vetAccountName = '';
  public agreeDeclaration = false;
  public addMoreDocs = true;
  public noDocsSelected = false;
  public submitted = false;
  public complete = false;
  public freeCover = false;
  public uploadTotal = 8;
  public invoiceTotal = 8;
  public allUploads: Array<UploadModel>;
  public agreeCopy = 'I have <strong>read and agree</strong> to the above declaration';

  @ViewChild('captchaRef', {static: false}) captchaRef: RecaptchaComponent;

  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private components: ComponentService,
    private validation: ValidationService,
    private tracking: TrackingService,
    private logging: LoggingService
    ) {
    this.state$ = this.store.pipe(select('core'));
  }

  ngOnInit(): void {
    this.stateSubscription = this.state$.pipe(
      map(state => {
        this.freeCover = state.freeCover;
        this.petName = state.petName;
        this.invoices = state.invoices;
        this.uploadTotal = state.uploadTotal;
        this.invoiceTotal = state.invoiceTotal;
        this.invoiceUploads = state.invoiceUploads;
        this.historyUploads = state.historyUploads;
        if (state.enableHistoryUpload){
          this.addMoreDocs = this.historyUploads.length < this.uploadTotal || this.invoiceUploads.length < this.uploadTotal;
        } else {
          this.addMoreDocs = this.invoiceUploads.length < this.uploadTotal;
        }
        this.noDocsSelected = this.historyUploads.length === 0 && this.invoiceUploads.length === 0;
        this.totalAmount = state.cartTotal;
        this.allUploads = state.invoiceUploads;
        if (state.enableHistoryUpload){
          this.allUploads = this.allUploads.concat(state.historyUploads);
        }
        this.bankAccount = state.bankAccount;
        this.vetBankAccount = state.vetBankAccount;
        this.agreeDeclaration = state.agreeDeclaration;
        const uploadsValid = state.invoiceUploads.length > 0;

        this.complete = state.applicationValid
          && uploadsValid
          && this.validation.validateYourDetails(state)
          && this.validation.validateBankAccount(this.bankAccount.split('-').join(''));

        this.state = state;
        if (state.applicationSubmitFail){
          this.submitError(state.ajaxError);
        }
        if (state.hasAjaxError){
          this.submitError(state.ajaxError);
        }
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.claimStarted({claimStarted: true}));
    this.store.dispatch(CoreActions.setStepState({index: 3, value: 'current'}));
    this.store.dispatch(CoreActions.validateAll());
    this.store.dispatch(CoreActions.displayCart({displayCart: false}));
    this.tracking.page('Review your claim');
    this.subscription = this.components.recaptchav2$.subscribe((token) => {
      this.submit(token);
    });
  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void{
    this.stateSubscription.unsubscribe();
    this.subscription.unsubscribe();
    this.store.dispatch(CoreActions.displayCart({displayCart: true}));

  }
  submitError(error: any): void{
    this.components.destroyLoading();
    const popup = this.components.popup('ajax-error', 'Submit Error', 'There was an error submitting your application. Please try again.');
    console.log(error);
    this.logging.logTrace(JSON.stringify(error));
    popup.clickButtonOne.subscribe((value: any) => {
      this.components.destroyPopup();
    });
    this.store.dispatch(CoreActions.errorAjaxActionClear());
  }
  trackByFn(index: any, item: any): any{
    return item.id;
  }
  updateState(value: any): void{
    this.store.dispatch(CoreActions.setDeclaration(
      {
        bankAccount: this.bankAccount,
        vetBankAccount: this.vetBankAccount,
        vetAccountName: this.vetAccountName,
        agreeDeclaration: this.agreeDeclaration
      }
    ));
    this.store.dispatch(CoreActions.validateAll());
  }
  viewInvoice(index: number): void{
    this.tracking.callToAction('Review your claim > View invoice');
    this.store.dispatch(CoreActions.editInvoice({index}));
    this.router.navigate(['claim-details']);

    this.logging.logTrace('<View Invoice> ' + index);
  }
  callToAction(label: string): void{
    this.tracking.callToAction('Review your claim > ' + label);
    this.logging.logTrace('<Review Claim> ' + label);
  }
  deleteInvoice(index: number): void{
    this.tracking.callToAction('Review your claim > Delete invoice');
    const popupId =  this.invoices.length === 1 ? 'delete-last-invoice' : 'delete-invoice';
    const popupTitle =  this.invoices.length === 1 ? 'Are you sure?' : 'Remove Invoice';
    const popupCopy =  this.invoices.length === 1
      ? 'Deleting these invoice details will also remove all uploaded documents and reset the form. Do you wish to proceed?'
      : 'Are you sure you want to remove this invoice?';
    const popup = this.components.popup(popupId, popupTitle, popupCopy);
    popup.clickButtonOne.subscribe((value: any) => {
      this.tracking.callToAction('Review your claim > Delete invoice popup > Cancel');
      this.components.destroyPopup();
    });
    popup.clickButtonTwo.subscribe((value: any) => {
      this.tracking.callToAction('Review your claim > Delete invoice popup > OK, got it');
      this.removeInvoice(index);
      this.components.destroyPopup();
      if (this.invoices.length === 0){
        this.router.navigate(['your-details']);
      }
      this.logging.logTrace('<Delete Invoice> ' + index);
    });
  }
  removeInvoice(index: number): void{
    this.store.dispatch(CoreActions.removeInvoice({index}));
    this.store.dispatch(CoreActions.setCartTotal());
    this.store.dispatch(CoreActions.validateAll());
  }
  addMore(label: string): void{
    if (this.invoices.length <  this.invoiceTotal){
      this.tracking.callToAction(label);
      this.router.navigate(['claim-details']);
    }
    this.logging.logTrace('<Add More Invoice> ');
  }
  fileRemove(index: number, type: string): void{
    this.tracking.callToAction('Review your claim > Renove ' + (type === 'invoice' ? 'invoice' : 'history') + ' upload');
    type === 'invoice' ?
    this.store.dispatch(CoreActions.removeUploadInvoice({index})) :
    this.store.dispatch(CoreActions.removeUploadHistory({index}));

    this.logging.logTrace('<Review File Remove> ' + type + ' ' + index);
  }
  submit(event: any): void{
    if (!this.submitted){
      this.tracking.callToAction('Review your claim > Submit claim');
      this.components.loadingNotification('Submitting Application');
      this.store.dispatch(CoreActions.submitApplication({body: formFromState(this.state, event)}));
      this.submitted = true;
      grecaptcha.reset();
    }
  }
  next(): void{
    grecaptcha.execute();

    this.logging.logTrace('<Review Next> ' +
      this.logging.getLogInfo('', '', '', '', '', '', this.invoices, this.invoiceUploads, this.historyUploads));
  }
  back(): void{
    this.tracking.callToAction('Review your claim > Back');
    this.router.navigate(['upload-documents']);

    this.logging.logTrace('<Review Back> ' +
      this.logging.getLogInfo('', '', '', '', '', '', this.invoices, this.invoiceUploads, this.historyUploads));
  }
}
