import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { Router } from '@angular/router';
import { ComponentService } from 'src/app/core/services/component.service';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';

@Component({
  selector: 'app-claim-confirmation',
  templateUrl: './claim-confirmation.component.html',
  styleUrls: ['./claim-confirmation.component.scss']
})
export class ClaimConfirmationComponent implements OnInit, OnDestroy {

  public state$: Observable<CoreState>;
  public stateSubscription: Subscription;
  public petName = '';
  public trackingSent = false;
  public freeCover = false;
  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private components: ComponentService,
    private tracking: TrackingService,
    private logging: LoggingService) {
    this.state$ = this.store.pipe(select('core'));
  }
  ngOnInit(): void {
    this.stateSubscription = this.state$.pipe(
      map(state => {
        this.freeCover = state.freeCover;
        this.petName = state.petName;
        if (!this.trackingSent){
          this.trackingSent = true;
        }
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.claimConfirmation());
    this.store.dispatch(CoreActions.setStepState({index: 3, value: 'complete'}));
    this.components.destroyLoading();
    this.tracking.page('Claim received');
    this.tracking.funnelComplete();
  }
  ngOnDestroy(): void{
    this.stateSubscription.unsubscribe();
  }
  returnToWebsite(): void{
    this.tracking.callToAction('Return to website');
    this.logging.logTrace('<Return To Website>');
  }
  makeAnotherClaim(): void{
    this.store.dispatch(CoreActions.makeAnotherClaim());
    this.logging.logTrace('<Make Another Claim>');
  }
}
