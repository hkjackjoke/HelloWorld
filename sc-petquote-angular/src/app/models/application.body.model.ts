import { ApplicationAuthorizedPersonModel } from './application.authorized.person.model';
import { Pet } from './pet.model';
import { ApplicationPetBodyModel, ApplicationPetOptional } from './application.pet.body.model';
import { PetHealthDeclarationModel } from './pet.health.declaration.model';
import { BreedsModel } from './breeds.model';
import { HealthDeclaration } from './health-declaration.model';
import { CopyModel } from './copy.model';
import { PlanOptionModel } from './plan.option.model';
import { PlansListItemOption } from './plans-list.model';
import { DateAge } from '../helpers/DateAge';

export class ApplicationBodyModel {


    public address: string;
    public advisorNo: string;
    public agreeToTermsAndConditions: boolean;
    public bankAccountBSB: string;
    public bankAccountName: string;
    public bankAccountNumber: string;
    public city: string;
    public clientType: string;
    public dateOfBirth: string;
    public dpid: string;
    public ellencoClient: boolean;
    public email: string;
    public existingClientNumber: string;
    public firstCollectionDate: string;
    public firstName: string;
    public lastName: string;
    public paymentFrequencyCode: string;
    public paymentMethodCode: string;
    public paymentPage: string;
    public phoneNumber: string;
    public policyDate: string;
    public postcode: string;
    public preferredContactMethod: number;
    public promotionalCode: string;
    public quoteEmail: string;
    public quoteId: number;
    public receiveEmailsAboutEllenco: boolean;
    public receiveEmailsAboutSx: boolean;
    public residentialAddress: string;
    public residentialCity: string;
    public residentialPostcode: string;
    public residentialSuburb: string;
    public securityHash: string;
    public southernCrossMember: boolean;
    public southernCrossMemberNumber: string;
    public status: number;
    public submit: boolean;
    public suburb: string;
    public titleCode: string;
    public whereDidYouHearCode: string;
    public successURL: string;
    public failureURL: string;

    public authorisedPeople = new Array<ApplicationAuthorizedPersonModel>();
    public pets = new Array<ApplicationPetBodyModel>();

