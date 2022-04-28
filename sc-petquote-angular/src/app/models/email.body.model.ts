import { EmailPetBodyModel } from './email.pet.body.model';
import { Pet } from './pet.model';
import { PlanOptionModel } from './plan.option.model';
import { EmailPetOptionBodyModel } from './email.pet.option.body.model';
import { CopyModel } from './copy.model';
import { PlansListItemOption } from './plans-list.model';

export class EmailBodyModel {
    public pets = new Array<EmailPetBodyModel>();
    public authorisedPeople = [];
    public quoteEmail: string;
    public firstName: string;
    public lastName: string;
    public dateOfBirth = null;
    public preferredContactMethod = 0;
    public ellencoClient = true;
    public southernCrossMember: boolean;
    public whereDidYouHearCode: string;
    public policyDate: string;
    public paymentFrequencyCode: string;
    public paymentMethodCode: string;
    public bankAccountBSB = '';
    public firstCollectionDate = '';
    public promotionalCode = '';
    constructor() {

    }
    addPet(pet: Pet, quoteId: number) {
        const p = new EmailPetBodyModel();
        p.quoteId = null;
        p.petOrderId = this.pets.length + 1;
        p.dateOfBirthUnknown = pet.dontKnowAge;
        p.petSpecies = pet.breed.Species;
        p.petName = pet.name;
        p.petSex = pet.gender.id;
        p.dateOfBirth = pet.dontKnowAge ? CopyModel.dateToString(pet.dontKnowAgeDate) : CopyModel.dateToString(pet.ageDob);
        p.approximateAge = pet.dontKnowAge ? CopyModel.dateToString(pet.dontKnowAgeDate) : null;
        p.petBreedCode = pet.breed.Code;
        p.planId = pet.selectedPlanNo;
        p.excessId = pet.selectedExcessNo;
        if (pet.selectedPlan === 'petcare') {
            const options = CopyModel.getPlanOptions(pet.selectedPlanNo);
            pet.selectedPlanOptions.forEach((value: PlansListItemOption,  key: string) => {
                const o = new EmailPetOptionBodyModel();
                const option = options.get(value.optionCode);
                o.optionNo = option.optionNo;
                o.optionCode = value.optionCode;
                p.optionals.push(o);
            });
        }
        this.pets.push(p);
    }
}
