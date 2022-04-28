import { PetHealthDeclarationModel } from './pet.health.declaration.model';

export class ApplicationPetBodyModel {
    public analGlandConditions: boolean;
    public approximateAge: string;
    public approximateAgeCode: string;
    public dateOfBirth: string;
    public dateOfBirthUnknown: boolean;
    public excessId: number;
    public fractures: boolean;
    public injuries: boolean;
    public lameness: boolean;
    public optionals: Array<ApplicationPetOptional>;
    public petBreedCode: string;
    public petId: number;
    public petName: string;
    public petOrderId: number;
    public petSex: number;
    public petSpecies: string;
    public planId: number;
    public preexistingConditions: number;
    public preexistingConditionsFreeText: string;
    public quote: any;
    public quoteId: number;
    public seizures: boolean;
    public skinEyeEar: boolean;
    public vetPracticeCode: string;
    public vetPracticeFreeText: string;
    public vomitingOrDiarrohea: boolean;
    public healthDeclarations: Array<PetHealthDeclarationModel>;
}
export interface ApplicationPetOptional {
    optionCode: string;
    optionNo: number;
}
