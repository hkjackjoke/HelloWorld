export class PlanOptionModel {

    public additionalExcess: number;
    public benefitType: number;
    public description: string;
    public effectiveFrom: string;
    public effectiveTo: string;
    public externalName: string;
    public loadingCode: string;
    public loadingDescription: string;
    public loadingNo: string;
    public optionCode: string;
    public optionNo: number;
    public per: number;
    public planNo: number;
    public timestamp: string;
    public id: number;
    constructor(value: any, index: number) {
        this.additionalExcess = value.additionalExcess;
        this.benefitType = value.benefitType;
        this.description = value.description;
        this.effectiveFrom = value.effectiveFrom;
        this.effectiveTo = value.effectiveTo;
        this.externalName = value.externalName;
        this.loadingCode = value.loadingCode;
        this.loadingDescription = value.loadingDescription;
        this.loadingNo = value.loadingNo;
        this.optionCode = value.optionCode;
        this.optionNo = value.optionNo;
        this.per = value.per;
        this.planNo = value.planNo;
        this.timestamp = value.timestamp;
        this.id = index;
    }
}
