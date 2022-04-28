import { PaymentFrequencyModel } from "./payment.frequency.model";
import { TitlesModel } from "./titles.model";
import { VetsModel } from "./vets.model";
import { ReferralModel } from "./referral.model";
import { PaymentMethodModel } from "./payment.method.model";
import { BreedsModel } from "./breeds.model";
import { Pet } from "./pet.model";
import { PlansListModel, PlansListItemOption, PlansListItem } from "./plans-list.model";
export class CopyModel {
    public static titles: Array<TitlesModel>;
    public static paymentMethods: Array<PaymentMethodModel>;
    public static paymentFrequency: Array<PaymentFrequencyModel>;
    public static referrals: Array<ReferralModel>;
    public static vetsList: Array<VetsModel>;
    public static allBreeds: Array<BreedsModel>;
    public static plansList: PlansListModel;
    public static months = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
      };
    public static species: Array<any> = [{label: "cat", id : 1}, {label: "dog", id: 2}];
    public static gender: Array<any> = [{label: "Her", id : 1, gender: "Female"}, {label: "His", id: 2, gender: "Male"}];
    public static approxAgeValues: Array<any> = [
        {
            label: "years",
            id: 1
        },
        {
            label: "months",
            id: 2
        },
        {
            label: "weeks",
            id: 3
        }
    ];
    public static privacyStatementPolicy: string;
    public static policyLinks: any;
    public static marketingMaterial: string;
    public static authorizedOther: string;
    public static agreeTerms: string;
    public static agreeTermsNoLink: string;
    public static agreeCCTerms: string;
    public static declaration: string;
    public static declarationAcciPet: string;
    public static declarationPetCare: string;
    public static declarationPetBoth: string;
    public static helpCopy: any;
    public static planSummaryNotice: string;
    public static generalInformationNotice: string;
    public static fullname: string;
    public static addressSearch: string;
    public static authorisedPerson: string;
    public static lameNess = "";
    public static vomitingDiarrhoea = "";
    public static skinEyeEar = "";
    public static fightingInjuries = "";
    public static notAccountHolderPopUp: string;
    public static hdecCopy: string;
    public static preExistingConditionsCopy: string;


    public static nameToFirstAndLast(name: string): any {
      const a = name.split(" ");
      let firstname = name;
      let lastname = "NA";
      if (a.length > 1) {
        firstname = a.shift();
        lastname = a.join(" ");
      }
      return {first: firstname, last: lastname};
    }

    public static dateToString(date: Date): string {
      if (date === undefined || date === null) {
          return "";
      }

      const month = date.getMonth() + 1; // getMonth() is zero-based
      const day = date.getDate();

      return `${date.getFullYear()}-${month > 9 ? month : "0" + month }-${day > 9 ? day : "0" + day}`;
    }
    public static isValidDateString(dateString: string): boolean {
        // first check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
          return false;
        }
        const parts = dateString.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (year < 1000 || year > 3000 || month === 0 || month > 12) {
            return false;
        }
        const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
            monthLength[1] = 29;
        }
        return day > 0 && day <= monthLength[month - 1];
    }
    public static capitalize(s: string) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    public static approximateAgeCode(pet: Pet) {
      if (pet.ageAproxValue === undefined || pet.ageAproxType.label === "&nbsp;" || pet.ageAproxValue === null) {
        return null;
      }
      const value = Number(pet.ageAproxValue);
      return (value < 10 ? "0" + pet.ageAproxValue : pet.ageAproxValue) + pet.ageAproxType.label;
    }
    public static approximateAgeType(approximateAge: string) {
      if (approximateAge === null || approximateAge === undefined) {
        return {label: " ", id: 0};
      }
      if (approximateAge.indexOf("days") !== -1) {
        return {label: "days", id: 3};
      }
      if (approximateAge.indexOf("months") !== -1) {
        return {label: "months", id: 2};
      }
      if (approximateAge.indexOf("years") !== -1) {
        return {label: "years", id: 1};
      }
      return {label: " ", id: 0};
    }
    public static stringToDate(date: string): Date {
      const d = date.split("-");
      if  (d.length < 3)  {
        return new Date();
      }
      const year = Number(d[0]);
      const month = Number(d[1]);
      const day = Number(d[2]);
      return new Date(year, month - 1, day);
    }
    public static getVet(code: string): VetsModel {
      let result = new VetsModel(code, "", "", -1);
      CopyModel.vetsList.forEach((value: VetsModel, index: number) => {
        if (value.Code === code) {
          result = value;
        }
      });
      return result;
    }
    public static getBreed(code: string): BreedsModel {
      let result = new BreedsModel(code, "", "", "", -1);
      CopyModel.allBreeds.forEach((value: BreedsModel, index: number) => {
        if (value.Code === code) {
          result = value;
        }
      });
      return result;
    }
    public static getPaymentMethod(code: string): PaymentMethodModel {
      let result = CopyModel.paymentMethods[3];
      CopyModel.paymentMethods.forEach((value: PaymentMethodModel, index: number) => {
        if (value.Code === code) {
          result = value;
        }
      });
      return result;
    }
    public static getPaymentFrequency(code: string): PaymentFrequencyModel {
      let result = new PaymentFrequencyModel(code, "", "", -1);
      CopyModel.paymentFrequency.forEach((value: PaymentFrequencyModel, index: number) => {
        if (value.Code === code) {
          result = value;
        }
      });
      return result;
    }
    public static getTitle(code: string): TitlesModel {
      let result = new TitlesModel(code, "", "", -1);
      CopyModel.titles.forEach((value: TitlesModel, index: number) => {
        if (value.Code === code) {
          result = value;
        }
      });
      return result;
    }
    public static getReferral(code: string): ReferralModel {
      let result = new ReferralModel(code, "", "", -1);
      CopyModel.referrals.forEach((value: ReferralModel, index: number) => {
        if (value.Code === code) {
          result = value;
        }
      });
      return result;
    }
    public static getPlanOptions(planNo: number): Map<string, PlansListItemOption> {
      const result = new Map<string, PlansListItemOption>();
      CopyModel.plansList.planList.forEach((plan: PlansListItem, index: number) => {
        if (plan.planNo === planNo) {
          plan.options.forEach((option: PlansListItemOption, n: number) => {
            result.set(option.optionCode, option);
          });
        }
      });
      return result;
    }
    public static selectedPlan(planNo: number): string {
      switch (planNo) {
        case 92:
          return "accipet";
        default:
          return "petcare";
      }
    }
    public static selectedLimitName(planNo: number): string {
      switch (planNo) {
        case 93:
          return "blue";
        case 94:
          return "gold";
        case 95:
          return "silver";
        case 99:
          return "bronze";
      }
      return "silver";
    }
}
