import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { QuoteModel } from 'src/app/models/quote.model';
import { CopyModel } from 'src/app/models/copy.model';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { Pet } from 'src/app/models/pet.model';
import { RemovePetConfirmComponent } from 'src/app/components/remove-pet-confirm/remove-pet-confirm.component';
// eslint-disable-next-line max-len
import { RemoveAuthorisedPersonConfirmComponent } from 'src/app/components/remove-authorised-person-confirm/remove-authorised-person-confirm.component';
import { AjaxService } from 'src/app/services/ajax.service';
import { TrackingService } from 'src/app/services/tracking.service';


declare var TweenMax: any;
declare var Quart: any;
declare var $: any;

@Component({
  selector: 'app-apply-summary',
  templateUrl: './apply-summary.component.html',
  styleUrls: ['./apply-summary.component.scss']
})
export class ApplySummaryComponent implements OnInit, OnDestroy {
  @ViewChild('applySummary', {static : true}) private applySummary: ElementRef;
  @ViewChild('removePetPopup', {static: true}) public removePetPopup: RemovePetConfirmComponent;
  @ViewChild('authorisedPersonPopup', {static: true}) public authorisedPersonPopup: RemoveAuthorisedPersonConfirmComponent;

  public complete = false;
  public quote: QuoteModel;
  public total = 0;
  public totalDollars: string;
  public totalCents: string;
  public subscription: Subscription;
  public confirmRemovePet = '';
  public confirmRemovePetModel: Pet  = new Pet();
  public confirmRemovePetIndex = 0;

  public otherDay: string;
  public otherMonth: string;
  public otherYear: string;

  public confirmRemovePerson = false;
  public showCancelApplicationPopup = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private tracking: TrackingService) {
      this.quote = QuoteModel.getInstance();
      this.subscription = this.messageService.getMessage().subscribe( message => {
        switch (message.id) {
          case MessageService.onBack:
            TweenMax.fromTo(this.applySummary.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
          case MessageService.onNext:
            TweenMax.fromTo(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
            break;
        }
      });
      this.updateQuote();
  }
  ngOnInit() {
    this.tracking.virtualPageView('/apply/summary', 'Summary');
    this.tracking.whenPageLoads();
    this.tracking.applySummaryLoad();

  }
  ngAfterInit() {
  }
  updateQuote() {
    let t = 0;
    this.quote.pets.forEach((pet: Pet, index: number) => {
      t += pet.animalQuote.total;
    });
    this.total = t;
    const a: string[] = t.toFixed(2).toString().split('.');
    this.totalDollars = a[0];
    this.totalCents = a.length > 1 ? a[1] : '00';
    if (this.quote.otherDOB !== undefined && this.quote.otherDOB !== null) {
      this.otherDay = String('00' + this.quote.otherDOB.getDate().toString()).slice(-2);
      this.otherMonth = String('00' + (this.quote.otherDOB.getMonth() + 1).toString()).slice(-2);
      this.otherYear = this.quote.otherDOB.getFullYear().toString();
    } else {
      this.otherDay = '';
      this.otherMonth = '';
      this.otherYear = '';
    }
    this.checkCompleted();
  }
  editPet(value: any): void {
    TweenMax.to(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.router.navigate(['']).then( (e) => {
        this.messageService.sendMessage(MessageService.editPet, {from: 'apply-summary', pet: value.pet, petIndex: value.index});
      });
    }, ease: Quart.easeOut});
  }
  editPetHealth(value: any) {
    TweenMax.to(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate(['apply/some-more-pet-details']).then( (e) => {
        this.messageService.sendMessage(MessageService.editPet, {from: 'apply-summary', pet: value.pet, petIndex: value.index});
      });
    }, ease: Quart.easeOut});
  }
  removePet(data: any): void {
    this.confirmRemovePet = 'show';
    this.confirmRemovePetIndex = data.index;
    this.confirmRemovePetModel = data.pet;
    this.removePetPopup.showMe();
  }
  closeConfirmRemovePet(): void {
    this.confirmRemovePet = '';
  }
  hasRemovedPet(): void {
    this.confirmRemovePet = '';
    if (!this.quote.pets.length) {
      TweenMax.to(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(['']).then( (e) => {
          this.messageService.sendMessage(MessageService.onBack);
        });
      }, ease: Quart.easeOut});
    }
    this.updateQuote();
  }

  removePerson() {
    this.confirmRemovePerson = true;
    this.authorisedPersonPopup.showMe();
  }
  closeConfirmRemovePerson(): void {
    this.confirmRemovePerson = false;
  }
  hasRemovedPerson() {
    this.confirmRemovePerson = false;
    this.updateQuote();
  }
  editAuthorisedPerson() {
    this.confirmRemovePerson = false;
    TweenMax.to(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.router.navigate(['apply/about-you']).then( (e) => {
        this.messageService.sendMessage(MessageService.editAuthorisedPerson, 'apply-summary');
      });
    }, ease: Quart.easeOut});
  }
  editDateStart(): void {
    TweenMax.to(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.router.navigate(['choose-a-plan']).then( (e) => {
        this.messageService.sendMessage(MessageService.editFrom, 'apply-summary');
      });
    }, ease: Quart.easeOut});
  }
  public checkCompleted(): void {
    this.complete = this.total > 0.00;
  }
  proceedPayment(): void {
    if (this.complete) {
      this.ajaxService.application(null, false, true).subscribe(() => {
        TweenMax.to(this.applySummary.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
          this.messageService.sendMessage(MessageService.scrollToTimeline);
          this.router.navigate(['apply/payment']).then( (e) => {
            this.messageService.sendMessage(MessageService.onNext);
          });
        }, ease: Quart.easeOut});
      },
      (err: any) => {
        this.ajaxService.handleError('Ajax proceed payment save application error', err);
      });
    }
  }
  back(): void {
    TweenMax.to(this.applySummary.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      this.router.navigate(['apply/some-more-pet-details']).then( (e) => {
        this.messageService.sendMessage(MessageService.onBack);
      });
    }, ease: Quart.easeOut});
  }
  cancel(): void {
    this.showCancelApplicationPopup = true;
  }
  formatDate(date: Date) {
    let datestring = '';

    datestring += ' ' + date.getDate();
    datestring += ' ' + CopyModel.months[date.getMonth()];
    datestring += ' ' + date.getFullYear();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getDate() === tomorrow.getDate()
      && date.getMonth() === tomorrow.getMonth()
      && date.getFullYear() === tomorrow.getFullYear()) {
        datestring += ' (Tomorrow)';
    }
    return datestring;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  closeCancelApplicationPopup() {
    this.showCancelApplicationPopup = false;
  }
  hasCancelledApplication() {
    this.tracking.cancelApplication();
    this.quote.cancelapplication();
    window.location.href = '/';
  }
}
