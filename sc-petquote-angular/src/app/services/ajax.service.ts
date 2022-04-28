import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";
import { BreedsModel } from "../models/breeds.model";

import { ReferralModel } from "../models/referral.model";
import { QuoteBodyModel } from "../models/quote.body.model";
import { HttpClient } from "@angular/common/http";
import { PaymentFrequencyModel } from "../models/payment.frequency.model";
import { TitlesModel } from "../models/titles.model";
import { VetsModel } from "../models/vets.model";
import { PaymentMethodModel } from "../models/payment.method.model";
import { PlanOptionModel } from "../models/plan.option.model";
import { QuoteResultModel } from "../models/quote.result.model";
import { EmailBodyModel } from "../models/email.body.model";
import { QuoteModel } from "../models/quote.model";
import { AddressSearchResponse } from "../models/address.search.response";
import { AddressSearchResponseAddress } from "../models/address.search.reponse.address";
import { AddressSelectResponse } from "../models/address.selected.response";
import { QuoteAnimalModel } from "../models/quote.animal.model";
import { InitialStateModel } from "../models/initial.state.model";
import { ApplicationBodyModel } from "../models/application.body.model";
import { Router } from "@angular/router";
import { CopyModel } from "../models/copy.model";
import "url-search-params-polyfill";
import { ComponentService } from "./component.service";
import { PlansListModel } from "../models/plans-list.model";

// this JSON file stores strinngs used through out the site. And the various Plan ID's.
import ConfigData from "../data/pet-quote.config.json";

// all this below is dummy date I use to replicate responses from API calls.
import AllBreeds from "../data/breeds.json";
import Referrals from "../data/referral.json";
import PayFreq from "../data/payment-frequency.json";
import Titles from "../data/titles.json";
import Vets from "../data/vets.json";
import PayMethods from "../data/payment-method.json";
import PlanOptions from "../data/plan-options.json";
import QuoteData from "../data/quote.json";
import AddressSearch from "../data/address-search.json";
import AddressSelect from "../data/address-select.json";
import ApplicationState from "../data/application.json";
import { TrackingService } from "./tracking.service";
import { CustomerLeadModel, PetModel } from "../models/customer-lead.model";
import { Pet } from "../models/pet.model";
import { MessageService } from "./message.service";


@Injectable({
  providedIn: "root"
})
export class AjaxService {

  static configData: any = ConfigData;

  static allBreeds: Array<any> = AllBreeds;
  static referrals: Array<any> = Referrals;
  static paymentFreq: Array<any> = PayFreq;
  static paymentMethods: Array<any> = PayMethods;
  static titles: Array<any> = Titles;
  static vets: Array<any> = Vets;
  static planOptions: Array<any> = PlanOptions;
  static quoteData: any = QuoteData;
  static addressSearch: any = AddressSearch;
  static addressSelect: any = AddressSelect;
  static applicationState: any = ApplicationState;


  public urlParams: URLSearchParams;

