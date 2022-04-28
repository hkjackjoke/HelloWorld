import { HealthDeclaration } from './health-declaration.model';
import { CopyModel } from './copy.model';

export class PetHealthDeclarationModel {
    public hasVeterinarianExamined: boolean;
    public vetPracticeIsNotOnTheList: boolean;
    public vetPracticeCode: string;
    public veterinarianFreeText: string;
    public dateOfExamination: string;
    public diagnosisDetails: string;
    public dateOfFirstSymptoms: string;
    public conditionCode: string;
    constructor(code: string, model: HealthDeclaration) {
        this.conditionCode = code;
        this.hasVeterinarianExamined = model.previousTreament;
        if (model.previousTreament) {
            this.vetPracticeIsNotOnTheList = model.vetNotListed;
            if (!model.vetNotListed) {
                this.vetPracticeCode = model.regularVets.Code;
            } else {
                this.veterinarianFreeText = model.vetName;
            }
        } else {
            this.dateOfFirstSymptoms = CopyModel.dateToString(model.dateObserved);
        }
    }
}
