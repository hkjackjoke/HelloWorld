import { Component, OnInit, ViewChild, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { QuoteModel } from 'src/app/models/quote.model';
import { CopyModel } from 'src/app/models/copy.model';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { Subscription } from 'rxjs';
import { PetAnimationComponent } from 'src/app/components/pet-animation/pet-animation.component';
import { SelectBoxOldComponent } from 'src/app/components/select-box-old/select-box-old.component';
import { AjaxService } from 'src/app/services/ajax.service';
import { DeclarationDetailsComponent } from 'src/app/components/declaration-details/declaration-details.component';
import { Pet } from 'src/app/models/pet.model';
import { ComponentService } from 'src/app/services/component.service';
import { TrackingService } from 'src/app/services/tracking.service';

declare var TweenMax: any;
declare var Quart: any;
declare var $: any;

@Component({
  selector: 'app-more-pet-details',
  templateUrl: './more-pet-details.component.html',
  styleUrls: ['./more-pet-details.component.scss']
})
export class MorePetDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('morePetDetails', {static: true}) morePetDetails: ElementRef;
  @ViewChild('petHealthDelcare', {static: true}) petHealthDelcare: ElementRef;
  @ViewChild('petAnimation', {static: true}) petAnimation: PetAnimationComponent;
  @ViewChild('regularVets', {static: true}) regularVets: SelectBoxOldComponent;
  @ViewChild('ddLameness', {static: true}) ddLameness: DeclarationDetailsComponent;
  @ViewChild('ddVomitingDiarrhoea', {static: true}) ddVomitingDiarrhoea: DeclarationDetailsComponent;
  @ViewChild('ddSkinEyeEarConditions', {static: true}) ddSkinEyeEarConditions: DeclarationDetailsComponent;
  @ViewChild('ddInjuriesAnimalFights', {static: true}) ddInjuriesAnimalFights: DeclarationDetailsComponent;


  public quote = QuoteModel.getInstance();
  public petIndex = 0;
  public complete = false;
  public copy = CopyModel;
  public expandA = false;
  public expandB = false;
  public subscription: Subscription;
  public showPreExistingPopup = false;
  public disableNeverBeenVet = false;

  public showPreExisting = false;
  public showDecs = false;
  public currentPet: Pet;
  public injuryStartRange: Date;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private componentService: ComponentService,
    private tracking: TrackingService
    ) {
    this.subscription = this.messageService.getMessage().subscribe( message => {
      switch (message.id) {
        case MessageService.onBack:
          TweenMax.fromTo(this.morePetDetails.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          this.petIndex = this.quote.pets.length - 1;
          break;
        case MessageService.onNext:
          TweenMax.fromTo(this.morePetDetails.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          break;
        case MessageService.editPet:
          TweenMax.fromTo(this.morePetDetails.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          this.petIndex = message.body.petIndex;
          break;
      }
    });
  }
  resetDeclarations() {
    if (this.ddLameness !== undefined) {
      this.ddLameness.reset();
    }
    if (this.ddVomitingDiarrhoea !== undefined) {
      this.ddVomitingDiarrhoea.reset();
    }
    if (this.ddSkinEyeEarConditions !== undefined) {
      this.ddSkinEyeEarConditions.reset();
    }
    if (this.ddInjuriesAnimalFights !== undefined) {
      this.ddInjuriesAnimalFights.reset();
    }
  }
  ngOnInit() {
    this.tracking.virtualPageView('/apply/some-more-pet-details', 'More Pet Details');
    this.tracking.whenPageLoads();
    this.setCurrentPet();
    this.validate();
    this.tracking.morePetDetailsLoad();

  }

  public closePreExistingPopup() {

    this.showPreExistingPopup = false;
  }
  public stopPetAnimation(): void {
    this.petAnimation.stopPetAnimation();
  }
  public updatePetAnimation(): void {
    this.petAnimation.resetAnimation();
  }
  trackField(field: string){
    this.tracking.formInteract(6, field);
  }
  notSelect(value: any): boolean{
    return value === undefined || value === null;
  }
  validate(field = ''): void {
    switch (field){
      case 'lameness':
        this.trackField('lameness_' + (this.currentPet.lameness ? 'yes' : 'no'));
        break;
      case 'vomitingDiarrhoea':
        this.trackField('vomiting_diarrhoea_' + (this.currentPet.vomitingDiarrhoea ? 'yes' : 'no'));
        break;
      case 'skinEyeEarConditions':
        this.trackField('skin_eye_ear_' + (this.currentPet.skinEyeEarConditions ? 'yes' : 'no'));
        break;
      case 'injuriesAnimalFights':
        this.trackField('injuries_animial_fights_' + (this.currentPet.injuriesAnimalFights ? 'yes' : 'no'));
        break;
      case 'preExistingConditions':
        this.trackField('other_pre_existing_' + (this.currentPet.preExistingConditions ? 'yes' : 'no'));
        break;
    }
    this.complete = true;
    this.disableNeverBeenVet = false;
    if ((this.currentPet.lameness === true && !this.currentPet.lamenessDeclaration.valid) || this.notSelect(this.currentPet.lameness)) {
      this.complete = false;
    }
    if ((this.currentPet.vomitingDiarrhoea === true && !this.currentPet.vomitingDiarrhoeaDeclaration.valid) ||
      this.notSelect(this.currentPet.vomitingDiarrhoea)) {
      this.complete = false;
    }
    if (this.currentPet.skinEyeEarConditions === true && !this.currentPet.skinEyeEarConditionsDeclaration.valid ||
      this.notSelect(this.currentPet.skinEyeEarConditions)) {
      this.complete = false;
    }
    if (this.currentPet.injuriesAnimalFights === true && !this.currentPet.injuriesAnimalFightsDeclaration.valid ||
      this.notSelect(this.currentPet.injuriesAnimalFights)) {
      this.complete = false;
    }
    if (this.currentPet.preExistingConditions === true && this.currentPet.preExistingConditionsText.trim() === '' ||
      this.notSelect(this.currentPet.preExistingConditions)) {
      this.complete = false;
    }
    if (this.currentPet.lameness) {
      if (this.currentPet.lamenessDeclaration.previousTreament) {
        this.disableNeverBeenVet = true;
        this.currentPet.neverBeenToVet = false;
      }
    }
    if (this.currentPet.vomitingDiarrhoea) {
      if (this.currentPet.vomitingDiarrhoeaDeclaration.previousTreament) {
        this.disableNeverBeenVet = true;
        this.currentPet.neverBeenToVet = false;
      }
    }
    if (this.currentPet.skinEyeEarConditions) {
      if (this.currentPet.skinEyeEarConditionsDeclaration.previousTreament) {
        this.disableNeverBeenVet = true;
        this.currentPet.neverBeenToVet = false;
      }
    }
    if (this.currentPet.injuriesAnimalFights) {
      if (this.currentPet.injuriesAnimalFightsDeclaration.previousTreament) {
        this.disableNeverBeenVet = true;
        this.currentPet.neverBeenToVet = false;
      }
    }
    if (!this.currentPet.preExistingConditions) {
      this.currentPet.preExistingConditionsText = '';
    }
    if (!this.currentPet.neverBeenToVet && !this.currentPet.vetNotListed) {
      if (this.currentPet.regularVets === null || this.currentPet.regularVets === undefined || this.currentPet.regularVets.id === -1) {
        this.complete = false;
      }
    } else if (this.currentPet.vetNotListed && this.currentPet.otherVetPractise.trim() === '') {
      this.complete = false;
    }
    this.showPreExisting = this.complete;
  }
  setCurrentPet() {
    this.currentPet = this.quote.pets[this.petIndex];
    this.injuryStartRange =  this.currentPet.dontKnowAge ?  this.currentPet.dontKnowAgeDate :  this.currentPet.ageDob;
  }
  back(): void {
    if (this.petIndex) {
      this.quote.pets[this.petIndex] = this.currentPet;
      this.petIndex--;
      this.setCurrentPet();
      this.messageService.sendMessage(MessageService.scrollToTimeline);
      TweenMax.to(this.petHealthDelcare.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        TweenMax.fromTo(this.petHealthDelcare.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
        this.validate();
        this.updatePetAnimation();
      }, ease: Quart.easeOut});
    } else {
      TweenMax.to(this.morePetDetails.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(['apply/about-you']).then( (e) => {
          this.messageService.sendMessage(MessageService.onBack);
        });
      }, ease: Quart.easeOut});
    }
  }

  gotoSummary() {
    this.ajaxService.application(null, false, true).subscribe(() => {
      TweenMax.to(this.morePetDetails.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(['apply/summary']).then( (e) => {
          this.messageService.sendMessage(MessageService.onNext);
        });
    }, ease: Quart.easeOut});
    },
    (err: any) => {
      this.ajaxService.handleError('Some more pet details save application error', err);
    });
  }

  next(): void {
    if (this.complete) {
      if (this.petIndex === this.quote.pets.length - 1) {
        this.quote.pets[this.petIndex] = this.currentPet;
        this.componentService.loadingNotification('');
        this.gotoSummary();
      } else {
        this.quote.pets[this.petIndex] = this.currentPet;
        this.petIndex++;
        this.setCurrentPet();
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        TweenMax.to(this.petHealthDelcare.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
          TweenMax.fromTo(this.petHealthDelcare.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
          this.validate();
          this.updatePetAnimation();
        }, ease: Quart.easeOut});
      }
    }
  }
  changeNeverBeenToVet(event: any) {
    this.currentPet.neverBeenToVet = event.value;
    this.currentPet.vetNotListed = false;
    if (this.currentPet.neverBeenToVet) {
      this.currentPet.regularVets = {label: '', id: -1, Code: '', Description: '' };
    }
    this.currentPet.regularVets = null;
    this.validate();
  }
  changeVetNotListed(event: any) {
    this.currentPet.vetNotListed = event.value;
    this.currentPet.neverBeenToVet = false;
    if (this.currentPet.vetNotListed) {
      this.currentPet.regularVets = {label: '', id: -1, Code: '', Description: '' };
    }
    this.validate();
  }
  changeVetPracticeSame(event: any) {
    this.currentPet.vetPracticeSame = event.value;
    this.validate();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
