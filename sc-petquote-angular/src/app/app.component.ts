import { Component, HostListener } from "@angular/core";
import { QuoteModel } from "./models/quote.model";
import { ScrollToPlugin } from "gsap/all";
import { Router, NavigationStart, NavigationEnd, NavigationError } from "@angular/router";
import { AjaxService } from "./services/ajax.service";
import { CopyModel } from "./models/copy.model";
import { PaymentFrequencyModel } from "./models/payment.frequency.model";
import { TitlesModel } from "./models/titles.model";
import { VetsModel } from "./models/vets.model";
import { ReferralModel } from "./models/referral.model";
import { PaymentMethodModel } from "./models/payment.method.model";
import { InitialStateModel } from "./models/initial.state.model";
import { BreedsModel } from "./models/breeds.model";
import { ComponentService } from "./services/component.service";
import { PlansListModel } from "./models/plans-list.model";
import { MessageService } from "./services/message.service";
import { TrackingService } from "./services/tracking.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  static quote: QuoteModel;
  static stateHasBeenRestored = false;
  public menuOpen = false;
  public appReady = false;
  public timerId: any;
  public currentUrl: string;
  public timeOutTime = 900000;
  // public timeOutTime = 10000;


  constructor(
    private router: Router,
    private ajaxService: AjaxService,
    private messageService: MessageService,
    private componentService: ComponentService,
    private tracking: TrackingService) {


    AppComponent.quote = QuoteModel.getInstance();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (this.currentUrl === "/apply/submit" && event.url.indexOf("/apply/payment") !== -1) {
          window.location.href = "/quote";
        }
      }
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
      // if (event instanceof NavigationError) {

      // }
    });

    // @ts-ignore
    window.ScrollToPlugin = ScrollToPlugin;
    this.componentService.greenBanner();
    this.ajaxService.initialState().subscribe((state: InitialStateModel) => {
      if (state.exisitingApplication) {
        AppComponent.quote.paymentDeclined = state.paymentError;
        this.asyncLoadData(true);
        if (state.timeOut) {
          this.componentService.timeOutModal();
        }
      } else {
        this.asyncLoadData();
        if (AppComponent.quote.pets.length === 0) {
          router.navigate([""]).then(() => {
            if (state.timeOut) {
              this.componentService.timeOutModal();
            }
          });
        }
      }
    });
  }
  @HostListener("window:mousedown", ["$event"])
  onWindowMouseDown(event: any): void {
    this.setTimer();
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event: any): void  {
    this.setTimer();
  }
  public setTimer(): void  {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      window.location.href = "/quote/?timeout=true";
    }, this.timeOutTime);
  }

  public checkAppReady(restoreState: boolean = false): boolean {
    if (AppComponent.quote.planConfig === undefined) {
      return false;
    }
    if (CopyModel.paymentFrequency === undefined) {
      return false;
    }
    if (CopyModel.titles === undefined) {
      return false;
    }
    if (CopyModel.vetsList === undefined) {
      return false;
    }
    if (CopyModel.referrals === undefined) {
      return false;
    }
    if (CopyModel.paymentMethods === undefined) {
      return false;
    }
    if (CopyModel.allBreeds === undefined) {
      return false;
    }
    if (CopyModel.plansList === undefined) {
      return false;
    }
    this.componentService.destroyLoading();
    this.setTimer();
    if (restoreState) {
      this.ajaxService.applicationState().subscribe(() => {
        if (AppComponent.quote.paymentDeclined && AppComponent.quote.paymentMethod.Code === "DD") {
          window.location.href = "/quote";
        } else {
          AppComponent.stateHasBeenRestored = true;
          this.appReady = true;
        }
      },
        (err: any) => {
          this.ajaxService.handleError("Ajax retrieve application state error", err);
        });
    } else {
      return true;
    }
  }
  public asyncLoadData(restoreState: boolean = false): void  {
    this.componentService.loadingNotification("Loading initial data");
    const startDate: Date = new Date();
    startDate.setDate(startDate.getDate() + 1);
    AppComponent.quote.policyStartDate = startDate;
    this.ajaxService.plansConfig().subscribe((value: Map<string, number>) => {
      AppComponent.quote.planConfig = value;
      AppComponent.quote.selectedPlanNo = value.get("silver");
      AppComponent.quote.selectedExcessNo = value.get("silver-excess-yes");
      AppComponent.quote.selectedAcciPetExcessNo = value.get("accipet-excess-yes");
      this.appReady = this.checkAppReady(restoreState);
    });
    this.ajaxService.paymentFrequency().subscribe((value: PaymentFrequencyModel[]) => {
      CopyModel.paymentFrequency = value;
      value.forEach((method: PaymentFrequencyModel, index: number) => {
        if (method.Code === "MONTHLY") {
          AppComponent.quote.paymentFrequency = method;
        }
      });
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load payment frequency error", err);
      });
    this.ajaxService.titles().subscribe((value: TitlesModel[]) => {
      CopyModel.titles = value;
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load titkes error", err);
      });
    this.ajaxService.vets().subscribe((value: VetsModel[]) => {
      CopyModel.vetsList = value;
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load vets error", err);
      });
    this.ajaxService.referrals().subscribe((value: ReferralModel[]) => {
      CopyModel.referrals = value;
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load referrals error", err);
      });
    this.ajaxService.paymentMethods().subscribe((value: PaymentMethodModel[]) => {
      CopyModel.paymentMethods = value;
      value.forEach((method: PaymentMethodModel, index: number) => {
        if (method.Code === "DD") {
          AppComponent.quote.paymentMethod = method;
        }
      });
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load payment methods error", err);
      });
    BreedsModel.catBreeds = new Array<BreedsModel>();
    BreedsModel.dogBreeds = new Array<BreedsModel>();
    CopyModel.allBreeds = new Array<BreedsModel>();
    this.ajaxService.breeds().subscribe((breeds: BreedsModel[]) => {
      breeds.forEach((breed: BreedsModel, index: number) => {
        breed.Species === "DOG" ? BreedsModel.dogBreeds.push(breed) : BreedsModel.catBreeds.push(breed);
        CopyModel.allBreeds.push(breed);
      });
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load breeds error", err);
      });

    this.ajaxService.plans(CopyModel.dateToString(AppComponent.quote.policyStartDate)).subscribe((plansList: PlansListModel) => {
      CopyModel.plansList = plansList;
      this.appReady = this.checkAppReady(restoreState);
    },
      (err: any) => {
        this.ajaxService.handleError("Ajax load breeds error", err);
      });
  }
  public toggleMenu(menuOpen: boolean): void {
    this.menuOpen = menuOpen;
  }
}
