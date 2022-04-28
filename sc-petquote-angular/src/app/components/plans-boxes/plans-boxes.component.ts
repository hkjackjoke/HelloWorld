import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ViewEncapsulation, AfterViewInit,
  ChangeDetectorRef } from "@angular/core";
import { Pet } from "src/app/models/pet.model";
import { PetAnimationComponent } from "../pet-animation/pet-animation.component";

import { Plan } from "src/app/models/plan.model";
import { QuoteModel } from "src/app/models/quote.model";
declare var $: any;

@Component({
  selector: "app-plans-boxes",
  templateUrl: "./plans-boxes.component.html",
  styleUrls: ["./plans-boxes.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PlansBoxesComponent implements OnInit, AfterViewInit {
  public petname: string;
  public petcarecharge = "";
  public accipetcharge = "";
  public petcareButton = "Choose PetCare";
  public accipetButton = "Choose AcciPet";
  public nameClass = "";
  public perValue = "month";
  @Output() selectPlan = new EventEmitter<any>();
  @Input() value = "";
  @Input() plan: Plan;
  @Input() bouncePetCare = false;
  @Input() bounceAcciPet = false;
  @Input() pet: Pet;
  @Input() quote: QuoteModel;
  @Input() selectedColumn: string;
  @ViewChild("petAnimation", {static: true}) petAnimation: PetAnimationComponent;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.pet === undefined) {
      this.pet = new Pet();
    }
    this.quote = QuoteModel.getInstance();
    this.setPerValue();
  }
  ngAfterViewInit(): void  {
    this.nameClass = this.pet.name.length > 8 ? "smaller" : "";
    this.cdr.detectChanges();
  }
  public updateCharge(petcarevalue: any): void  {
    const a: any = petcarevalue.toString().split(".");
    const dollar: any  = a[0];
    if (a.length > 1) {
      if (a[1].length === 1) {
        a[1] += "0";
      }
    }
    const cents: any  = a.length > 1 ? a[1]  :  "00";
    this.petcarecharge = "<sup class=\"symbol\">$</sup>" + dollar + "<sup class=\"decimal\">." + cents + "</sup>";
    this.setPerValue();
  }
  public setPerValue(): void  {
      switch (this.quote.paymentFrequency.Code) {
          case "HALFYEARLY":
            this.perValue = "6 months";
            break;
          case "MONTHLY":
            this.perValue = "month";
            break;
          case "QUARTERLY":
            this.perValue = "quarter";
            break;
          case "YEARLY":
            this.perValue = "year";
            break;
      }
  }
  public updateAccipetCharge(accipetvalue: any): void  {
    const b: any = accipetvalue.toString().split(".");
    const dollar: any = b[0];
    if (b[1].length === 1) {
      b[1] += "0";
    }
    const cents: any = b.length > 1 ? b[1]  :  "00";
    this.accipetcharge = "<sup class=\"symbol\">$</sup>" + dollar + "<sup class=\"decimal\">." + cents + "</sup>";
  }
  public stopPetAnimation(): void {
    this.petAnimation.stopPetAnimation();
  }

  public updatePetAnimation(species: string = ""): void {
    this.petAnimation.resetAnimation(species);
  }
  setValue(value: string): void {
    if (this.pet.overPetCareLimit && value === "petcare") {
      return;
    }
    this.value = value;
    this.setButtonLabels(value);
    this.selectPlan.emit(this.value);
  }
  public setButtonLabels(value: string): void {
    this.petcareButton = value === "petcare" ? "You chose PetCare" : "Choose PetCare";
    this.accipetButton = value === "accipet" ? "You chose AcciPet" : "Choose AcciPet";

  }
  public choosePlanMobile(): void {
    if (this.pet.overPetCareLimit && this.selectedColumn === "col-1") {
      return;
    }
    switch (this.selectedColumn) {
      case "col-1":
        this.value = "petcare";
        break;
      case "col-2":
        this.value = "accipet";
        break;
    }
    this.selectPlan.emit(this.value);
  }

}
