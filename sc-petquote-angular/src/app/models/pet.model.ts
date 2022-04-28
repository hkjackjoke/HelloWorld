import {Plan} from "./plan.model";
import {PetQuote} from "./pet-quote.model";
import {CopyModel} from "./copy.model";
import {HealthDeclaration} from "./health-declaration.model";
import { BreedsModel } from "./breeds.model";
import { QuoteAnimalModel } from "./quote.animal.model";
import { VetsModel } from "./vets.model";
import { DateAge } from "../helpers/DateAge";
import { PlansListItemOption } from "./plans-list.model";
import { QuoteResultModel } from "./quote.result.model";

export class Pet {

  public species: any = {label: "&nbsp;", id: 0};
  public gender: any = {label: "&nbsp;", id: 0};
  public name = "";
  public breed = new BreedsModel("", "", "", "", -1);
  public ageDob: Date;
  public dontKnowAgeDate: Date;
  public ageAproxValue: string | number;
  public ageAproxType: any = {label: "&nbsp;", id: 0};
  public dontKnowAge: boolean;
  public overPetCareLimit = false;

  public plan: Plan = new Plan();
  public quote: PetQuote = new PetQuote();
  public animalQuote: QuoteAnimalModel;
  public quoteResult: QuoteResultModel;
  public quoteAccipetResult: QuoteResultModel;
  public selectedPlanOptions = new Map<string, PlansListItemOption>();
  public seizures: boolean;
  public fractures: boolean;
  public analGlandConditions: boolean;
  public lameness: boolean;
  public vomitingDiarrhoea: boolean;
  public skinEyeEarConditions: boolean;
  public injuriesAnimalFights: boolean;
  public otherDetails = "";
  public preExistingConditions: boolean;
  public preExistingConditionsText = "";
  public lamenessDeclaration: HealthDeclaration = new HealthDeclaration();
  public vomitingDiarrhoeaDeclaration: HealthDeclaration = new HealthDeclaration();
  public skinEyeEarConditionsDeclaration: HealthDeclaration = new HealthDeclaration();
  public injuriesAnimalFightsDeclaration: HealthDeclaration = new HealthDeclaration();
  public regularVets = new VetsModel("", "", "", -1);
  public neverBeenToVet = false;
  public vetNotListed = false;
  public vetPracticeSame = false;
  public otherVetPractise = "";
  public declare: any;
  public ageMessage = "";
  public isTooYoung = false;
  public isTooOld = false;

  public selectedPlan = "";
  public selectedLimitName = "silver";
  public petcareCoPayment = true;
  public accipetCoPayment = true;
  public callAccipetQuote = true;
  public selectedPlanNo = 95;
  public selectedExcessNo = 179;

