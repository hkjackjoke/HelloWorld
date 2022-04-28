import { Component, OnInit, Input, Output,  EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, } from "@angular/core";
import {Pet } from "../../models/pet.model";
import {BreedsModel } from "../../models/breeds.model";
import {CopyModel } from "../../models/copy.model";
import { QuoteModel } from "src/app/models/quote.model";
import { TypeaheadInputComponent } from "src/app/components/typeahead-input/typeahead-input.component";
import { TextInputComponent } from "src/app/components/text-input/text-input.component";
import { DOBInputComponent } from "src/app/components/dobinput/dobinput.component";
import { PetAnimationComponent } from "src/app/components/pet-animation/pet-animation.component";
import { ComponentService } from "src/app/services/component.service";
import { DateAge } from "src/app/helpers/DateAge";
import { NumberFormatStyle } from "@angular/common";
import { TrackingService } from "src/app/services/tracking.service";

declare var TweenMax: any;
declare var Quart: any;

@Component({
  selector: "app-pet-item",
  templateUrl: "./pet-item.component.html",
  styleUrls: ["./pet-item.component.scss"]
})
export class PetItemComponent implements OnInit {
  public editForm = false;
  public editPetAge = false;
  public editPetName = false;
  public editPetBreed = false;
  public tmpPet: Pet;
  public breeds: Array<any>;
  public breedError = false;
  public ageError = false;
  public quote: QuoteModel;
  public approxAgeValues: Array<any> = CopyModel.approxAgeValues;
  public petAgeString: string;
  public focus = "";
  public focusAge = false;
  public popularId: Array<any>;

  @Input() index: number;
  @Input() pet: Pet;
  @Input() disabled = false;
  @Input() disableSave = true;
  @Input() editIndex: number;
  @Output() removePet = new EventEmitter<any>();
  @Output() cancelEdit = new EventEmitter<any>();
  @Output() editPet = new EventEmitter<any>();
  @Output() editPetSave = new EventEmitter<any>();
  @ViewChild("petName", { static: true}) petName: TextInputComponent;
  @ViewChild("petBreed", { static: true}) petBreed: TypeaheadInputComponent;
  @ViewChild("petAge", { static: true}) petAge: DOBInputComponent;
  @ViewChild("petAnimation", { static: true}) petAnimation: PetAnimationComponent;
  @ViewChild("inputAgeValue", { static: true }) inputAgeValue: ElementRef;
  @ViewChild("editFormItem", { static: true }) editFormItem: ElementRef;



  constructor(
    private componentService: ComponentService,
    private cdr: ChangeDetectorRef,
    private tracking: TrackingService) {
    this.quote = QuoteModel.getInstance();
  }