    constructor(value: any = 0) {
        if (value) {
            this.setState(value);
        }
    }
    public addPet(pet: Pet, qid: number): void {

        const p = new ApplicationPetBodyModel();
        p.analGlandConditions = pet.analGlandConditions;
        p.approximateAge = pet.dontKnowAge ? CopyModel.dateToString(pet.dontKnowAgeDate) : null;
        p.approximateAgeCode = pet.dontKnowAge ? CopyModel.approximateAgeCode(pet) : null;
        p.dateOfBirth = pet.dontKnowAge ? CopyModel.dateToString(pet.dontKnowAgeDate) : CopyModel.dateToString(pet.ageDob);
        p.dateOfBirthUnknown = pet.dontKnowAge;
        p.excessId = pet.selectedExcessNo;
        p.fractures = pet.fractures;
        p.injuries = pet.injuriesAnimalFights;
        p.lameness = pet.lameness;
        p.optionals = [];
        if (pet.selectedPlan === 'petcare') {
            const options = CopyModel.getPlanOptions(pet.selectedPlanNo);
            pet.selectedPlanOptions.forEach((value: PlansListItemOption, key: string) => {
                const option = options.get(value.optionCode);
                p.optionals.push({optionCode: value.optionCode, optionNo: option.optionNo});
            });
        }
        p.petBreedCode = pet.breed.Code;
        p.petId = null;
        p.petName = pet.name;
        p.petOrderId = this.pets.length;
        p.petSex = pet.gender.id;
        p.petSpecies = pet.breed.Species;
        p.planId = pet.selectedPlanNo;
        p.preexistingConditions = pet.preExistingConditions ? 2 : 1;
        p.preexistingConditionsFreeText = pet.preExistingConditionsText;
        p.quote = null;
        p.quoteId = qid;
        p.seizures = pet.seizures;
        p.skinEyeEar = pet.skinEyeEarConditions;
        p.vetPracticeCode = pet.neverBeenToVet || pet.vetNotListed ? null : pet.regularVets.Code;
        p.vetPracticeFreeText = pet.vetNotListed ? pet.otherVetPractise : '';
        p.vomitingOrDiarrohea = pet.vomitingDiarrhoea;

        p.healthDeclarations = new Array<PetHealthDeclarationModel>();
        if (pet.lameness) {
            p.healthDeclarations.push(new PetHealthDeclarationModel('lameness', pet.lamenessDeclaration));
        }
        if (pet.vomitingDiarrhoea) {
            p.healthDeclarations.push(new PetHealthDeclarationModel('vomitingOrDiarrohea', pet.vomitingDiarrhoeaDeclaration));
        }
        if (pet.skinEyeEarConditions) {
            p.healthDeclarations.push(new PetHealthDeclarationModel('skinEyeEar', pet.skinEyeEarConditionsDeclaration));
        }
        if (pet.injuriesAnimalFights) {
            p.healthDeclarations.push(new PetHealthDeclarationModel('injuries', pet.injuriesAnimalFightsDeclaration));
        }
        this.pets.push(p);
    }
    public getPets(policyStartDate: Date): Array<Pet> {
        const totalPets = this.pets.length;
        const results = new Array<Pet>();
        for (let i = 0; i < totalPets; i++) {
            const pet  = new Pet();
            const p = this.pets[i];
            pet.dontKnowAge = p.dateOfBirthUnknown;
            pet.breed = CopyModel.getBreed(p.petBreedCode);
            pet.species = p.petSpecies === 'CAT' ? {label: 'cat', id : 1} : {label: 'dog', id: 2};
            pet.name = p.petName;
            pet.gender = p.petSex === 1 ? {label: 'Her', id : 1, gender: 'Female'} :  {label: 'His', id: 2, gender: 'Male'};

            if (pet.dontKnowAge) {
                const da = new DateAge(new Date(p.approximateAge), policyStartDate);
                if (da.years) {
                    pet.ageAproxValue = da.years.toString();
                    pet.ageAproxType = {label: 'years', id: 1};
                } else if (da.weeks) {
                    pet.ageAproxValue = da.weeks.toString();
                    pet.ageAproxType = {label: 'months', id: 2};
                } else if (da.days) {
                    pet.ageAproxValue = da.days.toString();
                    pet.ageAproxType = {label: 'days', id: 3};
                }
            }
            pet.selectedPlan = CopyModel.selectedPlan(p.planId);
            pet.selectedLimitName = CopyModel.selectedLimitName(p.planId);
            pet.selectedPlanNo = p.planId;
            pet.selectedExcessNo = p.excessId;
            pet.vomitingDiarrhoea = p.vomitingOrDiarrohea;
            pet.fractures = p.fractures;
            pet.neverBeenToVet = p.vetPracticeCode === '' && p.vetPracticeFreeText === '';
            pet.vetNotListed = p.vetPracticeFreeText.trim() !== '';
            pet.otherVetPractise = p.vetPracticeFreeText;
            pet.analGlandConditions = p.analGlandConditions;
            switch (p.excessId){
                case 173:
                    pet.accipetCoPayment = true;
                    break;
                case 174:
                    pet.accipetCoPayment = false;
                    break;
                case 175:
                case 177:
                case 179:
                case 190:
                    pet.petcareCoPayment = true;
                    break;
                case 176:
                case 178:
                case 180:
                case 191:
                    pet.petcareCoPayment = false;
                    break;
            }
            if (!pet.dontKnowAge) {
                pet.ageDob = new Date(p.dateOfBirth);
                pet.dontKnowAgeDate = null;
            } else {
                pet.ageDob = null;
                pet.dontKnowAgeDate = new Date(p.approximateAge);
            }
            const options = CopyModel.getPlanOptions(pet.selectedPlanNo);
            pet.selectedPlanOptions = new Map<string, PlansListItemOption>();
            p.optionals.forEach((value: ApplicationPetOptional , index: number) => {
                pet.selectedPlanOptions.set(value.optionCode, options.get(value.optionCode));
            });

            pet.seizures = p.seizures;
            pet.lameness = p.lameness;
            pet.skinEyeEarConditions = p.skinEyeEar;
            pet.injuriesAnimalFights = p.injuries;
            pet.regularVets = CopyModel.getVet(p.vetPracticeCode);
            if (p.healthDeclarations !== undefined && p.healthDeclarations !== null) {
                const decTotal = p.healthDeclarations.length;
                for (let n = 0; n < decTotal; n++) {
                    const dec = p.healthDeclarations[n];
                    const hd = new HealthDeclaration();
                    hd.dateObserved = new Date(dec.dateOfFirstSymptoms);
                    hd.previousTreament = dec.hasVeterinarianExamined;
                    hd.vetName = dec.veterinarianFreeText;
                    if (dec.vetPracticeIsNotOnTheList || dec.veterinarianFreeText !== '') {
                        hd.vetNotListed = true;
                    } else {
                        hd.regularVets = CopyModel.getVet(dec.vetPracticeCode);
                        hd.vetNotListed = false;
                    }
                    hd.validate();
                    switch (dec.conditionCode) {
                        case 'lameness':
                            pet.lamenessDeclaration = hd;
                            break;
                        case 'vomitingOrDiarrohea':
                            pet.vomitingDiarrhoeaDeclaration = hd;
                            break;
                        case 'skinEyeEar':
                            pet.skinEyeEarConditionsDeclaration = hd;
                            break;
                        case 'injuries':
                            pet.injuriesAnimalFightsDeclaration = hd;
                            break;
                    }
                }
            }
            pet.preExistingConditions = p.preexistingConditions === 2;
            pet.preExistingConditionsText = p.preexistingConditionsFreeText;
            results.push(pet);
        }
        return results;
    }
    setState(value: any): void {
        for (const key of Object.keys(value)) {
            if (key !== 'pets') {
                this[key] = value[key];
            }
        }
        this.pets = new Array<ApplicationPetBodyModel>();
        const totalPets = value.pets.length;
        for (let i = 0; i < totalPets; i++) {
            const p = new ApplicationPetBodyModel();
            const pet = value.pets[i];
            for (const key of Object.keys(pet)) {
                p[key] = pet[key];
            }
            this.pets.push(p);
        }
    }
}
