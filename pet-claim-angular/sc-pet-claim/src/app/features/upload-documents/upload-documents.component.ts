import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { UploadModel , populatedUpload, uploadType} from 'src/app/core/models/upload.model';
import { Router } from '@angular/router';
import { InvoiceModel, populatedInvoice } from 'src/app/core/models/invoice.model';
import { ComponentService } from 'src/app/core/services/component.service';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit, OnDestroy {

  public state$: Observable<CoreState>;
  public stateSubscription: Subscription;
  public invoiceUploads: Array<UploadModel>;
  public invoices: Array<InvoiceModel>;
  public historyUploads: Array<UploadModel>;
  public complete = false;
  public maxUploadSize = 2;
  public uploadTotal = 8;
  public funnelStepValue: string;
  public enabledHistoryUpload = false;
  public showInvoiceError = false;
  public showMaxInvoiceError = false;
  public showHistoryError = false;
  public showMaxHistoryError = false;
  public eftposReceiptsCopy = 'To process your claim, we need to be able to clearly see all the details on each invoice or receipt. You can remove the EFTPOS receipt where the receipt / invoice already includes proof of payment.';
  public uploadHistoryCopy = 'Don’t worry if you don’t have a copy of your history records but it may take a bit longer to process your claim.';
  public uploadFileTypeInvoice: uploadType = uploadType.Invoice;
  public uploadFileTypeHistory: uploadType = uploadType.History;

  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private componentService: ComponentService,
    private tracking: TrackingService,
    private logging: LoggingService) {
    this.state$ = this.store.pipe(select('core'));
  }

  ngOnInit(): void {
    this.stateSubscription = this.state$.pipe(
      map(state => {
          this.invoiceUploads = state.invoiceUploads;
          this.invoices = state.invoices;
          this.historyUploads = state.historyUploads;
          this.maxUploadSize = state.maxUploadSize;
          this.uploadTotal = state.uploadTotal;
          this.funnelStepValue = state.funnelStepValue;
          this.showMaxInvoiceError =   this.invoiceUploads.length === this.uploadTotal + 1;
          this.showMaxHistoryError =   this.historyUploads.length === this.uploadTotal + 1;
          this.complete = state.invoiceUploads.length > 0;
          this.enabledHistoryUpload = state.enableHistoryUpload;
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.claimStarted({claimStarted: true}));
    this.store.dispatch(CoreActions.setStepState({index: 1, value: 'complete'}));
    this.store.dispatch(CoreActions.setStepState({index: 2, value: 'current'}));
    this.store.dispatch(CoreActions.hideCart());
    this.tracking.page('Upload your documents');
  }
  ngOnDestroy(): void{
    this.stateSubscription.unsubscribe();
  }
  fileSelectError(): void{
    const popup = this.componentService.popup('file-select-error',
    'Uh-oh',
    'The file you uploaded doesn’t contain any information. If you uploaded the file from Google Drive, please try downloading it to your device first, then upload again.');
    popup.clickButtonOne.subscribe((value: any) => {
      this.componentService.destroyPopup();
    });
  }
  invoiceFileSelect(upload: UploadModel): void{
    if (this.invoiceUploads.length < this.uploadTotal + 1){
      this.showInvoiceError = false;
      this.store.dispatch(CoreActions.addUploadInvoice({upload : populatedUpload(upload.id, upload.file)}));
    }
    this.logging.logTrace('<Invoice Add> ' + upload.file.name);
  }
  invoiceFileRemove(index: number): void{
    this.store.dispatch(CoreActions.removeUploadInvoice({index}));
    this.logging.logTrace('<Invoice Remove> ' + index);
  }
  historyFileSelect(upload: UploadModel): void{
    if (this.historyUploads.length < this.uploadTotal + 1){
      this.showHistoryError = false;
      this.store.dispatch(CoreActions.addUploadHistory({upload : populatedUpload(upload.id, upload.file)}));
    }
    this.logging.logTrace('<History Add> ' + upload.file.name);
  }
  historyFileRemove(index: number): void{
    this.store.dispatch(CoreActions.removeUploadHistory({index}));
    this.logging.logTrace('<History Remove> ' + index);
  }
  trackByFn(index: any, item: any): any{
    return item.id;
  }
  trackHByFn(index: any, item: any): any{
    return item.id;
  }
  next(): void{
    if (this.historyUploads.length === 0){
      const popup = this.componentService.popup('no-history-records', 'Forgotten something?', '');
      popup.clickButtonOne.subscribe((value: any) => {
        this.componentService.destroyPopup();
        return;
      });
      popup.clickButtonTwo.subscribe((value: any) => {
        this.componentService.destroyPopup();
        this.proceedNext();
      });
    }
    else{
      this.proceedNext();
    }
  }
  proceedNext(): void{
    this.tracking.callToAction('Upload your documents > Next step');
    if ((this.invoiceUploads.length) < this.invoices.length){
      const popup = this.componentService.popup('add-another-invoice', 'Invoice missing?', 'The number of invoice details you have added doesn\'t match the number of invoices attached. Are you sure you\'ve attached everything?');
      popup.clickButtonOne.subscribe((value: any) => {
        this.tracking.callToAction('Upload your documents > Invoice missing popup > Add another attachment');
        this.componentService.destroyPopup();
      });
      popup.clickButtonTwo.subscribe((value: any) => {
        this.tracking.callToAction('Upload your documents > Invoice missing popup > Next step');
        this.componentService.destroyPopup();
        this.store.dispatch(CoreActions.setStepState({index: 2, value: 'complete'}));
        this.router.navigate(['review-claim']);
        this.tracking.funnelStep(this.funnelStepValue);
      });
    } else {
      this.store.dispatch(CoreActions.setStepState({index: 2, value: 'complete'}));
      this.router.navigate(['review-claim']);
      this.tracking.funnelStep(this.funnelStepValue);
    }
    this.logging.logTrace('<Upload Next> ' + this.logging.getLogInfo('', '', '', '', '', '',
      this.invoices, this.invoiceUploads, this.historyUploads));
  }

  back(): void{
    this.tracking.callToAction('Upload your documents > Back');
    if (this.complete) {
      this.store.dispatch(CoreActions.setStepState({index: 2, value: 'complete'}));
    }
    this.router.navigate(['claim-details']);

    this.logging.logTrace('<Upload Back> ' + this.logging.getLogInfo('', '', '', '', '', '',
      this.invoices, this.invoiceUploads, this.historyUploads));
  }
  closeError(type: number): void{
    switch (type){
      case 1:
        this.showMaxInvoiceError = false;
        break;
      case 2:
        this.showMaxHistoryError = false;
        break;
      case 3:
        this.showInvoiceError = false;
        break;
      case 4:
        this.showHistoryError = false;
        break;
    }
  }
  showError(type: number): void{
    switch (type){
      case 1:
        this.showMaxInvoiceError = true;
        break;
      case 2:
        this.showMaxHistoryError = true;
        break;
      case 3:
        this.showInvoiceError = true;
        break;
      case 4:
        this.showHistoryError = true;
        break;
    }
  }
}
