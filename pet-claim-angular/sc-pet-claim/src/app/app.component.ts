import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CoreState from './core/core.state';
import * as CoreActions from 'src/app/core/actions/core.actions';
import { ComponentService } from './core/services/component.service';
import { TrackingService } from './core/services/tracking.service';
import { LoggingService } from './core/services/logging.service';
import { ValidationService } from './core/services/validation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public state$: Observable<CoreState>;
  public recaptchaKey = '';
  public enableRecaptcha = false;

  public timerId: any;
  public currentUrl: string;
  public timeOutTime = 900000;
  public maxUploadSize = 2;
  public uploadTotal = 8;
  public invoiceTotal = 8;
  public urlParams: URLSearchParams;
  constructor(
    private store: Store<{core: CoreState}>,
    private componentService: ComponentService,
    private vaildation: ValidationService,
    private router: Router,
    private elementRef: ElementRef,
    private tracking: TrackingService,
    private logging: LoggingService
    ) {
      this.state$ = this.store.pipe(select('core'));
      this.recaptchaKey = this.elementRef.nativeElement.getAttribute('recpatchaKey');
      this.enableRecaptcha = this.elementRef.nativeElement.getAttribute('enableReCaptcha') === '1';
      this.maxUploadSize = Number(this.elementRef.nativeElement.getAttribute('uploadSize'));
      this.uploadTotal = Number(this.elementRef.nativeElement.getAttribute('uploadTotal'));
      this.invoiceTotal = Number(this.elementRef.nativeElement.getAttribute('invoiceTotal'));
      this.tracking.page('Make a pet insurance claim');
  }
  ngOnInit(): void {
    // this.populate();
    this.state$.pipe(
      map(state => {
      })
    // tslint:disable-next-line: deprecation
    ).subscribe();
    this.store.dispatch(CoreActions.initializeState({
      recatchaKey : this.recaptchaKey,
      maxUploadSize : this.maxUploadSize,
      uploadTotal: this.uploadTotal,
      invoiceTotal: this.invoiceTotal
    }));
    if (this.vaildation.urlParam('timeout')) {
      const popup = this.componentService.popup('time-out', 'Timed out.', 'Your session has timed out after 15 minutes of inactivity.');
      popup.clickButtonOne.subscribe((value: any) => {
        this.componentService.destroyPopup();
      });
    }else {
      this.setTimer();
    }
    this.router.navigate(['']);
  }
  populate(): void{
    // Per populated data for development purposes.
    this.store.dispatch(CoreActions.setCoverType({value: true}));
    this.store.dispatch(CoreActions.setYourDetails(
      {
        firstName: 'Fracture',
        lastName: 'Fracture',
        petName: 'Fracture',
        policyNumber: '1234567',
        email: 'john@example.com',
        contactNumber: '0211234567',
        dayToDayTreatment: false,
        accidentIllnessTreatment: false
      }
    ));
    const addInv = false;
    if (addInv){
      this.store.dispatch(CoreActions.addInvoice(
        {
          treatmentDate: new Date(),
          vetSpecialist: 'After Hours Veterinary Clinic - Wellington',
          claimAmount: ' 123456.00',
          hasBeenAdded: true,
          hasBeenSaved: true
        }
      ));
      this.store.dispatch(CoreActions.addInvoice(
        {
          treatmentDate: new Date(),
          vetSpecialist: 'After Hours Veterinary Clinic - Wellington',
          claimAmount: ' 123456.00',
          hasBeenAdded: true,
          hasBeenSaved: true
        }
      ));
      this.store.dispatch(CoreActions.addInvoice(
        {
          treatmentDate: new Date(),
          vetSpecialist: 'After Hours Veterinary Clinic - Wellington',
          claimAmount: ' 123456.00',
          hasBeenAdded: true,
          hasBeenSaved: true
        }
      ));
      this.store.dispatch(CoreActions.addInvoice(
        {
          treatmentDate: new Date(),
          vetSpecialist: 'After Hours Veterinary Clinic - Wellington',
          claimAmount: ' 123456.00',
          hasBeenAdded: true,
          hasBeenSaved: true
        }
      ));
      this.store.dispatch(CoreActions.addInvoice(
        {
          treatmentDate: new Date(),
          vetSpecialist: 'After Hours Veterinary Clinic - Wellington',
          claimAmount: ' 123456.00',
          hasBeenAdded: true,
          hasBeenSaved: true
        }
      ));
      this.store.dispatch(CoreActions.setCartTotal());
    }
    this.store.dispatch(CoreActions.setDeclaration(
      {
        bankAccount: '12 3113 0000449 00',
        vetBankAccount: false,
        vetAccountName: '',
        agreeDeclaration: true
      }
    ));
  }
  @HostListener('window:mousedown', ['$event'])
  onWindowMouseDown(event: any): void {
    this.setTimer();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any): void {
    this.setTimer();
  }
  public setTimer(): void {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      window.location.href = '/make-a-claim?timeout=true/#/';
    }, this.timeOutTime);
  }
  public resolved(captchaResponse: string): void {
    this.componentService.recaptchav2Resolved(captchaResponse);
  }
}
