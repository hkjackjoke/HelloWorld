import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from 'src/app/core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';

@Component({
  selector: 'app-summary-header',
  templateUrl: './summary-header.component.html',
  styleUrls: ['./summary-header.component.scss']
})
export class SummaryHeaderComponent implements OnInit {
  @Input() headerClass = '';
  public state$: Observable<CoreState>;
  public totalItems = 0;
  public petName = '';
  constructor(private store: Store<{core: CoreState}>) {
    this.state$ = this.store.pipe(select('core'));
  }

  ngOnInit(): void {
    this.state$.pipe(
      map(state => {
        this.petName = state.petName;
        this.totalItems = state.invoices.length;
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
  }
  showCart(): void{
    this.store.dispatch(CoreActions.showCart());
  }
}
