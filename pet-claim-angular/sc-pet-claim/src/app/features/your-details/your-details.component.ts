import { Component, OnInit, OnDestroy} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { LoggingService } from 'src/app/core/services/logging.service';
import { ComponentService } from 'src/app/core/services/component.service';

@Component({
  selector: 'app-your-details',
  templateUrl: './your-details.component.html',
  styleUrls: ['./your-details.component.scss']
})
export class YourDetailsComponent implements OnInit, OnDestroy{

  public state$: Observable<CoreState>;
  public stateSubscription: Subscription;
  public complete = false;
  public freeCover = false;
  public firstName: string;
  public lastName: string;
  public petName: string;
  public policyNumber: string;
  public email: string;
  public contactNumber: string;
  public funnelStepValue: string;
  public dayToDayTreatment: boolean;
  public accidentIllnessTreatment: boolean;

  public petNameCopy = 'You can only claim for one pet at a time. If you need to claim for another pet, complete and submit this claim form then start a new claim.';
  public policyNumberCopy = 'You can find your policy number in your welcome pack which we sent to you when you took out this policy, or your renewal pack if you\'ve received an annual renewal.';
  public freeCoverNumberCopy = 'You can find your Free Cover number in the confirmation email we sent to you when you took up this offer.';

  constructor(
    private store: Store<{core: CoreState}>,
    private router: Router,
    private validation: ValidationService,
    private tracking: TrackingService,
    private logging: LoggingService) {
    this.state$ = this.store.pipe(select('core'));
  }

  ngOnInit(): void {

    this.stateSubscription = this.state$.pipe(
      map(state => {
        this.freeCover = state.freeCover;
        this.firstName = state.firstName;
        this.lastName = state.lastName;
        this.petName = state.petName;
        this.policyNumber = state.policyNumber;
        this.email = state.email;
        this.contactNumber = state.contactNumber;
        this.dayToDayTreatment = state.dayToDayTreatment;
        this.accidentIllnessTreatment = state.accidentIllnessTreatment;
        this.funnelStepValue = state.funnelStepValue;
        this.complete = this.validation.validateYourDetails(state);
        this.validate(null);
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.claimStarted({claimStarted: true}));
    this.store.dispatch(CoreActions.setStepState({index: 0, value: 'current'}));
    this.store.dispatch(CoreActions.hideCart());
    this.tracking.page('Confirm your details');
  }
  ngOnDestroy(): void{
    this.stateSubscription.unsubscribe();
  }
  validate(value: any): void{

  }
  updateState(value: any): void{
    this.store.dispatch(CoreActions.setYourDetails(
      {
        firstName: this.firstName,
        lastName: this.lastName,
        petName: this.petName,
        policyNumber: this.policyNumber,
        email: this.email,
        contactNumber: this.contactNumber,
        dayToDayTreatment: this.dayToDayTreatment,
        accidentIllnessTreatment: this.accidentIllnessTreatment
      }
    ));
  }
  next(): void{
    this.store.dispatch(CoreActions.setStepState({index: 0, value: 'complete'}));
    this.router.navigate(['claim-details']);
    this.tracking.callToAction('Confirm your details > Next');
    this.tracking.funnelStep(this.funnelStepValue);

    this.logging.logTrace('<Detail Next> ' + this.logging.getLogInfo(this.firstName, this.lastName, this.petName,
      this.policyNumber, this.email, this.contactNumber));
  }
  back(): void{
    this.tracking.callToAction('Confirm your details > Back');
    this.router.navigate(['']);

    this.logging.logTrace('<Detail Back> ' + this.logging.getLogInfo(this.firstName, this.lastName, this.petName,
      this.policyNumber, this.email, this.contactNumber));
    console.log(' Cache test v4 ');
  }
}
