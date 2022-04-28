import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { Router } from '@angular/router';
import { ComponentService } from 'src/app/core/services/component.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public state$: Observable<CoreState>;
  public stateSubscription: Subscription;
  public claimFormUrl = 'https://www.southerncross.co.nz/society/-/media/Southern-Cross-Pet-Insurance/PDF/Forms/Pet-insurance-claim-form.pdf';
  public freeCoverClaimFormUrl = 'https://www.southerncross.co.nz/society/-/media/Southern-Cross-Pet-Insurance/PDF/Forms/Free-Cover-Claims-Form.pdf';
  public invoiceTotal = 8;
  constructor(
    private store: Store<{core: CoreState}>,
    private tracking: TrackingService,
    private logging: LoggingService,
    private router: Router, 
    private components: ComponentService
    ) {
    this.state$ = this.store.pipe(select('core'));
  }

  ngOnInit(): void {
    this.stateSubscription = this.state$.pipe(
      map(state => {
        this.invoiceTotal = state.invoiceTotal;
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.claimStarted({claimStarted: false}));
  }
  start(free = false): void{
    TrackingService.coverType = free ? 'Free cover' : 'Full cover';
    this.tracking.funnelStart();
    this.store.dispatch(CoreActions.setCoverType({value: free}));
    this.router.navigate(['your-details']);

    this.logging.logTrace('<Jorney Seleted> ' + TrackingService.coverType);
  }
  freeCoverInfo(): void{
    const popup = this.components.popup('free-cover-important', 'Important things to know', '');
    popup.clickButtonOne.subscribe((value: any) => {
      this.components.destroyPopup();
    });
  }
  callToAction(value: string): void{
    this.tracking.callToAction(value);
  }
  ngOnDestroy(): void{
    this.stateSubscription.unsubscribe();
  }
}
