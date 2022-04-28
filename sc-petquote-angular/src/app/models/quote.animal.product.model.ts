import { QuoteProductOptionModel } from './quote.product.option.model';
import { QuoteProductLoadingModel } from './quote.product.loading.model';

export class QuoteAnimalProduct {
    public planNo: number;
    public excessNo: number;
    public basePremium: number;
    public options: Array<QuoteProductOptionModel>;
    public loadings: Array<QuoteProductLoadingModel>;

    constructor() {
        this.options = new Array<QuoteProductOptionModel>();
        this.loadings = new Array<QuoteProductLoadingModel>();
    }
    public addOption(optNum: number, planNum: number, unit: number) {
        const option = new QuoteProductOptionModel();
        option.optionNo = optNum;
        option.planNo = planNum;
        option.unit = unit;
        this.options.push(option);
    }
    public addQuoteOption(value: any) {
        const option = new QuoteProductOptionModel();
        option.additionalExcess = value.additionalExcess;
        option.benefitType = value.benefitType;
        option.description = value.description;
        option.effectiveFrom = value.effectiveFrom;
        option.effectiveTo = value.effectiveTo;
        option.externalName = value.externalName;
        option.loadingCode = value.loadingCode;
        option.loadingDescription = value.loadingDescription;
        option.loadingNo = value.loadingNo;
        option.optionCode = value.optionCode;
        option.optionNo = value.optionNo;
        option.per = value.per;
        option.planNo = value.planNo;
        option.premium = value.premium;
        option.unit = value.unit;
        this.options.push(option);
    }
    public addQuoteLoading(value: any) {
        const loading = new QuoteProductLoadingModel();
        loading.calculatedLoadingAmount = value.calculatedLoadingAmount;
        loading.description = value.description;
        loading.loadingAmount = value.loadingAmount;
        loading.loadingCode = value.loadingCode;
        loading.loadingNo = value.loadingNo;
        loading.loading = value.loading;
        loading.pet = value.pet;
        this.loadings.push(loading);
    }
}

