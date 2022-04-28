import {Injectable} from '@angular/core';
import { QuoteModel } from '../models/quote.model';
import { Pet } from '../models/pet.model';
import { DateAge } from '../helpers/DateAge';
import { el } from 'date-fns/locale';
declare global {
    interface Window { dataLayer: any[]; }
}
@Injectable({
    providedIn: 'root'
})
export class TrackingService{
    public formSteps = [
        '',
        'Pet Info | 1',
        'Extra Discount | 2',
        'Choose a Plan | 3',
        'Quote Summary | 4',
        'Policyholder Details | 5',
        'More Pet Details | 6',
        'Summary | 7',
        'Payment | 8',
        'Confirmation | 9',
        'Policyholder Details | 2'
    ];
    public quote: QuoteModel;
    public planToggles = 0;
    constructor(){
        this.quote = QuoteModel.getInstance();
    }
    formError(step: number, field: string, error: string){
        this.event('formFieldError', 'Form field errors', this.formSteps[step], field, error, undefined);
    }
    formInteract(step: number, field: string) {
        this.event('formFieldInteraction', 'Form field change', this.formSteps[step], field, undefined, undefined);
    }
    petInfoLoad(index: number) {
        this.event('form load', 'Quote and apply', this.formSteps[1], `Pet ${index} form load`, undefined, undefined);
    }
    petInfoNext(index: number, pets: Pet[]) {
        this.eventPetInfo('form submit', 'Quote and apply', this.formSteps[1], `Pet ${index} form submitted`, undefined, undefined, pets);
    }
    petInfoSubmit(index: number) {
        this.event('form submit', 'Quote and apply', this.formSteps[1], `Pet ${index} form submitted`, undefined, undefined);
    }
    petAdded(){
        this.pageEvent('pageview', '/pets-added', 'Pets Added');
    }
    editPet() {
        this.event('edit pet', 'Quote and apply', this.formSteps[1], 'Edit pet', undefined, undefined);
    }
    removePet() {
        this.event('remove pet', 'Quote and apply', this.formSteps[1], 'Remove pet', undefined, undefined);
    }
    submitDiscountPage(){
        this.push({user: this.user()});
    }
    planView(plan: string, sku: number){
        this.push({
            event: 'product view',
            event_info: {
                category: 'Enhanced ecommerce',
                action: 'EEC product view',
                label_1: undefined,
                label_2: undefined,
                label_3: undefined
            },
            eec: [{
                planName: plan,
                planSku: sku
            }]
        });
        this.planToggles++;
        this.push({
            event: 'select_content',
            event_info: {
                category: 'Quote and apply',
                action: 'Choose a Plan',
                label_1: 'Choose ' + plan,
                label_2: this.planToggles,
             }
        });
    }
    selectContent(action:string, label: string){
        this.push({
            event: 'select_content',
            event_info: {
                category: 'Quote and apply',
                action: action,
                content_name: label,
                content_type: 'button',
             }
        });
    }
    customInteract(action:string, labelOne: string, labelTwo: string){
        this.push({
            event: 'formFieldInteraction',
            event_info: {
                category: 'Form field change',
                action: action,
                label_1: labelOne,
                label_2: labelTwo,
             }
        });
    }
    selectRadio(action:string, name:string, label: string){
        this.push({
            event: 'select_content',
            event_info: {
                category: 'Quote and apply',
                action: action,
                content_name: name,
                content_type: "radio",
                label_1: label
             }
        });
    }
    selectCheckbox(action:string, name:string, label: string, state: string){
        this.push({
            event: 'select_content',
            event_info: {
                category: 'Quote and apply',
                action: action,
                content_name: name,
                content_type: "check-box",
                label_1: label,
                label_2: state,
             }
        });
    }
    selectPlanLimit(petIndex: number) {
        const pet = this.quote.pets[petIndex];
        this.petEventTrack(petIndex,
            'cover selection',
            'Quote and apply',
            this.formSteps[3],
            `${pet.species.label} | ${pet.selectedLimitName}`);
    }
    planSelectContentNext(petIndex: number,selectedLimitName: string = ""){
        const pet = this.quote.pets[petIndex];
        if(pet.selectedPlan === "accipet"){
            selectedLimitName = "silver";
        }
        this.push({
            event: "select_content",
            event_info: {
                category: "Quote and apply",
                action: "Payment details",
                content_name: "cover selection",
                content_type: "button",
                label_1: pet.species.label + " | " + selectedLimitName,
                label_2: this.quote.paymentMethod.label,
                label_3: this.quote.paymentFrequency.label
            },
        });
    }
    selectPlanNext(petIndex: number){
        const pet = this.quote.pets[petIndex];
        this.petEventTrack(petIndex,
            'add to cart',
            'Enhanced ecommerce',
            'EEC add to cart',
            undefined);
 
    }
    emailQuote() {
        const label = [];
        this.quote.pets.forEach((pet: Pet, index: number) => {
            label.push(`${pet.selectedPlan} | ${this.monthlyPremium(pet)}`);
        });
        this.event('email quote', 'Quote engagement', 'Email quote', label, undefined, undefined);
    }
    editQuote() {
        this.event('edit quote', 'Quote engagement', this.formSteps[4], 'Edit quote', undefined, undefined);
        this.push({
            event: "select_content",
            event_info: {
            category: "Quote and apply",
            action: "Quote summary",
            label_1: "button",
            label_2: "Edit"
            },
        });
    }
    quoteRemovePet(petIndex: number, pageIndex: number){
        this.petEventTrack(petIndex, 'remove quote', 'Quote and apply', this.formSteps[pageIndex], 'Remove quote');
    }
    applyLoad(){
        this.petEventTrack(-1, 'checkout', 'Enhanced ecommerce', 'EEC checkout step 1', undefined);
    }
    morePetDetailsLoad(){
        this.petEventTrack(-1, 'checkout', 'Enhanced ecommerce', 'EEC checkout step 2', undefined);
    }
    applySummaryLoad() {
        this.petEventTrack(-1, 'checkout', 'Enhanced ecommerce', 'EEC checkout step 3', undefined, true);
    }
    cancelApplication(){
        const total = this.quote.quoteResultModel.Total;
        const plans = new Array<string>();
        this.quote.pets.forEach((pet: Pet, index: number) => {
            plans.push(pet.selectedPlan);
        });
        this.event('cancel application', 'Quote and apply', 'Cancel my application', plans.join(', ') + ' | '
        + total, undefined, undefined);
    }
    payemntLoad() {
        this.petEventTrack(-1, 'checkout', 'Enhanced ecommerce', 'EEC checkout step 4', undefined, true);
    }
    purchase() {
        this.petEventTrack(-1,
            'purchase',
            'Enhanced ecommerce',
            'EEC purchase',
            `Payment method: ${this.quote.paymentMethod.Description}`,
             true);
    }
    discountBanner(){
        this.event('promotion view', 'Enhanced ecommerce', 'EEC promotion view', 'Discount banner', undefined, undefined);
    }
    discountBannerClick(){
        this.event('discount banner click', 'Quote and apply', 'Discount banner | find out more here', undefined, undefined, undefined);
    }
    discountOverlay(){
        this.pageEvent('discount overlay load', '/quote/discount-overlay/virtual', 'Pet Quote & Buy - Discount overlay');
    }
    discountOverlayGetQuote(){
        this.event('discount overlay click', 'Enhanced ecommerce', 'EEC promotion click', 'Discount overlay | get a quote now'
        , undefined, undefined);
    }
    virtualPageView(n: string, t: string){
        this.push({
            event : 'pageview',
            page: {
                name: n,
                title: t
            }
        });
    }
    whenPageLoads(){
        this.push({event: 'optimize.activate'});
    }
    user(){
        let dogs = 0;
        let cats = 0;
        this.quote.pets.forEach((pet: Pet, index: number) => {
            if (pet.species.id === 1){
                cats++;
            }
            if (pet.species.id === 2){
                dogs++;
            }
        });
        return {
            memberStatus: this.quote.southernCrossSocietyMember,
            marketingInfo: this.quote.whereHearAboutUs.Description,
            alreadyInsured: this.quote.alreadyHavePetInsuranceUs,
            numberOfDogs: dogs,
            numberOfCats: cats
        };
    }

