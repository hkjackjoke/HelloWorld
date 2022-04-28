import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from "@angular/core";
import {QuoteModel } from "../../models/quote.model";
import { ValidateModel } from "src/app/models/validate.model";
import { Router } from "@angular/router";
import { Pet } from "src/app/models/pet.model";
import { CopyModel } from "src/app/models/copy.model";
import { Subscription } from "rxjs";
import { MessageService } from "src/app/services/message.service";
import { PlansBoxesComponent } from "src/app/components/plans-boxes/plans-boxes.component";
import { Plan } from "src/app/models/plan.model";
import { AjaxService } from "src/app/services/ajax.service";
import { QuoteResultModel } from "src/app/models/quote.result.model";
import { QuoteAnimalModel } from "src/app/models/quote.animal.model";
import { QuoteAnimalProduct } from "src/app/models/quote.animal.product.model";
import { QuoteProductOptionModel } from "src/app/models/quote.product.option.model";
import { ComponentService } from "src/app/services/component.service";
import { PlansListItemOption } from "src/app/models/plans-list.model";
import { TrackingService } from "src/app/services/tracking.service";
import { QuoteBodyModel } from "src/app/models/quote.body.model";
declare var TweenMax: any;
declare var Quart: any;


@Component({
  selector: "app-choose-plan",
  templateUrl: "./choose-plan.component.html",
  styleUrls: ["./choose-plan.component.scss"]
})
export class ChoosePlanComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild("choosePlan", {static: true}) public choosePlan: ElementRef;
  @ViewChild("petPlans", {static: true}) public petPlans: ElementRef;
  @ViewChild("policyPayment", {static: true}) public policyPayment: ElementRef;
  @ViewChild("topPlanBox", {static: true}) public topPlanBox: PlansBoxesComponent;

  public quote: QuoteModel;
  public petIndex = 0;
  public currentPet: Pet;
  public plan: Plan;
  public selectedLimit = 3;
  public complete = false;
  public planSelected = false;
  public nextLabel = "Next";
  public editFromLabel = "";
  public showDatePayment = false;
  public editFrom = "";
  public disablePetCare = "";
  public subscription: Subscription;
  public selectedColumn = "col-1";
  public total = 0;
  public noticeCopy: string;
  public focusLimit = false;
  public trackLimitOnQuote = false;

  public petcarePreTotal: string;
  public accipetPreTotal: string;
  public dayToDayCarePrice: string;
  public dentalCarePrice: string;
  public selectedLimitName = "bronze";
  public bouncePetCare = false;
  public bounceAcciPet = false;
  public planLimits = ["bronze", "silver", "gold", "blue"];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private ajaxService: AjaxService,
    private componentService: ComponentService,
    private tracking: TrackingService
    ) {
      this.quote =  QuoteModel.getInstance();
      this.nextLabel = this.quote.pets.length > 1 ? "Next Pet" : "Next";
      this.subscription = this.messageService.getMessage().subscribe( message => {
        switch (message.id) {
          case MessageService.onBack:
            TweenMax.fromTo(this.choosePlan.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
              this.choosePlan.nativeElement.removeAttribute("style");
            }, ease: Quart.easeOut});
            break;
          case MessageService.editFrom:
            this.messageService.sendMessage(MessageService.scrollToTimeline);
            TweenMax.fromTo(this.choosePlan.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
              this.choosePlan.nativeElement.removeAttribute("style");
              this.scrollToPaymentMethod();
            }, ease: Quart.easeOut});
            this.editFrom = message.body;
            this.nextLabel = "Back to summary";
            this.editFromLabel = "Back to summary";
            this.petIndex = this.quote.pets.length - 1;
            this.showDatePayment = true;
            break;
          case MessageService.editPet:
            this.messageService.sendMessage(MessageService.scrollToTimeline);
            TweenMax.fromTo(this.choosePlan.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
              this.choosePlan.nativeElement.removeAttribute("style");
            }, ease: Quart.easeOut});
            this.currentPet = message.body.pet;
            this.petIndex = message.body.petIndex;
            this.editFrom = message.body.from;
            this.nextLabel = "Back to summary";
            this.editFromLabel = "Back to summary";
            break;
          case MessageService.onNext:
            TweenMax.fromTo(this.choosePlan.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
              this.choosePlan.nativeElement.removeAttribute("style");
            }, ease: Quart.easeOut});
            break;
        }
      });

  }

  ngOnInit(): void {
    this.tracking.virtualPageView("/choose-a-plan", "Choose a Plan");
    this.tracking.whenPageLoads();
    if (this.quote.pets.length) {
      this.currentPet = this.quote.pets[this.petIndex];
      if (this.quote.pets[this.petIndex].selectedPlan) {
        if (this.quote.pets.length === 1) {
          this.showDatePayment = true;
        }
        this.planSelected = true;
        this.topPlanBox.setButtonLabels(this.quote.pets[this.petIndex].selectedPlan);
      }
    } else {
      this.currentPet = new Pet();
    }
    this.validate();
    this.noticeCopy = CopyModel.planSummaryNotice;
    this.setMobileSelectedColumn();
    this.topPlanBox.updatePetAnimation(this.currentPet.species.id === 1 ? "cat" : "dog");
    this.componentService.setGreenBannerSlide("");
    if (this.quote.pets[this.petIndex].selectedPlan === "petcare") {
      this.selectLimit(this.quote.pets[this.petIndex].selectedLimitName, false, false);
    } else {
      this.loadQuote();
    }
    this.disablePetCare = this.quote.pets[this.petIndex].overPetCareLimit ? "disable-petcare" : "";

  }
  ngAfterViewInit(): void {
    this.validate();
  }
  scrollToPaymentMethod(): void  {
    let offset: any = this.getPosition(this.policyPayment.nativeElement as HTMLDivElement).y;
    offset -= window.innerWidth > 768 ? 44 : 0;
    offset -= 138;
    this.componentService.scrollTo(offset);
  }
  setMobileSelectedColumn(): void  {
    if (this.quote.pets[this.petIndex].overPetCareLimit || this.quote.pets[this.petIndex].selectedPlan === "accipet") {
      this.selectedColumn = "col-2";
    } else {
      this.selectedColumn = "col-1";
    }
  }
  loadQuote(selectValue: string = ""): void  {
    this.componentService.loadingNotification("Loading quote data");
    if (selectValue === "" || selectValue === "petcare" && !this.quote.pets[this.petIndex].overPetCareLimit) {
      const bodyA: QuoteBodyModel = this.quote.quoteBody(this.quote.selectedPlanNo, this.quote.selectedExcessNo, this.petIndex);

      this.ajaxService.getQuote(bodyA).subscribe((quoteValue: QuoteResultModel) => {
        this.quote.quoteResultModel = quoteValue;
        this.componentService.destroyLoading();
        quoteValue.Animals.forEach((pet: QuoteAnimalModel, index: number) => {
          this.petcarePreTotal = pet.total.toFixed(2);
          this.dayToDayCarePrice = "";
          this.dentalCarePrice = "";
          pet.products.forEach((product: QuoteAnimalProduct, i: number) => {
              product.options.forEach((option: QuoteProductOptionModel, n: number) => {
                if (option.optionCode === "DAY2DAY") {
                  this.dayToDayCarePrice = this.quote.pets[this.petIndex].selectedPlanOptions.has("DAY2DAY") ?
                  "$" + option.premium.toFixed(2) + " added" : "";
                }
                if (option.optionCode === "DENTAL") {
                  this.dentalCarePrice = this.quote.pets[this.petIndex].selectedPlanOptions.has("DENTAL") ?
                  "$" + option.premium.toFixed(2) + " added" : "";
                }
              });
          });
          this.topPlanBox.updateCharge(quoteValue.Total);
          if (this.quote.pets[this.petIndex].selectedPlan === "petcare") {
            this.bouncePrice(this.quote.pets[this.petIndex].selectedPlan);
          }
          this.quote.pets[this.petIndex].quoteResult = quoteValue;
          if (this.trackLimitOnQuote) {
            this.trackLimitOnQuote = false;
            this.tracking.selectPlanLimit(this.petIndex);
          }
        });

      },
      (err: any) => {
        this.ajaxService.handleError("Load PetCare quote Error", err);
      }
      );
    }
    if (this.quote.pets[this.petIndex].overPetCareLimit && this.quote.pets[this.petIndex].selectedPlan === "accipet") {
      this.quote.pets[this.petIndex].selectedPlanNo = this.quote.planConfig.get("accipet");
      this.quote.pets[this.petIndex].selectedExcessNo = this.quote.selectedAcciPetExcessNo;
    }
    if (selectValue === "" || selectValue === "accipet") {
      const bodyB: QuoteBodyModel = this.quote.quoteBody(
        this.quote.planConfig.get("accipet"), this.quote.selectedAcciPetExcessNo, this.petIndex, false);
      this.ajaxService.getQuote(bodyB).subscribe((value: QuoteResultModel) => {
        this.quote.accipetQuote = value;
        this.componentService.destroyLoading();
        this.topPlanBox.updateAccipetCharge(value.Total);
        if (this.quote.pets[this.petIndex].selectedPlan === "accipet") {
          this.bouncePrice(this.quote.pets[this.petIndex].selectedPlan);
        }
        this.quote.pets[this.petIndex].quoteAccipetResult = value;
      },
      (err: any) => {
        this.ajaxService.handleError("Load AcciPet quote Error", err);
      });
    }
  }

  selectColumn(col: string): void {
    this.selectedColumn = col;
  }
  selectPlan(value: any): void {

    if (this.quote.pets[this.petIndex].overPetCareLimit && value === "petcare") {
      return;
    }
    if (this.quote.pets[this.petIndex].selectedPlan === value) {
      return;
    }

    this.componentService.setGreenBannerSlide("3");
    this.quote.pets[this.petIndex].selectedPlan = value;
    this.quote.pets[this.petIndex].callAccipetQuote = value === "accipet";
    this.selectedLimitName = this.quote.pets[this.petIndex].selectedLimitName;
    this.quote.selectedPlanNo = this.quote.planConfig.get(this.selectedLimitName);
    if (this.quote.pets[this.petIndex].overPetCareLimit) {
      this.quote.pets[this.petIndex].selectedPlanNo =  this.quote.planConfig.get("accipet");
    } else {
      this.quote.pets[this.petIndex].selectedPlanNo = value === "accipet" ?
      this.quote.planConfig.get("accipet") : this.quote.planConfig.get(this.selectedLimitName);
    }
    this.selectColumn(value === "accipet" ? "col-2" : "col-1");
    this.showDatePayment = this.petIndex === this.quote.pets.length - 1;
    this.tracking.planView(value, this.quote.pets[this.petIndex].selectedPlanNo);
    this.setExcessNo();
    this.validate();
    this.planSelected = true;
  }
  selectLimit(limitName: string, loadPetCareOnly: boolean = true, enableTracking: boolean = true): void {
    this.selectedLimitName = limitName;
    this.quote.selectedPlanNo = this.quote.planConfig.get(this.selectedLimitName);
    this.quote.pets[this.petIndex].selectedLimitName = limitName;
    this.quote.pets[this.petIndex].selectedPlanNo =  this.quote.selectedPlanNo;
    this.componentService.loadingNotification("Loading quote data");
    if(enableTracking){
      this.tracking.selectRadio("Choose a Limit","cover selection",this.getLimitTitle(limitName));
    }
    const options: Map<any,any> = CopyModel.getPlanOptions(this.quote.selectedPlanNo);
    if (this.quote.pets[this.petIndex].selectedPlanOptions.has("DAY2DAY")) {
      this.quote.pets[this.petIndex].selectedPlanOptions.set("DAY2DAY", options.get("DAY2DAY"));
    }
    if (this.quote.pets[this.petIndex].selectedPlanOptions.has("DENTAL")) {
      this.quote.pets[this.petIndex].selectedPlanOptions.set("DENTAL", options.get("DENTAL"));
    }
    this.setExcessNo();
    this.trackLimitOnQuote = true;
    if (loadPetCareOnly) {
      this.loadQuote("petcare");
    } else {
      this.loadQuote();
    }
  }
  getLimitTitle(limitName: string): string{
    switch(limitName){
      case "bronze":
        return "$2,500 a year (Bronze Ribbon)";
      case "silver":
        return "$5,000 a year (Silver Ribbon)";
      case "gold":
        return "$10,000 a year (Gold Ribbon)";
      case "blue":
        return "$15,000 a year (Blue Ribbon)";
    }
    return "$5,000 a year (Silver Ribbon)";
  }
  setExcessNo(): void  {
    const p: Pet = this.quote.pets[this.petIndex];
    const excessKey: string = p.selectedLimitName + (p.petcareCoPayment ? "-excess-yes" : "-excess-no");
    const acciPetExcessKey: string = "accipet" + (p.accipetCoPayment ? "-excess-yes" : "-excess-no");
    this.quote.selectedExcessNo = this.quote.planConfig.get(excessKey);
    this.quote.selectedAcciPetExcessNo = this.quote.planConfig.get(acciPetExcessKey);
    if (p.selectedPlan === "petcare") {
      this.quote.pets[this.petIndex].selectedExcessNo =  this.quote.selectedExcessNo;
    }
    if (p.selectedPlan === "accipet") {
      this.quote.pets[this.petIndex].selectedExcessNo =  this.quote.selectedAcciPetExcessNo;
    }
  }
  dayToDayCare(event: any): void {
    const options: Map<any,any> = CopyModel.getPlanOptions(this.quote.selectedPlanNo);
    this.tracking.selectCheckbox("Choose extras","cover selection","Day-to-day care extra", event.value ? "on" : "off");
    if (event.value) {
      if (!this.quote.pets[this.petIndex].selectedPlanOptions.has("DAY2DAY")) {
        this.quote.pets[this.petIndex].selectedPlanOptions.set("DAY2DAY", options.get("DAY2DAY"));
      }
    } else {
      this.quote.pets[this.petIndex].selectedPlanOptions.delete("DAY2DAY");
    }
    this.loadQuote("petcare");
  }
  dentalCare(event: any): void {
    const options: Map<any,any> = CopyModel.getPlanOptions(this.quote.selectedPlanNo);
    this.tracking.selectCheckbox("Choose extras","cover selection","Dental care extra", event.value ? "on" : "off");
    if (event.value) {
      if (!this.quote.pets[this.petIndex].selectedPlanOptions.has("DENTAL")) {
        this.quote.pets[this.petIndex].selectedPlanOptions.set("DENTAL", options.get("DENTAL"));
      }
    } else {
      this.quote.pets[this.petIndex].selectedPlanOptions.delete("DENTAL");
    }
    this.loadQuote("petcare");
  }
  addCoPayment(plan: string, isTrue: boolean): void {
    this.tracking.selectRadio("Co-payment","cover selection",isTrue ? "20% Co-payment" : "0% Co-payment");
    switch (plan) {
      case "petcare":
        this.quote.pets[this.petIndex].petcareCoPayment = isTrue;
        break;
      case "accipet":
        this.quote.pets[this.petIndex].accipetCoPayment = isTrue;
        break;
    }
    this.setExcessNo();
    this.loadQuote(plan);
    this.bouncePrice(plan);
  }
  bouncePrice(plan: any): void {
    switch (plan) {
      case "petcare":
        this.bouncePetCare = true;
        break;
      case "accipet":
        this.bounceAcciPet = true;
        break;
    }
    setTimeout(() => {
      this.bouncePetCare = false;
      this.bounceAcciPet = false;
    }, 100);
  }
  paymentMethodChanged(): void {
    this.loadQuote();
  }
  paymentFreqChanged(): void {
    this.loadQuote();
  }
  showCoPaymentModal(): void {
      this.componentService.coPaymentModal();
  }
  validatePolicyStartDate(): void {
    let hasChanged: boolean = false;
    let indexChanged: number = -1;
    this.quote.pets.forEach((pet: Pet, index: number) => {
      if (this.quote.pets[index].isOverAgeLimit(this.quote.policyStartDate)) {
        if (this.quote.pets[index].selectedPlan === "petcare" || this.quote.pets[index].selectedPlan === "") {
          hasChanged = true;
          this.quote.pets[index].selectedPlan = "";
          this.quote.pets[index].overPetCareLimit = true;
          this.quote.pets[index].selectedPlanNo =  0;
          this.quote.pets[index].selectedExcessNo = 0;
          if (indexChanged === -1) {
            indexChanged = index;
          }
        } else {
          this.quote.pets[index].overPetCareLimit = true;
          hasChanged = true;
        }
      } else {
        this.quote.pets[index].overPetCareLimit = false;
      }
    });
    this.currentPet = this.quote.pets[this.petIndex];
    if (hasChanged) {
      if (indexChanged < this.petIndex && this.quote.pets.length > 1) {
        this.back(indexChanged);
      } else {
        this.disablePetCare = this.currentPet.overPetCareLimit ? "disable-petcare" : "";
        if (this.currentPet.selectedPlan === "petcare") {
          this.loadQuote();
        }
      }
    } else {
      this.disablePetCare = this.currentPet.overPetCareLimit ? "disable-petcare" : "";
    }
    this.validate();
  }
  validate(): void {
    this.complete = true;
    if (this.quote.policyStartDate === null || this.quote.policyStartDate === undefined) {
      this.complete =  false;
      return;
    }
    if (this.quote.pets.length > 1 && this.petIndex === this.quote.pets.length - 1) {
      this.quote.pets.forEach((pet: Pet, index: number) => {
        if (pet.selectedPlan === "") {
          this.complete =  false;
        }
      });
    } else {
      if (this.quote.pets[this.petIndex].selectedPlan === "") {
        this.complete =  false;
      }
    }
    if ((this.petIndex + 1) === this.quote.pets.length) {
      const dateString: string = (String("00" + (this.quote.policyStartDate.getDate())).slice(-2)) + "/" +
      (String("00" + (this.quote.policyStartDate.getMonth() + 1)).slice(-2)) + "/" + this.quote.policyStartDate.getFullYear();
      this.complete = ValidateModel.validatePolicyStartDate(dateString) ? this.complete : false;
      this.complete = this.quote.paymentMethod !== null ? this.complete : false ;
    }
  }
  resetPetCareIds(): void {
    this.quote.selectedPlanNo = 95;
    this.quote.selectedExcessNo = 179;
    this.quote.selectedAcciPetExcessNo = 173;
  }
  resetLoadIds(): void {
    this.selectedLimitName = this.quote.pets[this.petIndex].selectedLimitName;
    if (this.quote.pets[this.petIndex].selectedPlan) {
      this.setExcessNo();
      if (this.quote.pets[this.petIndex].selectedPlan === "petcare") {
        this.quote.selectedPlanNo = this.quote.pets[this.petIndex].selectedPlanNo;
      } else {
        this.quote.selectedPlanNo = 95;
      }
    } else {
      this.resetPetCareIds();
    }
  }
  resetNonPetCare(): void {
    if (this.quote.pets[this.petIndex].selectedPlan === "accipet") {
      this.quote.pets[this.petIndex].selectedPlanOptions = new Map<string, PlansListItemOption>();
      this.quote.pets[this.petIndex].petcareCoPayment = true;
      this.quote.pets[this.petIndex].selectedLimitName = "silver";
      this.quote.selectedPlanNo = 95;
      this.quote.selectedExcessNo = 179;
    }
  }
  next(): void {
    if (this.petIndex < this.quote.pets.length - 1) {
      this.tracking.selectPlanNext(this.petIndex);
    }
    this.tracking.planSelectContentNext(this.petIndex,this.selectedLimitName);
    this.resetNonPetCare();
    let directdebitdiscount: boolean = false;
    let multipetdiscount: boolean = false;
    if (this.quote.paymentMethod.Code === "DD") {
      directdebitdiscount = true;
    }
    if (this.quote.pets.length > 1) {
      multipetdiscount = true;
    }
    if (this.editFrom !== "" && this.petIndex === this.quote.pets.length - 1) {
      this.componentService.loadingNotification("Loading quote data");
      this.ajaxService.getQuote(this.quote.quoteBody(0, 0, -1)).subscribe((quoteValue: QuoteResultModel) => {
        this.quote.quoteResultModel = quoteValue;
        quoteValue.Animals.forEach((pet: QuoteAnimalModel, index: number) => {
           this.quote.pets[index].animalQuote = pet;
        });
        this.componentService.destroyLoading();
        this.tracking.selectPlanNext(this.petIndex);
        TweenMax.to(this.choosePlan.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
          this.messageService.sendMessage(MessageService.scrollToTimeline);
          switch (this.editFrom) {
            case "apply-summary":
              this.router.navigate(["apply/summary"]).then( (e) => {
                this.messageService.sendMessage(MessageService.onNext);
              });
              break;
            case "quote-summary":
              this.router.navigate(["quote-summary"]).then( (e) => {
                this.messageService.sendMessage(MessageService.onNext);
              });
              break;
          }
        }, ease: Quart.easeOut});
      },
      (err: any) => {
        this.ajaxService.handleError("Load Get Quote Error", err);
      });
    } else {
      if (this.petIndex === this.quote.pets.length - 1) {
        if (this.quote.pets[this.petIndex].selectedPlan === "accipet") {
          this.resetPetCareIds();
        }
        this.componentService.loadingNotification("Loading quote data");
        this.ajaxService.getQuote(this.quote.quoteBody(0, 0, -1)).subscribe((quoteValue: QuoteResultModel) => {
          this.quote.quoteResultModel = quoteValue;
          quoteValue.Animals.forEach((pet: QuoteAnimalModel, index: number) => {
             this.quote.pets[index].animalQuote = pet;
          });
          this.componentService.destroyLoading();
          this.tracking.selectPlanNext(this.petIndex);
          this.componentService.setGreenBannerSlide("");
          TweenMax.to(this.choosePlan.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
            this.messageService.sendMessage(MessageService.scrollToTimeline);
            this.router.navigate(["quote-summary"]).then( (e) => {
              this.messageService.sendMessage(MessageService.onNext);
            });
          }, ease: Quart.easeOut});
        },
        (err: any) => {
          this.ajaxService.handleError("Load Get Quote Error", err);
        });
      } else {
        this.petIndex++;
        this.resetLoadIds();
        this.loadQuote();
        this.topPlanBox.stopPetAnimation();
        this.topPlanBox.setButtonLabels("");
        this.planSelected = false;

        TweenMax.to(this.petPlans.nativeElement, 0.5, {x: -100, opacity: 0, onComplete: () => {
          this.currentPet = this.quote.pets[this.petIndex];
          this.topPlanBox.setButtonLabels(this.currentPet.selectedPlan);
          this.planSelected = this.currentPet.selectedPlan !== "";
          this.disablePetCare = this.currentPet.overPetCareLimit ? "disable-petcare" : "";
          this.nextLabel = this.petIndex >= (this.quote.pets.length - 1) ?
          (this.editFrom !== "" ? this.editFromLabel : "Next") : "Next Pet";
          this.topPlanBox.updatePetAnimation(this.currentPet.species.id === 1 ? "cat" : "dog");
          this.messageService.sendMessage(MessageService.scrollToTimeline);
          this.setMobileSelectedColumn();
          this.checkShowPaymentDetails();
          TweenMax.fromTo(this.petPlans.nativeElement, 0.5, {x: 100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
            this.petPlans.nativeElement.removeAttribute("style");
            this.validate();
          }, ease: Quart.easeOut});
        }});
        return;
      }
    }
  }
  back(indexChanged: number = -1): void {
    this.resetNonPetCare();
    this.tracking.push({
      event: "select_content",
      event_info: {
          category: "Quote and apply",
          action: "Extra Discount | 3",
          content_name: "Back",
          content_type: "button"
      },
    });
    if (this.petIndex === 0) {
      TweenMax.to(this.choosePlan.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.router.navigate(["discount-qualification"]).then( (e) => {
          this.messageService.sendMessage(MessageService.onBack);
        });
      }, ease: Quart.easeOut});
    } else {
      this.topPlanBox.setButtonLabels("");
      if (indexChanged !== -1) {
        this.petIndex = indexChanged;
      } else {
        this.petIndex--;
      }
      this.complete = true;
      this.resetLoadIds();
      this.loadQuote();
      this.topPlanBox.stopPetAnimation();
      TweenMax.to(this.petPlans.nativeElement, 0.5, {x: 100, opacity: 0, onComplete: () => {
        this.quote.pets[this.petIndex].overPetCareLimit = this.quote.pets[this.petIndex].isOverAgeLimit(this.quote.policyStartDate);
        this.currentPet = this.quote.pets[this.petIndex];
        this.topPlanBox.setButtonLabels(this.currentPet.selectedPlan);
        this.disablePetCare =  this.currentPet.overPetCareLimit ? "disable-petcare" : "";
        this.nextLabel = this.petIndex >= (this.quote.pets.length - 1) ? "Next" : "Next Pet";
        this.checkShowPaymentDetails();
        this.messageService.sendMessage(MessageService.scrollToTimeline);
        this.setMobileSelectedColumn();
        window.setTimeout(() => {
          this.topPlanBox.updatePetAnimation(this.currentPet.species.id === 1 ? "cat" : "dog");
        }, 0.5);
        TweenMax.fromTo(this.petPlans.nativeElement, 0.5, {x: -100, opacity: 0}, {x: 0, opacity: 1, onComplete: () => {
          this.petPlans.nativeElement.removeAttribute("style");
        }, ease: Quart.easeOut});
      }});
    }
  }
  checkShowPaymentDetails(): void {
    this.showDatePayment = false;
    if (this.quote.pets[this.petIndex].selectedPlan) {
      if ( this.petIndex === this.quote.pets.length - 1) {
        this.showDatePayment = true;
      }
    }
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  tabInLimit(): void  {
    this.focusLimit = true;
  }
  tabOutLimit(): void  {
    this.focusLimit = false;
  }
  keydownLimit(e: any): void  {
    let index: number;
    this.planLimits.forEach((value: string, i: number) => {
      index = value === this.currentPet.selectedLimitName ? i : index;
    });
    switch (e.keyCode) {
      case 38: // up
        if (( index - 1) < 0) {
          return;
        }
        this.selectLimit(this.planLimits[index - 1]);
        break;
      case 40: // down
        if ((index + 1) > this.planLimits.length) {
          return;
        }
        this.selectLimit(this.planLimits[index + 1]);
        break;
    }
  }
}