  ngOnInit(): void {
    this.tmpPet = this.pet.clone();
    this.petAgeString = this.tmpPet.age(this.quote.policyStartDate);
    this.breeds = this.tmpPet.species.id === 1 ? BreedsModel.catBreeds : BreedsModel.dogBreeds;
    this.petAge.minYear = this.tmpPet.species.id === 1 ?
    this.quote.policyStartDate.getFullYear() - 40 :  this.quote.policyStartDate.getFullYear() - 30;

  }
  edit(scrollTo: boolean = false): void {

    if (this.disabled || this.editForm || (this.editIndex !== null ? this.editIndex !== this.index : false)) {
      return;
    }

    this.editForm = true;
    this.validateAge();
    this.popularId = this.pet.species.id === 1 ?
    ["BR00804","BR00803","BR00802","BR00846","BR00789"] :
    ["BR00500","BR00898","BR00521","BR00498","BR00357"];
    if ( scrollTo ) {
      setTimeout(() => {
        const rec: any = this.componentService.offset(this.editFormItem.nativeElement);
        const scrollTop: any = rec.offsetTop - document.getElementById("top-anchor").offsetHeight;
        this.componentService.scrollTo(scrollTop);
        setTimeout(() => {
          this.editFormItem.nativeElement.removeAttribute("style");
        },100);
      }, 500 );
    } else {
      this.validate();
    }
    this.editPet.emit();
  }
  remove(): void {
    if (this.disabled || this.editForm) {
      return;
    }
    this.removePet.emit({index: this.index, pet: this.tmpPet});
  }
  dog(value: boolean): void {
    this.tmpPet.species = {label: "dog", id: 2};
    this.popularId = ["BR00500","BR00898","BR00521","BR00498","BR00357"];
    this.breeds = BreedsModel.dogBreeds;
    this.editBreed();
    this.validate();
    this.petAnimation.startDog();
    this.tracking.formInteract(1, "edit_pet_species_dog");

  }
  cat(value: boolean): void {
    this.tmpPet.species = {label: "cat", id: 1};
    this.popularId = ["BR00804","BR00803","BR00802","BR00846","BR00789"];
    this.breeds = BreedsModel.catBreeds;
    this.editBreed();
    this.validate();
    this.petAnimation.startCat();
    this.tracking.formInteract(1, "edit_pet_species_cat");

  }
  male(value: boolean): void {
    this.tmpPet.gender = CopyModel.gender[1];
    this.validate();
    this.tracking.formInteract(1, "edit_pet_gender_male");
  }
  female(value: boolean): void {
    this.tmpPet.gender = CopyModel.gender[0];
    this.validate();
    this.tracking.formInteract(1, "edit_pet_gender_female");
  }
  public focusinField(field: string): void {
    this.tracking.formInteract(1, field);
  }
  trackDOBField(field: string): void {
    this.tracking.formInteract(1, "edit_pet_dob_" + field);
  }
  setApproxAge(id: number): void {
    this.tmpPet.ageAproxType = {label: "&nbsp;", id: 0};
    CopyModel.approxAgeValues.forEach((value: any, index: number) => {
      if (value.id === id) {
        this.tmpPet.ageAproxType = value;
      }
    });
    this.updateAge();
    this.validate();
    this.focusinField("edit_pet_approx_age_unit_" + this.tmpPet.ageAproxType.label);
  }
  save(): void {
    if (!this.quote.pets[this.index].overPetCareLimit && this.tmpPet.overPetCareLimit) {
      if (this.quote.pets[this.index].selectedPlan === "petcare") {
        this.quote.pets[this.index].selectedPlan = "";
      }
    }
    this.quote.pets[this.index].name = this.tmpPet.name;
    this.quote.pets[this.index].species = this.tmpPet.species;
    this.quote.pets[this.index].breed = this.tmpPet.breed;
    this.quote.pets[this.index].gender = this.tmpPet.gender;
    this.quote.pets[this.index].dontKnowAge = this.tmpPet.dontKnowAge;
    this.quote.pets[this.index].ageAproxType = this.tmpPet.ageAproxType;
    this.quote.pets[this.index].ageAproxValue = this.tmpPet.ageAproxValue;
    this.quote.pets[this.index].ageDob = this.tmpPet.ageDob;
    this.quote.pets[this.index].dontKnowAgeDate = this.tmpPet.dontKnowAgeDate;
    this.quote.pets[this.index].overPetCareLimit = this.tmpPet.overPetCareLimit;
    this.editForm = false;
    this.editPetAge = false;
    this.editPetBreed = false;
    this.editPetName = false;
    this.editPetSave.emit();
  }
  toggleDontKnowAge(event: any): void {
    this.tmpPet.dontKnowAge = event.value;
    const focusInput: any = () => {
      (this.inputAgeValue.nativeElement as HTMLInputElement).focus();
      this.ageError = false;
    };
    this.validate();
    setTimeout(focusInput, 100);
    this.focusinField("edit_pet_dont_know_age");
  }
  cancel(): void {
    this.tmpPet = this.quote.pets[this.index].clone();
    this.breeds = this.tmpPet.species.id === 1 ? BreedsModel.catBreeds : BreedsModel.dogBreeds;
    this.editForm = false;
    this.editPetAge = false;
    this.editPetName = false;
    this.editPetBreed = false;
    this.petName.error = false;
    this.breedError = false;
    this.petAgeString = this.tmpPet.age(this.quote.policyStartDate);
    this.cancelEdit.emit();
    if (this.tmpPet.species.id === 1) {
      this.petAnimation.startCat();
    } else {
      this.petAnimation.startDog();
    }
  }
  editAge(): void {
    this.editPetAge = true;
    this.tmpPet.ageDob = null;
    this.tmpPet.ageAproxValue = "";
    this.tmpPet.ageAproxType = {label: "years", id: 1};
    this.tmpPet.dontKnowAge = false;

    const focusInput: any = () => {
      this.petAge.inputDay.nativeElement.focus();
    };
    this.validate();
    setTimeout(focusInput, 100);
  }
  updateAge(date: string = ""): void {
    this.tmpPet.ageDob = null;
    if (date !== "" && !this.tmpPet.dontKnowAge) {
      const ageArray: Array<string> = date.split("/");
      this.tmpPet.ageDob = new Date(Number(ageArray[2]), Number(ageArray[1]) - 1, Number(ageArray[0]));
      this.validateAge();
      if (this.ageError) {
          return;
      }
    }
    if (this.tmpPet.ageAproxValue !== undefined && this.tmpPet.dontKnowAge) {
      this.tmpPet.dontKnowAgeDate = this.componentService.getAproxAgeDate(this.tmpPet.ageAproxType.label, this.tmpPet.ageAproxValue);
    }
    this.petAgeString = this.tmpPet.age(this.quote.policyStartDate);
    this.validate();
  }
/*   updateAgeOld(date: string = ""): void {
    this.tmpPet.ageDob = null;
    if (date !== "") {
      if (!this.tmpPet.dontKnowAge) {
        const ageArray: Array<string> = date.split("/");
        this.tmpPet.ageDob = new Date(Number(ageArray[2]), Number(ageArray[1]) - 1, Number(ageArray[0]));
        this.validateAge();
        if (this.ageError) {
          return;
        }
      }
    }
    let age: Date = new Date();
    // eslint-disable-next-line max-len
    if ((!this.tmpPet.dontKnowAge && (this.tmpPet.ageDob !== null)) ||
    (this.tmpPet.dontKnowAge && this.tmpPet.ageAproxValue !== undefined)) {
      if (this.tmpPet.dontKnowAge) {
        if (this.tmpPet.ageAproxType.label === "days") {
          age.setDate(age.getDate() - Number(this.tmpPet.ageAproxValue));
        } else if (this.tmpPet.ageAproxType.label === "weeks") {
          age.setDate(age.getDate() - (Number(this.tmpPet.ageAproxValue) * 7));
        } else if (this.tmpPet.ageAproxType.label === "months") {
          let days: number = 0;
          let month: number = age.getMonth();
          let year: number = age.getFullYear();
          for (let months: number = Number(this.tmpPet.ageAproxValue); months > 0; months--) {
            month--;
            if (month <= -1) {
              year--;
              month = 11;
            }
            days += new Date(year, month, 0).getDate();
          }
          age.setDate(age.getDate() - days);
        } else if (this.tmpPet.ageAproxType.label === "years") {
          age.setFullYear( age.getFullYear() - Number(this.tmpPet.ageAproxValue));
        }
        this.tmpPet.dontKnowAgeDate = age;
      } else {
        age = this.tmpPet.ageDob;
      }
    }
    this.petAgeString = this.tmpPet.age(this.quote.policyStartDate);
    this.validate();
  } */
  editBreed(): void {
    this.editPetBreed = true;
    this.tmpPet.breed = new BreedsModel("", "", "", "", -1);
    const focusInput: any = () => {
      this.petBreed.tabIn(true);
    };
    setTimeout(focusInput, 100);
    this.tracking.formInteract(1, "edit_pet_breed");
  }
  validateBreed(): void {
    this.breedError = false;
    if (this.tmpPet.breed.id === -1) {
      this.breedError = true;
    }
  }
  validateAge(): void {
    this.ageError = false;
    if (!this.tmpPet.dontKnowAge) {
      const dateAge: DateAge = new DateAge(this.tmpPet.ageDob);
      if (this.tmpPet.species.id === 1) {
        if (dateAge.weeks > 2087) {
          this.ageError = true;
        }
      }
      if (this.tmpPet.species.id === 2) {
        if (dateAge.weeks > 1565) {
          this.ageError = true;
        }
      }
      if (this.tmpPet.ageDob == null || this.tmpPet.ageDob.getFullYear() === 0 || this.tmpPet.ageDob.getFullYear() === 1900) {
        this.ageError = true;
      }
    }
    this.tmpPet.getAgeMessage(this.quote.policyStartDate);
    if (this.tmpPet.overPetCareLimit) {
      this.tmpPet.selectedPlan = "";
      this.tmpPet.selectedPlanOptions.clear();
    }
  }
  validate(): void {
    this.validateAge();

    this.disableSave = false;
    if (this.tmpPet.isTooOld) {
      this.disableSave = true;
    }
    if (JSON.stringify(this.quote.pets[this.index].clone()) === JSON.stringify(this.tmpPet)) {
      this.disableSave = true;
    }
    if (this.tmpPet.name.trim() === "") {
      this.disableSave = true;
    }
    if (this.tmpPet.breed.id === -1) {
      this.disableSave = true;
    }
    if (this.tmpPet.dontKnowAge) {
      if (this.tmpPet.ageAproxType.id === 0 || this.tmpPet.ageAproxValue === "") {
        this.disableSave = true;
      }
    } else {
      if (this.tmpPet.ageDob == null) {
        this.disableSave = true;
      }
    }
    this.tmpPet.getAgeMessage(this.quote.policyStartDate);
    if (this.tmpPet.isTooYoung ||  this.ageError) {
      this.disableSave = true;
    }
    this.cdr.detectChanges();
  }
  tabIn(input: any): void {
    this.focus = input;
  }
  tabOut(): void {
    this.focus = null;
  }
  keydown(e: any, input: any): void {
    switch (e.keyCode) {
      case 37: // left
        if (input === "species") { this.dog(e); }
        if (input === "sex") { this.male(e); }
        break;
      case 39: // right
        if (input === "species") { this.cat(e); }
        if (input === "sex") { this.female(e); }
        break;
    }
  }
  tabInAge(): void  {
    this.focusAge = true;
  }
  tabOutAge(): void  {
    this.focusAge = false;
  }
  keydownAge(e: any): void  {

    switch (e.keyCode) {
      case 37: // left
        if (this.tmpPet.ageAproxType.id > 1) {
          this.tmpPet.ageAproxType.id--;
        }
        break;
      case 39: // right
        if (this.tmpPet.ageAproxType.id < 3) {
          this.tmpPet.ageAproxType.id++;
        }
        break;
    }
  }
}