  private baseUrl = "/quote/api";
  private upmApi = `${this.baseUrl}/pet_upm/v1`;
  private leadApi = "/quote/leadApi";

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private componentService: ComponentService,
    private tracking: TrackingService) {

  }

  // this method loads and  stores configuration data from a JSON
  // file in the root folder of the site. I have set up an Ajax request
  // for this so I can use this data. But please modify with error
  public plansConfig(): Observable<Map<string, number>> {
    return new Observable((observer: any) => {
      const configMap: Map<string, number> = new Map<string, number>();
      AjaxService.configData.plans.forEach((item: any, index: number) => {
        configMap.set(item.id, item.value);
      });
      CopyModel.privacyStatementPolicy = AjaxService.configData.privacyStatementPolicy;
      CopyModel.policyLinks = AjaxService.configData.policyLinks;
      CopyModel.marketingMaterial = AjaxService.configData.marketingMaterial;
      CopyModel.authorizedOther = AjaxService.configData.authorizedOther;
      CopyModel.agreeTerms = AjaxService.configData.agreeTerms;
      CopyModel.agreeTermsNoLink = AjaxService.configData.agreeTermsNoLink;
      CopyModel.agreeCCTerms = AjaxService.configData.agreeCCTerms;
      CopyModel.declaration = AjaxService.configData.declaration;
      CopyModel.declarationAcciPet = AjaxService.configData.declarationAcciPet;
      CopyModel.declarationPetCare = AjaxService.configData.declarationPetCare;
      CopyModel.declarationPetBoth = AjaxService.configData.declarationPetBoth;
      CopyModel.helpCopy = AjaxService.configData.helpCopy;
      CopyModel.planSummaryNotice = AjaxService.configData.planSummaryNotice;
      CopyModel.generalInformationNotice = AjaxService.configData.generalInformationNotice;
      CopyModel.fullname = AjaxService.configData.fullname;
      CopyModel.addressSearch = AjaxService.configData.addressSearch;
      CopyModel.authorisedPerson = AjaxService.configData.authorisedPerson;
      CopyModel.notAccountHolderPopUp = AjaxService.configData.notAccountHolderPopUp;
      CopyModel.hdecCopy = AjaxService.configData.hdecCopy;
      CopyModel.preExistingConditionsCopy = AjaxService.configData.preExistingConditionsCopy;
      observer.next(configMap);
    });
  }


  // this the final application submit that either redirects to the
  // credit Card portal or the submit thanks page if Direct Debit is the
  // payment method.
  public applicationSubmit(captchaToken: string): void {
    this.componentService.loadingNotification("Submitting application");
    this.application(captchaToken, true).subscribe((value: ApplicationBodyModel) => {
      this.componentService.loadingNotification("Submitting application");
      this.messageService.sendMessage(MessageService.applicationComplete, value);
    },
      (err: any) => {
        this.handleError("Ajax submit save application  error", err);
      });
  }

  public application(captchaToken: string, submitted: boolean = false, skipApiCall: boolean = false): Observable<ApplicationBodyModel> {
    this.componentService.loadingNotification("Saving application");
    const model: QuoteModel = QuoteModel.getInstance();
    const body: ApplicationBodyModel = model.applicationBody();

    if (body.paymentMethodCode === "DD" && submitted) {
      body.submit = true;
    }

    const jsonBody: string = JSON.stringify(body);
    if (skipApiCall) {
      // skip captcha and api call direct jump onto the next page
      this.componentService.destroyLoading();
      return of(null);
    } else {
      return this.http.post(`${this.upmApi}/application`, JSON.parse(jsonBody), { params: { captchaToken } })
        .pipe(map(res => {
          const m: ApplicationBodyModel = new ApplicationBodyModel(res);
          model.quoteId = m.quoteId;
          model.securityHash = m.securityHash;
          this.componentService.destroyLoading();
          return m;
        }));
    }

  }

  public applicationState(): Observable<void> {
    this.componentService.loadingNotification("Restoring application state");
    // replace this Observable with the ajax query to API Endpoint: /api/application/{quoteId}/{securityHash} to restore
    // a subset of the application state for the final submit page after the creditcard redirect back.

    // here are the two values for the API endpoint api/application/{quoteId}/{securityHash};
    const quoteId: string = this.urlParams.get("quoteId");
    const securityHash: string = this.urlParams.get("secureHash");

    // values required to call pxpay to finalize payment
    const userId: string = this.urlParams.get("userId");
    const result: string = this.urlParams.get("result");
    const success: boolean = this.urlParams.get("success") === "true";

    return this.http
      .get(`${this.upmApi}/application`, { params: { quoteId, securityHash } })
      .pipe(
        tap((res) => {
          const m: ApplicationBodyModel = new ApplicationBodyModel(res);
          QuoteModel.getInstance().setState(m);
          this.componentService.destroyLoading();
          this.componentService.loadingNotification("Restoring application quote");
        }),
        flatMap(() => this.getQuote(QuoteModel.getInstance().quoteBody(0, 0, -1))),
        map((quoteValue) => {
          const model: QuoteModel = QuoteModel.getInstance();
          model.quoteResultModel = quoteValue;
          quoteValue.Animals.forEach((pet: QuoteAnimalModel, index: number) => {
            model.pets[index].animalQuote = pet;
          });
          this.componentService.destroyLoading();
          return undefined;
        }),
        flatMap(() =>
          // on success call pxpay endpoint to finalize payment
          // tODO must handle failure path
          success
            ? this.http
              .post(`${this.upmApi}/pxpay`, {
                quoteId,
                secureHash: securityHash,
                userId,
                result,
              })
              .pipe(map(() => null))
            : of(null)
        )
      );
  }
  public initialState(): Observable<InitialStateModel> {
    /*
      This method checks the initial state of where the user has landed for the first time.
      Generally if they try to land on any of the routing pages except the start page
      thy will be redirected back ot the start page unless they have returned from
      and credit card success or fail and the quoteId and securityHash are available in the
      query string. In this event there are only two pages that are allowed to display
      which is the payment page of credit card fail and the submit page on credit card
      success.
     */

    // this map should contain all the possible values for any of the return pages
    // for either successfull or unsuccessfull credit card payments.
    const pathMap: Map<any, any> = new Map<any, any>();
    pathMap.set("/quote/apply/submit", 1);
    pathMap.set("/quote/apply/submit/", 1);
    pathMap.set("/quote/apply/payment", 1);
    pathMap.set("/quote/apply/payment/", 1);

    const state: InitialStateModel = new InitialStateModel();
    this.urlParams = new URLSearchParams(window.location.search);
    if (this.urlParams.has("timeout")) {
      state.timeOut = true;
    }
    // check if we are in the final submit page.
    if (pathMap.has(window.location.pathname)) {
      if (this.urlParams.has("quoteId") && this.urlParams.has("secureHash")) {
        state.exisitingApplication = true;
        if (this.urlParams.has("success")) {
          state.paymentError = this.urlParams.get("success") === "false";
        }
      }
    }
    return new Observable((observer: any) => {
      observer.next(state);
    });
  }

  public addressSearch(value: string): Observable<AddressSearchResponse> {
    return this.http
      .get(`${this.baseUrl}/qas/v2/addresses/search?q=${value}&pageNumber=1&pageSize=10`)
      .pipe(map(res => new AddressSearchResponse(res, value)));
  }

  public addressSelect(value: AddressSearchResponseAddress): Observable<AddressSelectResponse> {
    return this.http
      .get(`${this.baseUrl}/qas/v2/addresses/${value.addressId}`)
      .pipe(map(res => new AddressSelectResponse(res)));
  }

  public planOptions(planNo: number): Observable<Map<string, PlanOptionModel>> {
    return this.http.get<any[]>(`${this.upmApi}/planoptions/${planNo}`).pipe(
      map((res) => {
        const optionsMap: Map<string, PlanOptionModel> = new Map<string, PlanOptionModel>();

        res.forEach((value: any, index: number) => {
          optionsMap.set(value.optionCode, new PlanOptionModel(value, index));
        });

        return optionsMap;
      })
    );
  }
  public leadSubmit(token: string, state: string = ""): Observable<CustomerLeadModel> {
    const quote: QuoteModel = QuoteModel.getInstance();
    quote.customerLead.token = token;
    quote.customerLead.firstName = quote.firstname;
    quote.customerLead.lastName = quote.lastname;
    quote.customerLead.contactNumber = quote.phone;
    quote.customerLead.email = quote.email;
    quote.customerLead.quoteId = quote.quoteId.toString();
    quote.customerLead.isExistingPetCustomer = quote.alreadyHavePetInsuranceUs ?? false;
    quote.customerLead.isSCHSMember = quote.southernCrossSocietyMember ?? false;
    quote.customerLead.engagementChannel = quote.whereHearAboutUs.label;
    quote.customerLead.promoCode = quote.promoCode;
    quote.customerLead.state = state;
    const petsTotal: number = quote.customerLead.pets.length;
    quote.pets.forEach((value: Pet, index: number) => {
      const p: PetModel = new PetModel();
      if (index < petsTotal) {
        quote.customerLead.pets[index].petName = value.name;
        quote.customerLead.pets[index].animalBreed = value.breed.label;
        quote.customerLead.pets[index].gender = value.gender.gender;
        quote.customerLead.pets[index].animal = value.species.label;
        quote.customerLead.pets[index].dob = value.ageDob;
      } else {
        p.petName = value.name;
        p.animalBreed = value.breed.label;
        p.gender = value.gender.gender;
        p.animal = value.species.label;
        p.dob = value.ageDob;
        quote.customerLead.pets.push(p);
      }
    });
    const jsonBody: string = JSON.stringify(quote.customerLead);

    if (quote.customerLead.leadId) {
      return this.http
        .put(`${this.leadApi}`, JSON.parse(jsonBody))
        .pipe(map(value => {
          quote.customerLead.update(value);
          return quote.customerLead;
        }));
    } else {
      return this.http
        .post(`${this.leadApi}`, JSON.parse(jsonBody))
        .pipe(map(value => {
          quote.customerLead.update(value);
          return quote.customerLead;
        }));
    }
  }
  public getQuote(quoteBody: QuoteBodyModel): Observable<QuoteResultModel> {
    const jsonBody: string = JSON.stringify(quoteBody);
    return this.http
      .post(`${this.upmApi}/quote`, JSON.parse(jsonBody))
      .pipe(map(value => new QuoteResultModel(value)));
  }
  public sendEmail(emailBody: EmailBodyModel, captchaToken: string): any {
    const jsonBody: string = JSON.stringify(emailBody);
    return this.http
      .post(`${this.upmApi}/email`, JSON.parse(jsonBody), { params: { captchaToken } });
  }

  public breeds(): Observable<BreedsModel[]> {
    return this.http.get<any[]>(`${this.upmApi}/breed`)
      .pipe(
        map(res => res.map((value, index) =>
          new BreedsModel(value.code, value.description, value.species, value.description, index))
        )
      );
  }

  public referrals(): Observable<ReferralModel[]> {
    return this.http.get<any[]>(`${this.upmApi}/referral`)
      .pipe(
        map(res => res.map((value, index) =>
          new ReferralModel(value.code, value.description, value.description, index))
        )
      );
  }

  public paymentFrequency(): Observable<PaymentFrequencyModel[]> {
    return this.http.get<any[]>(`${this.upmApi}/paymentfrequency`)
      .pipe(
        map(res => res.map((value, index) =>
          new PaymentFrequencyModel(value.code, value.description, value.description, index))
        )
      );
  }
  public paymentMethods(): Observable<PaymentMethodModel[]> {
    return this.http.get<any[]>(`${this.upmApi}/paymentmethod`)
      .pipe(
        map(res => res.map((value, index) =>
          new PaymentMethodModel(value.code, value.description, value.description, index))
        )
      );
  }
  public titles(): Observable<TitlesModel[]> {
    return this.http.get<any[]>(`${this.upmApi}/persontitle`)
      .pipe(
        map(res => res.map((value, index) =>
          new TitlesModel(value.code, value.description, value.description, index))
        )
      );
  }
  public vets(): Observable<VetsModel[]> {
    return this.http.get<any[]>(`${this.upmApi}/vetpractice`)
      .pipe(
        map(res => res.map((value, index) =>
          new VetsModel(value.code, value.description, value.description, index))
        )
      );
  }
  public plans(date: string): Observable<PlansListModel> {
    return this.http.get<PlansListModel>(`${this.upmApi}/plans?startDate=${date}`);
  }
  public policyStartDate(): Observable<Date> {
    // always defaults to tomorrow from local time
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return of(tomorrow);
  }
  public handleError(message: string, err: any): void {
    // this.componentService.destroyLoading();
    // this.componentService.errorNotification(message);
    console.log("ajax.service.handleError", err);
    window.location.href = "/quote/error?type=" + err.status;
  }
}