  isOverAgeLimit(policyStartDate: Date): boolean {
    const date: Date = this.dontKnowAge ? this.dontKnowAgeDate : this.ageDob;
    const ageValues: DateAge = new DateAge(date, policyStartDate);
    return ageValues.years >= 7 || (ageValues.years === 7 && this.dontKnowAge);
  }
  getAgeMessage(policyStartDate: Date): string {
      let message: string = "";
      this.overPetCareLimit = false;
      this.selectedPlan = "";
      if ( (this.dontKnowAge && (this.ageAproxValue == null || this.ageAproxValue === "" || this.ageAproxType.id === 0)) ||
          (this.ageDob == null && !this.dontKnowAge)) {
        return this.ageMessage = message;
      }
      const date: Date = this.dontKnowAge ? this.dontKnowAgeDate : this.ageDob;

      if (date.getFullYear() === 0 ||  date.getFullYear() === 1900) {
        message = "";
      } else {

        const ageValues: DateAge = new DateAge(date, policyStartDate);
        this.overPetCareLimit = this.isOverAgeLimit(policyStartDate);
        message = this.overPetCareLimit ?  "Just so you know, because " + this.name + " is older than 7 " +
        (this.gender.id === 1 ? "she" : "he") + " only qualifies for AcciPet cover" : "";

        this.isTooYoung = false;
        if (ageValues.weeks < 8) {
          this.isTooYoung = true;
          message = this.name + " is too young for us to fetch you a quote online.<br>Call us on <b>0800 800 836</b>.";
        }
        this.isTooOld = false;
        const dateAge: DateAge  = new DateAge(date);
        if (this.species.id === 1) {
          if (dateAge.weeks > 2087) {
            if (this.dontKnowAge) {
              message = "Maximium cat age 40 years";
            } else {
              message = "";
            }
            this.isTooOld = true;
          }
        }
        if (this.species.id === 2) {
          if (dateAge.weeks > 1565) {
            if (this.dontKnowAge) {
              message = "Maximium dog age 30 years";
            } else {
              message = "";
            }
            this.isTooOld = true;
          }
        }
      }
      return this.ageMessage = message;
  }
  age(policyStartDate: Date): string {
      let age: string = "";
      if (this.dontKnowAge) {
          age = "Approximately " + this.ageAproxValue + " " +
          (Number(this.ageAproxValue) > 1 ? this.ageAproxType.label :
          this.ageAproxType.label.substring(0, this.ageAproxType.label.length - 1));
      } else if (this.ageDob !== undefined && this.ageDob !== null) {
        policyStartDate.setHours(0, 0, 0, 1);
        this.ageDob.setHours(0, 0, 0, 1);
        const ageValues: DateAge  = new DateAge(this.ageDob, policyStartDate);
        if (ageValues.years) {
          age += ageValues.months > 0 ? (ageValues.days > 0 ? this.ageValue(ageValues.years, "year", ", ") :
          this.ageValue(ageValues.years, "year", " and ")) :
          ageValues.days > 0 ? this.ageValue(ageValues.years, "year", " and ") : this.ageValue(ageValues.years, "year");
        }
        if (ageValues.months) {
          age += ageValues.days > 0 ? this.ageValue(ageValues.months, "month", " and ") : this.ageValue(ageValues.months, "month");
        }
        if (ageValues.days) {
          age += this.ageValue(ageValues.days, "day");
        }
      }
      return age;
  }
  ageValue(value: number, type: string, trail: string = ""): string {
    return (value > 1 ? value.toString() +  " " + type + "s" : value.toString() + " " + type ) + trail;
  }
    chosenPlan(): string {
        const link: any = CopyModel.policyLinks[this.selectedPlan];
        let ribbon: string;
        const planName: string = this.selectedPlan === "accipet" ? "AcciPet" : "PetCare";
        if (this.selectedPlan === "accipet") {
          ribbon = "";
        } else {
          switch (this.selectedLimitName) {
            case "blue":
              ribbon = "Blue";
              break;
            case "bronze":
              ribbon = "Bronze";
              break;
            case "silver":
              ribbon = "Silver";
              break;
            case "gold":
              ribbon = "Gold";
              break;
          }
        }
        // let amount  = '';
        // if (this.animalQuote !== undefined && this.animalQuote !== null) {
        //   amount = ' - $' + this.animalQuote.total.toFixed(2);
        // }
        return "<a href=\"" + link + "\" target=\"blank\">" + planName +
        "</a>" + (ribbon !== "" ? " <span class=\"grey\">(" + ribbon + " Ribbon)</span>" : "");
    }
    annualBenefit(): string {
      if (this.selectedPlan === "accipet") {
        return "$5,000";
      } else {
        switch (this.selectedLimitName) {
          case "bronze":
              return "$2,500";
          case "silver":
              return "$5,000";
          case "gold":
              return "$10,000";
          case "blue":
              return "$15,000";
        }
      }
      return "$2,500";
    }
    coPayment(): string {
      if (this.selectedPlan === "accipet") {
          return this.accipetCoPayment ? "20% Co-payment applied" : "0% Co-payment applied";
      }
      return this.petcareCoPayment ? "20% Co-payment applied" : "0% Co-payment applied";
    }
    clone(): Pet {
        const pet: Pet  = new Pet();
        for (const key of Object.keys(this)) {
          pet[key] = this[key];
        }
        return pet;
    }
}

