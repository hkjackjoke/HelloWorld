import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { ProgressModel } from 'src/app/core/models/progress.model';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';
import { TrackingService } from 'src/app/core/services/tracking.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  public state$: Observable<CoreState>;
  public show = false;
  public hasCart = false;
  public detailsComplete = false;
  public cartIn = false;
  public allowShowCart = false;
  public cartEnabled = false;
  public applicationComplete = false;
  public stepStates: ProgressModel[];
  public cartTotal = '';
  constructor(
      private store: Store<{core: CoreState}>,
      private validation: ValidationService,
      private tracking: TrackingService
    ) {
    this.state$ = this.store.pipe(select('core'));
  }
  ngOnInit(): void {
    this.state$.pipe(
      map(state => {
        this.show = state.started;
        this.hasCart = state.invoices.length > 0 && state.displayCart;
        this.cartIn = state.showCart;
        this.stepStates = state.stepStates;
        this.allowShowCart = state.invoices.length > 0 &&  this.stepStates[3].state !== 'current';
        this.applicationComplete = state.applicationComplete;
        this.cartTotal = state.cartTotal;
        this.cartEnabled = this.validation.validateYourDetails(state);
        this.detailsComplete = this.validation.validateYourDetails(state);
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
  }
  showCart(): void{
    if (this.cartEnabled){
      if (this.cartIn) {
        this.tracking.callToAction('Summary Hide');
        this.store.dispatch(CoreActions.hideCart());
      }else{
        this.tracking.callToAction('Summary Open');
        this.store.dispatch(CoreActions.showCart());
      }
    }
  }
}