    petEventTrack(petIndex: number, ev: string, cat: string, act: string, lbl1: string, health = false) {
        const eecValue = [];
        if (petIndex === -1) {
            this.quote.pets.forEach((pet: Pet, index: number) => {
                eecValue.push(this.petEventDetails(pet, health));
            });
        } else {
            eecValue.push(this.petEventDetails(this.quote.pets[petIndex], health));
        }
        if (ev === 'purchase') {
            this.push({
                event: ev,
                event_info: {
                    category: cat,
                    action: act,
                    label_1: lbl1,
                    label_2: undefined,
                    label_3: undefined
                },
                user: this.user(),
                transaction: {
                    totalPremium: this.quote.quoteResultModel.Total,
                    applicationId: this.quote.quoteId,
                    discounts: this.quote.promoCode
                },
                eec: eecValue
            });
        } else {
            this.push({
                event: ev,
                event_info: {
                    category: cat,
                    action: act,
                    label_1: lbl1,
                    label_2: undefined,
                    label_3: undefined
                },
                eec: eecValue
            });
        }
    }
    petEventDetails(pet: Pet, health = false){
        const name = pet.selectedPlan === 'petcare' ? 'petcare - ' + pet.selectedLimitName + ' ribbon' : 'accipet';
        const result: any = {
            planName: name ,
            planSku: pet.selectedPlanNo,
            petType: pet.species.label,
            petBreed: pet.breed.Description,
            petAge: this.trackingAge(pet.dontKnowAge ? pet.dontKnowAgeDate : pet.ageDob),
            monthlyPremium: this.monthlyPremium(pet)
        };
        if (health) {
            result.healthConditions = `Lameness:${pet.lameness ? 'Y' : 'N'} ,`;
            result.healthConditions += `Vomiting or diarrhoea:${pet.vomitingDiarrhoea ? 'Y' : 'N'} ,`;
            result.healthConditions += `Skin conditions:${pet.skinEyeEarConditions ? 'Y' : 'N'} ,`;
            result.healthConditions += `Fight Injuries:${pet.injuriesAnimalFights ? 'Y' : 'N'} ,`;
            result.healthConditions += `Other ${pet.preExistingConditions ? 'Y' : 'N'}`;
        }
        return result;
    }
    monthlyPremium(pet: Pet): string{
        let total = 0;
        if (pet.animalQuote !== undefined && pet.animalQuote !== null) {
            total = pet.animalQuote.total;
        } else {
            if (pet.selectedPlan !== '') {
                if (pet.selectedPlan === 'petcare'){
                    if (pet.quoteResult !== undefined && pet.quoteResult !== null) {
                        total = pet.quoteResult.Total;
                    }
                } else {
                    if (pet.quoteAccipetResult !== undefined && pet.quoteAccipetResult !== null) {
                        total = pet.quoteAccipetResult.Total;
                    }
                }
            }
        }
        let result = total;
        if (result){
            switch (this.quote.paymentFrequency.Code) {
                case 'HALFYEARLY':
                    result = total / 6;
                    break;
                case 'QUARTERLY':
                    result = total / 3;
                    break;
                case 'YEARLY':
                    result = total / 12;
                    break;
            }
            return result.toFixed(2);
        }
        return '0.00';
    }
    trackingAge(dob: Date): string{
        const ageValues = new DateAge(dob, this.quote.policyStartDate);
        let result = '';
        if (ageValues.years === 0) {
            if (ageValues.months < 3) {
                result = 'Under 3 months';
            } else if (ageValues.months >= 6){
                result = '6-12 months';
            } else {
                result = '3-6 months';
            }
        } else {
            if (ageValues.years < 2) {
                result = '1-2 years';
            } else if (ageValues.years >= 5){
                result = '5+ years';
            } else {
                result = '2-5 years';
            }
        }
        return result;
    }
    eventPetInfo(ev: string, cat: string, act: string, lbl1: any, lbl2: any, lbl3: any, pets: Pet[]) {
        const data = {
            event: ev,
            event_info: {
                category: cat,
                action: act,
                label_1: lbl1,
                label_2: lbl2,
                label_3: lbl3
            },
            pet_info: []
        };
        pets.forEach( ( pet: Pet, index: number) => {
            let genderVal = 'Male';
            if (pet.gender.id === 1){
                genderVal = 'Female';
            }
            data.pet_info.push( {
                type: pet.species.label,
                gender: genderVal,
                breed: pet.breed.Description,
                age: this.trackingAge(pet.dontKnowAge ? pet.dontKnowAgeDate : pet.ageDob)
            });
        });
        this.push(data);
    }
    event(ev: string, cat: string, act: string, lbl1: any, lbl2: any, lbl3: any) {
        this.push({
            event: ev,
            event_info: {
                category: cat,
                action: act,
                label_1: lbl1,
                label_2: lbl2,
                label_3: lbl3
            }
        });
    }
    page(n: string, t: string ) {
        this.push({
            page: {
                name: n,
                title: t
            }
        });
    }
    pageEvent(ev: string, n: string, t: string ) {
        this.push({
            event: ev,
            page: {
                name: n,
                title: t
            }
        });
    }
    push(value: any) {
        // console.log('#### Tracking Event ####', value);
        window.dataLayer.push(value);
    }
}
