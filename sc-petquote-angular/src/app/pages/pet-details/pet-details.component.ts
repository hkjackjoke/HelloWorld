import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, QueryList, ViewChildren,
  ChangeDetectorRef } from "@angular/core";
import {QuoteModel } from "../../models/quote.model";
import {Pet } from "../../models/pet.model";
import {BreedsModel } from "../../models/breeds.model";
import { Router } from "@angular/router";
import { CopyModel } from "src/app/models/copy.model";
import { Subscription } from "rxjs";
import { MessageService } from "src/app/services/message.service";
import { PetQuestionSelectComponent } from "src/app/components/pet-question-select/pet-question-select.component";
import { RemovePetConfirmComponent } from "src/app/components/remove-pet-confirm/remove-pet-confirm.component";
import { PetItemComponent } from "src/app/components/pet-item/pet-item.component";
import { DateAge } from "src/app/helpers/DateAge";
import { ComponentService } from "src/app/services/component.service";
import { TrackingService } from "src/app/services/tracking.service";
declare var TweenMax: any;
declare var Quart: any;

@Component({
  selector: "app-pet-details",
  templateUrl: "./pet-details.component.html",
  styleUrls: ["./pet-details.component.scss"]
})
export class PetDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild("line1", {static: true}) public line1: ElementRef;
  @ViewChild("petDetails", {static: true}) public petDetails: ElementRef;
  @ViewChild("petName", {static: true}) public petName: ElementRef;
  @ViewChild("dayBorn", {static: true}) public dayBorn: ElementRef;
  @ViewChild("monthBorn", {static: true}) public monthBorn: ElementRef;
  @ViewChild("yearBorn", {static: true}) public yearBorn: ElementRef;
  @ViewChild("ageAprox", {static: true}) public ageAprox: ElementRef;
  @ViewChild("nextButton", {static: true}) public nextButton: ElementRef;
  @ViewChild("speciesSelect", {static: true}) public speciesSelect: PetQuestionSelectComponent;
  @ViewChild("genderSelect", {static: true}) public genderSelect: PetQuestionSelectComponent;
  @ViewChild("breedSelect", {static: true}) public breedSelect: PetQuestionSelectComponent;
  @ViewChild("removePetPopup", {static: true}) public removePetPopup: RemovePetConfirmComponent;

  @ViewChildren("petItem") public petItem !: QueryList<PetItemComponent>;
  public scrollToEdit: number;

  public copyModel = CopyModel;
  public breeds: Array<any>;
  public months: Array<any> = [
    {label: 1, id : 1},
    {label: 2, id: 2},
    {label: 3, id: 3},
    {label: 4, id: 4},
    {label: 5, id: 5},
    {label: 6, id: 6},
    {label: 7, id: 7},
    {label: 8, id: 8},
    {label: 9, id: 9},
    {label: 10, id: 10},
    {label: 11, id: 11}
  ];
  public approxAgeValues: Array<any> = CopyModel.approxAgeValues;
  public years: Array<any>;
  public popularId: Array<any>;
  public quote: QuoteModel;
  public pet: Pet;
  public showLine2 = "";
  public showLine3 = "";
  public showLine4 = "";
  public showLine5 = "";
  public addingAnotherPet = false;
  public editAnotherPet = null;
  public complete = false;
  public questionsStatus = "";
  public confirmRemovePet = "";
  public confirmRemovePetModel: Pet  = new Pet();
  public confirmRemovePetIndex = 0;
  public subscription: Subscription;
  public nextTabIndex = 0;
  public addAnotherTabIndex = 0;
  public cancelTabIndex = -1;
  public addPetTabIndex = -1;
  public ageAproxValueTab = -1;
  public ageAproxTypeTab = -1;
  public nextTabFocus = false;
  public addPetTabFocus = false;
  public yearBornValue = "";
  public monthBornValue = "";
  public dayBornValue = "";
  public dayError = false;
  public monthError = false;
  public yearError = false;
  public toOldError = false;
  public hasSetDOB = false;
  public toOldErrorMessage = "";
  public testText = "";

  public dateMin: Date;
  public dateMax: Date;

  public generalInformationNotice: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private tracking: TrackingService
    ) {

      this.quote =  QuoteModel.getInstance();
      this.subscription = this.messageService.getMessage().subscribe( message => {
        switch (message.id) {
            case MessageService.onBack:
              TweenMax.fromTo(this.petDetails.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, ease: Quart.easeOut});
              break;
            case MessageService.applicationTimeOut:
              this.quote =  QuoteModel.getInstance();
              this.hasRemovedPet();
              break;
            case MessageService.editPet:
              this.messageService.sendMessage(MessageService.scrollToTimelineWithDuration);
              this.scrollToEdit = message.body.petIndex;
              break;
          }
      });

      this.dateMin = new Date();
     // this.dateMin.setFullYear(2019);
      this.dateMax = new Date();

     // this.dateMax.setFullYear(2021);

      this.dateMin.setDate(this.dateMin.getDate() + 1);
      this.dateMax.setDate(this.dateMax.getDate() + 31);

  }
  ngOnInit(): void {
    this.tracking.virtualPageView("/start-quote", "Pet Info");
    this.tracking.whenPageLoads();
    this.years = new Array<any>();
    for (let i: number = 1; i < 35; i++) {
        this.years.push({label: i, value: i});
    }
    this.pet = new Pet();
    this.generalInformationNotice = CopyModel.generalInformationNotice;
    this.complete = this.quote.pets.length > 0;
    if (this.quote.pets.length > 0) {
      this.questionsStatus = "other-pet-added";
    }
    this.tracking.petInfoLoad(this.quote.pets.length > 0 ? this.quote.pets.length + 1 : 1);

  }
  ngAfterViewInit(): void {
    if (this.scrollToEdit !== undefined) {
      this.petItem.forEach((item: PetItemComponent, index: number) => {
        if (index === this.scrollToEdit) {
          item.edit(true);
        }
      });
    }
    if (this.quote.pets.length === 0) {
      this.componentService.setGreenBannerSlide("0");
    } else if (this.quote.pets.length === 1) {
      this.componentService.setGreenBannerSlide("0");
    }
  }
  public setSpecies(data: any): void {
    this.pet.species = data;
    if (this.hasSetDOB) {
      this.validateDate();
    }
    this.checkShowLines();
    this.breeds  = this.pet.species.id === 1 ? BreedsModel.catBreeds : BreedsModel.dogBreeds;
    this.popularId = this.pet.species.id === 1 ?
    ["BR00804","BR00803","BR00802","BR00846","BR00789"] :
    ["BR00500","BR00898","BR00521","BR00498","BR00357"];
    this.pet.breed = new BreedsModel("", "", "", "", -1);
    this.genderSelect.focusQuestion();
    this.componentService.setGreenBannerSlide("");
    this.tracking.formInteract(1, "add_pet_species");
  }
  public setGender(data: any): void {
    this.pet.gender = data;
    this.checkShowLines();
    (this.petName.nativeElement as HTMLInputElement).focus();
    this.tracking.formInteract(1, "add_pet_gender");
  }
  public setBreed(data: any): void {
    this.pet.breed = data;
    this.checkShowLines();
    (this.dayBorn.nativeElement as HTMLInputElement).focus();
    this.tracking.formInteract(1, "add_pet_breed");
  }
  public focusinField(field: string): void {
    this.tracking.formInteract(1, field);
  }
  public selectAproxAge(data: any): void {
    if (data !== undefined) {
      this.pet.ageAproxType = data;
    }
    this.pet.getAgeMessage(this.quote.policyStartDate);
    this.checkShowLines();
    this.tracking.formInteract(1, "add_pet_approx_age_unit");
  }
  public checkShowLines(): void {
    this.complete = true;
    if (this.pet.species.id !== 0) {
      this.showLine2 = "animate show";
    } else {
      this.complete = false;
    }
    if (this.pet.gender.id !== 0 && this.pet.name.trim() !== "") {
      this.showLine3 = "animate show";
    } else {
      this.complete = false;
    }
    if (this.pet.breed.id !== -1) {
      if (!this.pet.dontKnowAge) {
        this.showLine4 = "animate show";
        this.showLine5 = "animate show";
      }
    } else {
      this.complete = false;
    }
    if (this.pet.dontKnowAge) {
      if (this.pet.ageAproxValue === undefined || this.pet.ageAproxValue === "") {
        this.complete = false;
      } else if (this.pet.ageAproxValue === "" || this.pet.ageAproxType.id === 0) {
        this.complete = false;
      }
    } else {
      if (this.pet.ageDob == null) {
        this.complete = false;
      }
    }
    let date: Date = new Date();
    if (this.pet.dontKnowAge && this.pet.ageAproxValue !== undefined) {
        this.pet.dontKnowAgeDate = this.componentService.getAproxAgeDate(this.pet.ageAproxType.label, this.pet.ageAproxValue);
        this.pet.getAgeMessage(this.quote.policyStartDate);
    } else {
        date = this.pet.ageDob;
        if (!(date instanceof Date)) {
          this.complete = false;
        } else if ( date.getFullYear() === 1900 || date.getFullYear() === 0 ||  date.getFullYear() === 1900) {
          this.yearError = true;
          this.complete = false;
        }
        this.pet.getAgeMessage(this.quote.policyStartDate);
    }
    if (this.pet.isTooYoung || this.pet.isTooOld || (this.toOldError && !this.pet.dontKnowAge)) {
      this.complete = false;
    }
  }
  public toogleKnowAge(): void {
    this.yearError = this.monthError = this.dayError = false;
    this.pet.dontKnowAge = !this.pet.dontKnowAge;
    this.checkShowLines();
    if (this.pet.dontKnowAge) {
      this.nextTabIndex = 0;
      this.ageAproxValueTab = 0;
      this.ageAproxTypeTab = 0;
      (this.ageAprox.nativeElement as HTMLInputElement).focus();
      this.showLine4 = "compress";
    } else {
      this.nextTabIndex = 0;
      this.ageAproxValueTab = -1;
      this.ageAproxTypeTab = -1;
      this.showLine4 = "animate show";
    }
    this.pet.getAgeMessage(this.quote.policyStartDate);
    this.tracking.formInteract(1, "add_pet_dont_know_age");
  }
  public aproxAgeValue(): void {
    this.checkShowLines();
  }
  public addAnotherPet(): void {
    if (this.quote.pets.length >= 4) {
      return;
    }
    if (this.pet.breed.id !== -1) {
      this.quote.pets.push(this.pet);
      this.tracking.petInfoNext(this.quote.pets.length, this.quote.pets);
    }
    this.componentService.setGreenBannerSlide("");
    this.pet = new Pet();
    this.complete = false;
    this.showLine2 =  this.showLine3 =  this.showLine4 = this.showLine5 = "";
    this.addingAnotherPet = true;
    this.hasSetDOB = false;
    this.questionsStatus = "";
    this.yearBornValue = "";
    this.monthBornValue = "";
    this.dayBornValue = "";
    setTimeout(() => {
      let offset: any = this.getPosition(this.line1.nativeElement as HTMLDivElement).y;
      offset -= 42;
      this.componentService.scrollTo(offset);
      this.speciesSelect.focusQuestion();
      this.tracking.petInfoLoad(this.quote.pets.length > 0 ? this.quote.pets.length + 1 : 1);
    }, 300);

  }
  public addThisPet(): void {
    if (!this.complete) {
      return;
    }
    this.quote.pets.push(this.pet);
    this.tracking.petInfoNext(this.quote.pets.length, this.quote.pets);
    this.addingAnotherPet = false;
    this.pet = new Pet();
    this.complete = this.quote.pets.length < 5 ? true : false;
    this.showLine2 =  this.showLine3 =  this.showLine4 = this.showLine5 = "";
    this.yearBornValue = "";
    this.monthBornValue = "";
    this.dayBornValue = "";
    this.questionsStatus = "other-pet-added";
    if (this.quote.pets.length === 2) {
      this.componentService.setGreenBannerSlide("1");
    }
    this.messageService.sendMessage(MessageService.scrollToTimelineWithDuration);
    this.tracking.petAdded();
  }
  public cancelAddingPet(): void {

    this.addingAnotherPet = false;
    this.pet = new Pet();
    this.complete = true;
    this.showLine2 =  this.showLine3 =  this.showLine4 = this.showLine5 = "";
    this.yearBornValue = "";
    this.monthBornValue = "";
    this.dayBornValue = "";
    this.questionsStatus = "other-pet-added";
  }
  public cancelEditPet(): void {
    this.editAnotherPet = null;
    this.messageService.sendMessage(MessageService.scrollToTimelineWithDuration);
  }
  public editCompletePet(index: any): void {
    this.editAnotherPet = index;
    this.cdr.detectChanges();
    this.tracking.editPet();
  }
  public editPetSave(): void {
    this.editAnotherPet = null;
    this.messageService.sendMessage(MessageService.scrollToTimelineWithDuration);
  }
  public editPet(pet: Pet): void {
    this.showLine2 =  this.showLine3 =  this.showLine4 = this.showLine5 = "show";
    if (pet.dontKnowAge) {
      this.showLine2 =  this.showLine3 =  this.showLine5 = "show";
    } else {
      this.showLine2 =  this.showLine3 =  this.showLine4 = this.showLine5 = "show";
    }
    this.pet = pet;
  }
  public removePet(data: any): void {

    this.confirmRemovePetIndex = data.index;
    this.confirmRemovePetModel = data.pet;
    this.removePetPopup.showMe();
    this.editAnotherPet = null;
  }
  public closeConfirmRemovePet(): void {
    this.confirmRemovePet = "";
  }
  public hasRemovedPet(): void {
    this.confirmRemovePet = "";
    this.complete = this.quote.pets.length > 0 && this.quote.pets.length < 4;
    this.questionsStatus = this.quote.pets.length > 0 ? "other-pet-added" : "";
    this.tracking.removePet();
  }
  public tabToNext(): void {
    this.nextTabFocus = true;
  }
  public tabFromNext(): void {
    this.nextTabFocus = false;
  }
  public nextKeyDown(e: any): void {
    if (e.keyCode === 13) {
      this.next();
    }
  }
  public tabToAddPet(): void {
    this.addPetTabFocus = true;
  }
  public tabFromAddPet(): void {
    this.addPetTabFocus = false;
  }
  public addPetKeyDown(e: any): void {
    if (e.keyCode === 13) {
      this.addAnotherPet();
    }
  }
  public  next(): void {
    if (!this.complete || (this.editAnotherPet !== null)) {
      return;
    }
    if (this.complete && this.questionsStatus === "other-pet-added") {
      if (this.pet.breed.id !== -1) {
        this.quote.pets.push(this.pet);

      }
      // this.tracking.petInfoNext(this.quote.pets.length, this.quote.pets);
      TweenMax.to(this.petDetails.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToWindowTop);
        this.router.navigate(["applicant-details"]).then( () => {
          this.messageService.sendMessage(MessageService.onNext);
        });
      }, ease: Quart.easeOut});
      return;
    }
    this.quote.pets.push(this.pet);
    this.tracking.petInfoNext(this.quote.pets.length, this.quote.pets);
    // this.tracking.petInfoSubmit(this.quote.pets.length);
    this.componentService.setGreenBannerSlide("1");
    this.addingAnotherPet = false;
    this.pet = new Pet();
    this.complete = true;
    this.showLine2 =  this.showLine3 =  this.showLine4 = this.showLine5 = "";
    this.yearBornValue = "";
    this.monthBornValue = "";
    this.dayBornValue = "";
    this.questionsStatus = "other-pet-added";
    (this.nextButton.nativeElement as HTMLButtonElement).blur();
    this.messageService.sendMessage(MessageService.scrollToWindowTop);
    this.tracking.petAdded();

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setInputWidth(txt: string = ""): void {
    this.pet.name = CopyModel.capitalize(this.pet.name);
    if (this.testText === txt) {
      return;
    }
    this.testText = txt;
    if (this.testText === "") {
      return;
    }
    document.getElementById("petName").style.width = (document.getElementById("petNameWidth").offsetWidth + 15) + "px";
  }
  public updateDOB(field: string): void {
    const order: any = {
        0: "dayBorn",
        1: "monthBorn",
        2: "yearBorn"
    };

    this.dayError = this.monthError = this.yearError = false;
    const length: number = (this[order[field]].nativeElement as HTMLInputElement).value.length;
    if (length === 2 && field !== "2") {
      const nxtfield: string =  (Number(field) + 1).toString();
      (this[order[nxtfield]].nativeElement as HTMLInputElement).focus();
    }
    this.pet.ageDob = null;
    this.checkShowLines();

    if (this.yearBornValue.length !== 4) {
      return;
    }
    this.hasSetDOB = true;
    this.validateDate();

  }

  public focusoutDate(field: any): void {
    const value: any = (this[field].nativeElement as HTMLInputElement).value;
    if (this.dayError || this.monthError || this.yearError ) {
      return;
    }
    const length: number = value.length;
    if (length < 2 && length > 0) {
      (this[field].nativeElement as HTMLInputElement).value = String("00" + value).slice(-2);
    }
    if (field === "yearBorn" && (this[field].nativeElement as HTMLInputElement).value.length < 4) {
      this.yearError = true;
    }
    this.checkShowLines();
  }

  public validateDate(): void {
    const monthBorn: number = Number(this.monthBornValue);
    const dayBorn: number = Number(this.dayBornValue);
    const yearBorn: number = Number(this.yearBornValue);
    this.toOldError = false;
    if (!this.pet.dontKnowAge) {
      if (dayBorn < 1 || dayBorn > 31) {
        this.dayBornValue = "";
        this.dayError = true;
        (this.dayBorn.nativeElement as HTMLInputElement).focus();
        this.tracking.formError(1, "add_pet_dob", "Please enter a valid date of birth.");
        return;
      }

      if (monthBorn < 1 || monthBorn > 12) {
        this.monthBornValue = "";
        this.monthError = true;
        (this.monthBorn.nativeElement as HTMLInputElement).focus();
        this.tracking.formError(1, "add_pet_dob", "Please enter a valid date of birth.");
        return;
      }
      if (!this.checkDayIsValid(dayBorn, monthBorn, yearBorn)) {
        this.dayBornValue = "";
        this.dayError = true;
        (this.dayBorn.nativeElement as HTMLInputElement).focus();
        this.tracking.formError(1, "add_pet_dob", "Please enter a valid date of birth.");
        return;
      }
      this.pet.ageDob = new Date(yearBorn, monthBorn - 1, dayBorn);
    } else {
      this.pet.getAgeMessage(this.quote.policyStartDate);
    }
    if (!this.dayError || !this.monthError) {
      const dateAge:DateAge = new DateAge(this.pet.ageDob);
      if (this.pet.species.id === 1) {
          if (dateAge.weeks > 2087) {
            this.toOldError = true;
            this.toOldErrorMessage = "Maximium cat age 40 years";
            this.tracking.formError(1, "add_pet_dob", this.toOldErrorMessage);
            this.pet.ageMessage = "";
            return;
          }
      }
      if (this.pet.species.id === 2) {
        if (dateAge.weeks > 1565) {
          this.toOldError = true;
          this.toOldErrorMessage = "Maximium dog age 30 years";
          this.tracking.formError(1, "add_pet_dob", this.toOldErrorMessage);
          this.pet.ageMessage = "";
          return;
        }
      }
      if (dateAge.days < 0) {
          this.dayError = true;
          this.tracking.formError(1, "add_pet_dob", "Please enter a valid date of birth.");
          this.pet.ageMessage = "";
      }
    }
    this.checkShowLines();
  }

  public checkDayIsValid(day: number, month: number, year: number = null): boolean {
    const now: Date = new Date();
    const date: number = new Date(year !== null ? year : now.getFullYear(), month, 0).getDate();
    return day > 0 && day <= date;
  }

  public breedFirstLetter(): string {
    if (this.pet.breed == null || this.pet.breed.label === "") {
      return;
    }
    return this.pet.breed.label.substring(0, 1).toLowerCase();
  }
  getTitle(): string {
    let title: string  = "Who do you want to&nbsp;insure?";
    if (this.quote.pets.length > 0) {
      title = "Do you want to insure anyone&nbsp;else?";
    }
    if (this.addingAnotherPet && this.quote.pets.length > 0) {
      title = "Who else do you want to&nbsp;insure?";
    }
    return title;
  }
  public getPosition(element: any): any {
    let xPosition: number = 0;
    let yPosition: number = 0;
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
  }
}
