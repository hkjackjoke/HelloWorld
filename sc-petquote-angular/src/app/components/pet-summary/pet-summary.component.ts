import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Pet } from "src/app/models/pet.model";
import { QuoteModel } from "src/app/models/quote.model";
import { Router } from "@angular/router";
import { QuoteAnimalProduct } from "src/app/models/quote.animal.product.model";
import { QuoteProductOptionModel } from "src/app/models/quote.product.option.model";
import { QuoteProductLoadingModel } from "src/app/models/quote.product.loading.model";
import { TrackingService } from "src/app/services/tracking.service";

@Component({
  selector: "app-pet-summary",
  templateUrl: "./pet-summary.component.html",
  styleUrls: ["./pet-summary.component.scss"]
})
export class PetSummaryComponent implements OnInit {
  @Input() public pet: Pet;
  @Input() public titleStart = "Quote";
  @Input() public showHealthDeclaration = false;
  @Input() public index: number;
  @Output() public removePet = new EventEmitter<any>();
  @Output() public editPet = new EventEmitter<any>();
  @Output() public editPetHealth = new EventEmitter<any>();
  public quote = QuoteModel.getInstance();
  public basePremiumTotal: number;
  public basePremium: number;
  public total: number;
  public discountTotal: number;

  public premiumDollar: string;
  public premiumCents: string;
  public premiumPlusDollar: string;
  public premiumPlusCents: string;
  public discountDollar: string;
  public discountCents: string;
  public totalDollar: string;
  public totalCents: string;
  public regularVetName = "None";
  public showMore = false;
  public extas: Array<string>;
  public discountSummary: Array<string>;
  public extasPremiums: Array<string>;
  constructor(private router: Router, private tracking:TrackingService) {
  }

  ngOnInit(): void {
    this.setValues();
  }
  public setValues(): void {
    this.extas = new Array<string>();
    this.discountSummary = new Array<string>();
    this.extasPremiums = new Array<string>();
    this.total = this.pet.animalQuote.total;
    this.discountTotal = 0;
    this.pet.animalQuote.products.forEach((product: QuoteAnimalProduct, index: number) => {
      this.basePremium = product.basePremium;
      this.basePremiumTotal = product.basePremium;
      product.options.forEach((option: QuoteProductOptionModel, index2: number) => {
        switch (option.optionCode) {
          case "DAY2DAY":
            this.extas.push(this.jsUcfirst(option.description));
            this.extasPremiums.push("$" + option.premium.toFixed(2) + " " + option.description);
            this.basePremiumTotal += option.premium;
            break;
          case "DENTAL":
            this.extas.push(this.jsUcfirst(option.description));
            this.extasPremiums.push("$" + option.premium.toFixed(2) + " " + option.description);
            this.basePremiumTotal += option.premium;
            break;
        }
      });
      product.loadings.forEach((loading: QuoteProductLoadingModel, index3: number) => {
        if (loading.calculatedLoadingAmount > 0) {
          this.basePremiumTotal += loading.calculatedLoadingAmount;
        } else {
          if (loading.loading === 0.0) {
           // this.discountSummary.push(loading.description + ' - $' + Math.abs(loading.loadingAmount));
           // this.discountTotal += Math.abs(loading.loadingAmount);
           // this.discountSummary.push(loading.description + ' - ' + Math.abs(loading.loading) + '%');
            this.discountSummary.push(loading.description + " - $" + Math.abs(loading.loadingAmount));
            this.discountTotal += Math.abs(loading.calculatedLoadingAmount);
          } else {
            this.discountSummary.push(loading.description + " - " + Math.abs(loading.loading) + "%");
            this.discountTotal += Math.abs(loading.calculatedLoadingAmount);
          }
        }
      });
      if (this.discountSummary.length === 0) {
        this.discountSummary.push("None added");
      }
    });
    const a: any = this.basePremiumTotal.toFixed(2).split(".");
    const b: any = this.discountTotal.toFixed(2).split(".");
    const c: any = this.total.toFixed(2).split(".");
    this.premiumDollar = a[0];
    this.premiumCents = a[1];
    this.discountDollar = b[0];
    this.discountCents = b[1];
    this.totalDollar = c[0];
    this.totalCents = c[1];
    if (this.pet.vetNotListed) {
      this.regularVetName = this.pet.otherVetPractise;
    } else if (this.pet.neverBeenToVet || this.pet.regularVets === null || this.pet.regularVets === undefined) {
      this.regularVetName = "None";
    } else {
      this.regularVetName = this.pet.regularVets.id === -1 ? "None" : this.pet.regularVets.label;
    }
  }
  public jsUcfirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
  }
  public toggleShowMore(): void {
    this.showMore = !this.showMore;
    this.tracking.push({
      event: "select_content",
      event_info: {
        category: "Quote and apply",
        action: "Quote summary",
        content_type: this.showMore ? "accordion expand" : "accordion collapse",
        label_1: this.showMore ? "Show more" : "Show Less"
      }
    });
  }
  public edit(): void {
    this.tracking.push({
      event: "select_content",
      event_info: {
        category: "Quote and apply",
        action: "Quote summary",
        content_type: "button",
        label_1: "Edit"
      }
    });
    this.editPet.emit({index: this.index, pet: this.pet});
  }
  public editHealth(): void {
    this.editPetHealth.emit({index: this.index, pet: this.pet});
  }
  public remove(): void {
    this.tracking.push({
      event: "select_content",
      event_info: {
        category: "Quote and apply",
        action: "Quote summary",
        content_type: "button",
        label_1: "Remove"
      }
    });
    this.removePet.emit({index: this.index, pet: this.pet});
  }
}
