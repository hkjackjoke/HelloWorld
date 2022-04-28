export interface PlansListModel {
    planList: Array<PlansListItem>;
}
export interface PlansListItem {
    options: Array<PlansListItemOption>;
    excess: Array<PlansListItemExcess>;
    planNo: number;
    planDescription: string;
    planEffectiveFrom: string;
    planEffectiveTo: string;
    externalName: string;
    limitNo: number;
    case: number;
    optionNo: number;
    optionCode: string;
    limitDescription: string;
    limitEffectiveFrom: string;
    limitEffectiveTo: string;
    limit: number;
}

export interface PlansListItemOption {
    optionNo: number;
    optionCode: string;
    planOptionDescription: string;
    benefitType: number;
    optionEffectiveFrom: string;
    optionEffectiveTo: string;
    loadingNo: number;
    loadingCode: string;
    loadingDescription: string;
    externalName: string;
    additionalExcess: number;
}

export interface PlansListItemExcess {
    excessNo: number;
    excess: number;
    levelOfCover: number;
    excessEffectiveFrom: string;
    excessEffectiveTo: string;
    excessDescription: string;
}
