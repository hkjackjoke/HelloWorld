import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, mergeMap, retry, tap, timeout } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as CoreActions from '../actions/core.actions';
import { AjaxService } from '../services/ajax.service';
import { ApplicationResultModel } from '../models/application-result.model';
import { TrackingService } from '../services/tracking.service';
import { Router } from '@angular/router';


@Injectable()
export class CoreEffects{
    constructor(
        private ajaxService: AjaxService,
        private action$: Actions,
        private router: Router,
        private tracking: TrackingService
        ) {}
    showCart$ = createEffect(
        () => this.action$.pipe(
          ofType(CoreActions.showCart),
          tap(() => this.tracking.page('Claim summary', '/summary'))
        ),
        { dispatch: false }
    );
    successSubmitApplication$ = createEffect(
        () => this.action$.pipe(
          ofType(CoreActions.successSubmitApplication),
          tap(() => {
            this.router.navigate(['confirmation']);
          })
        ),
        { dispatch: false }
    );
    makeAnotherClaim$ = createEffect(
        () => this.action$.pipe(
          ofType(CoreActions.makeAnotherClaim),
          tap(() => {
            this.tracking.callToAction('Make another claim');
            this.tracking.funnelStart();
            this.router.navigate(['your-details']);
          })
        ),
        { dispatch: false }
    );
    initializeState$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(CoreActions.initializeState),
            mergeMap(action =>
                this.ajaxService.getVets().pipe(
                    map((data: any) => {
                        return CoreActions.getVetsSuccess({ vets: data });
                    }),
                    catchError((error: Error) => {
                        return of(CoreActions.errorAjaxAction(error));
                    })
                )
            )
        )
    );
    submitApplication$: Observable<Action> = createEffect(() =>
        this.action$.pipe(
            ofType(CoreActions.submitApplication),
            mergeMap(action =>
                this.ajaxService.submitApplication(action.body).pipe(
                    timeout(480000),
                    retry(0),
                    map((data: ApplicationResultModel) => {
                        if (data.Success){
                            return CoreActions.successSubmitApplication({ body: data });
                        }
                        return CoreActions.failSubmitApplication({ body: data });
                    }),
                    catchError((error: Error) => {
                        return of(CoreActions.errorAjaxAction(error));
                    })
                )
            )
        )
    );
}
