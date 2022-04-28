import { Pet } from "./pet.model";
import { ValidateModel } from "./validate.model";
import { QuoteBodyModel } from "./quote.body.model";
import { QuoteAnimalModel } from "./quote.animal.model";
import { QuoteAnimalProduct } from "./quote.animal.product.model";
import { PaymentMethodModel } from "./payment.method.model";
import { PaymentFrequencyModel } from "./payment.frequency.model";
import { QuoteResultModel } from "./quote.result.model";
import { EmailBodyModel } from "./email.body.model";
import { ReferralModel } from "./referral.model";
import { ApplicationBodyModel } from "./application.body.model";
import { TitlesModel } from "./titles.model";
import { ApplicationAuthorizedPersonModel } from "./application.authorized.person.model";
import { AddressModel } from "./address.model";
import { CopyModel } from "./copy.model";
import { PlansListItemOption } from "./plans-list.model";
import { CustomerLeadModel } from "./customer-lead.model";


export class QuoteModel {
    static instance: QuoteModel;
    public customerLead: CustomerLeadModel = new CustomerLeadModel();
    public quoteResultModel: QuoteResultModel;
    public accipetQuote: QuoteResultModel;
    public planConfig: Map<string, number>;
    public selectedPlanNo: number;
    public selectedExcessNo: number;
    public selectedAcciPetExcessNo: number;
    public selectedPet: Pet;
    public pets: Array<Pet> = new Array<Pet>();
    public policyStartDate: Date;
    public paymentMethod: PaymentMethodModel;
    public paymentFrequency: PaymentFrequencyModel;
    public title = new TitlesModel("", "", " ", -1);
    public leadId = "";
    public firstname = "";
    public lastname = "";
    public dob: Date;
    public email = "";
    public quoteEmail = "";
    public phone = "";
    public address = new AddressModel();
    public addressIsManual = false;
    public wantToRecieveMarketingPromotional = false;
    public alreadyHavePetInsuranceUs: boolean;
    public southernCrossSocietyMember: boolean;
    public addAnotherAuthorisedPerson = false;
    public petInsuranceNumber = "";
    public memberCardNumber = "";
    public memberNumber = "";
    public otherTitle = new TitlesModel("", "", " ", -1);
    public otherFirstname = "";
    public otherLastname = "";
    public otherDOB: Date;
    public otherPhone = "";
    public otherEmail = "";
    public authorisedToDiscloseOther: boolean;
    public whereHearAboutUs = new ReferralModel("", "", "", -1);
    public promoCode = "";
    public authorityToOperateBankAccount: boolean;
    public paymentDate: Date;
    public agreedTerms = false;
    public agreedCreditCardTerms = false;
    public readDeclaration = false;
    public paymentDeclined = false;
    public receiveEmailsAboutEllenco = false;
    public receiveEmailsAboutSx = false;
    public hasShownOtherPerson = false;

    public quoteId = 0;
    public securityHash: string;

    private bankAccountHolderNameField = "";
    public get bankAccountHolderName(): string {
        return this.paymentMethod?.Code === "CREDIT" ? "" : this.bankAccountHolderNameField;
    }
    public set bankAccountHolderName(value: string) {
        this.bankAccountHolderNameField = value;
    }

    private bankAccountNumberField = "";
    public get bankAccountNumber(): string {
        return this.paymentMethod?.Code === "CREDIT" ? "" : this.bankAccountNumberField;
    }
    public set bankAccountNumber(value: string) {
        this.bankAccountNumberField = value;
    }

    static getInstance(): QuoteModel {
        if (QuoteModel.instance === undefined) {
            QuoteModel.instance = new QuoteModel();
        }
        return QuoteModel.instance;
    }

    public validateEmail(email: string): boolean {
        const reg: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    }
    public validateDate(date: string): boolean {
        return ValidateModel.validateDOB(date);
    }
    public reset(): void {
        this.pets = new Array<Pet>();
        this.title = new TitlesModel("", "", " ", -1);
        this.otherTitle = new TitlesModel("", "", " ", -1);
        this.whereHearAboutUs = new ReferralModel("", "", "", -1);
        this.selectedPlanNo = 0;
        this.selectedExcessNo = 0;
        this.selectedAcciPetExcessNo = 0;
        this.dob = undefined;
        this.leadId = "";
        this.firstname = "";
        this.lastname = "";
        this.email = "";
        this.quoteEmail = "";
        this.phone = "";
        this.address = new AddressModel();
        this.addressIsManual = false;
        this.wantToRecieveMarketingPromotional = false;
        this.alreadyHavePetInsuranceUs = undefined;
        this.southernCrossSocietyMember = undefined;
        this.addAnotherAuthorisedPerson = false;
        this.petInsuranceNumber = "";
        this.memberCardNumber = "";
        this.memberNumber = "";
        this.otherTitle = new TitlesModel("", "", " ", -1);
        this.otherFirstname = "";
        this.otherLastname = "";
        this.otherDOB = undefined;
        this.otherPhone = "";
        this.otherEmail = "";
        this.authorisedToDiscloseOther = undefined;
        this.whereHearAboutUs = new ReferralModel("", "", "", -1);
        this.promoCode = "";
        this.authorityToOperateBankAccount = undefined;
        this.bankAccountHolderName = "";
        this.bankAccountNumber = "";
        this.paymentDate = undefined;
        this.agreedTerms = false;
        this.agreedCreditCardTerms = false;
        this.readDeclaration = false;
        this.paymentDeclined = false;
        this.receiveEmailsAboutEllenco = false;
        this.receiveEmailsAboutSx = false;
        this.hasShownOtherPerson = false;
        this.quoteId = 0;
        this.securityHash = undefined;
    }
    public removePet(index: number): void {
        this.pets.splice(index, 1);
    }
    public cancelapplication(): void {
        this.pets = new Array<Pet>();
    }
    public quoteBody(planNo: number, excessNo: number, petIndex: number, allowOptions: boolean = true): QuoteBodyModel {

        const m: QuoteBodyModel = new QuoteBodyModel();
        m.animals = new Array<QuoteAnimalModel>();
        m.inceptionDate = CopyModel.dateToString(this.policyStartDate);
        m.paymentMethod = this.paymentMethod === undefined ? "DD" : this.paymentMethod.Code;
        m.paymentPeriod = this.paymentFrequency === undefined ? "MONTHLY" : this.paymentFrequency.Code;
        m.southernCrossmember = this.southernCrossSocietyMember;
        m.ellencoMember = this.alreadyHavePetInsuranceUs === null ? false : this.alreadyHavePetInsuranceUs;
        m.promotionCode = this.promoCode;
        m.postCode = this.address.postCode;
        this.pets.forEach((pet: Pet, index: number) => {
            if (index === petIndex || petIndex === -1) {
                const p: QuoteAnimalModel = new QuoteAnimalModel();
                p.breedCode = pet.breed.Code;
                p.dob = pet.dontKnowAge ? CopyModel.dateToString(pet.dontKnowAgeDate) : CopyModel.dateToString(pet.ageDob);
                p.speciesCode = pet.breed.Species;
                p.order = index + 1;
                const prod: QuoteAnimalProduct = new QuoteAnimalProduct();
                if (!excessNo) {
                    prod.excessNo = this.getExcessNo(pet);
                } else {
                    prod.excessNo = excessNo;
                }
                if (!planNo) {
                    prod.planNo = this.getPetPlanNo(pet);
                } else {
                    prod.planNo = planNo;
                }
                if (allowOptions && pet.selectedPlan === "petcare") {
                    const options: Map<string,PlansListItemOption> = CopyModel.getPlanOptions(prod.planNo);
                    pet.selectedPlanOptions.forEach((value: PlansListItemOption, key: string) => {
                        const option: PlansListItemOption = options.get(value.optionCode);
                        prod.addOption(option.optionNo, prod.planNo, 1);
                    });
                }
                p.products.push(prod);
                m.animals.push(p);
            }
        });
        return m;
    }
    public emailBody(name: string, email: string): EmailBodyModel {
        const m: EmailBodyModel = new EmailBodyModel();
        m.quoteEmail = email;
        m.firstName = name;
        m.lastName = "";
        m.preferredContactMethod = 0;
        m.ellencoClient = this.quoteResultModel.EllencoMember;
        m.southernCrossMember = this.southernCrossSocietyMember;
        m.whereDidYouHearCode = this.whereHearAboutUs.Code;
        m.policyDate = CopyModel.dateToString(this.policyStartDate);
        m.paymentFrequencyCode = this.paymentFrequency.Code;
        m.paymentMethodCode = this.paymentMethod.Code;
        m.bankAccountBSB = "";
        m.firstCollectionDate = "";
        m.promotionalCode = this.promoCode;
        this.pets.forEach((pet: Pet, index: number) => {
            pet.selectedPlanNo = this.getPetPlanNo(pet);
            pet.selectedExcessNo = this.getExcessNo(pet);
            m.addPet(pet, this.quoteId);
        });
        return m;
    }
    public applicationBody(): ApplicationBodyModel {
        const m: ApplicationBodyModel = new ApplicationBodyModel();
        m.address = this.address.street;
        m.advisorNo = undefined;
        m.agreeToTermsAndConditions = this.agreedTerms;
        m.bankAccountBSB = "";
        m.bankAccountName = this.bankAccountHolderName;
        m.bankAccountNumber = this.bankAccountNumber;
        m.city = this.address.city;
        m.clientType = null;
        m.dateOfBirth = CopyModel.dateToString(this.dob);
        m.dpid = "";
        m.ellencoClient = this.alreadyHavePetInsuranceUs === null || this.alreadyHavePetInsuranceUs === undefined
            ? false : this.alreadyHavePetInsuranceUs;
        m.email = this.email;
        m.firstCollectionDate = CopyModel.dateToString(this.paymentDate);
        m.firstName = this.firstname;
        m.lastName = this.lastname;
        m.paymentFrequencyCode = this.paymentFrequency.Code;
        m.paymentMethodCode = this.paymentMethod.Code;
        m.paymentPage = null;
        m.phoneNumber = this.phone;
        m.policyDate = CopyModel.dateToString(this.policyStartDate);
        m.postcode = this.address.postCode;
        m.preferredContactMethod = 0;
        m.promotionalCode = this.promoCode;
        m.quoteEmail = this.email;
        m.quoteId = this.quoteId;
        m.receiveEmailsAboutEllenco = false;
        m.receiveEmailsAboutSx = this.wantToRecieveMarketingPromotional;
        m.residentialAddress = "";
        m.residentialCity = "";
        m.residentialPostcode = "";
        m.residentialSuburb = "";
        m.residentialSuburb = "";
        m.securityHash = this.securityHash;
        m.southernCrossMember = this.southernCrossSocietyMember;
        m.southernCrossMemberNumber = this.southernCrossSocietyMember ? this.memberNumber : "";
        m.existingClientNumber = m.ellencoClient && this.petInsuranceNumber.trim() !== "" ? this.petInsuranceNumber : "";
        m.status = 0;
        m.submit = null;
        m.suburb = this.address.suburb;
        m.titleCode = this.title.Code;
        m.whereDidYouHearCode = this.whereHearAboutUs.Code;
        m.successURL = `${window.location.origin}/quote/success`;
        m.failureURL = `${window.location.origin}/quote/failure`;
        m.receiveEmailsAboutEllenco = this.receiveEmailsAboutEllenco;
        m.receiveEmailsAboutSx = this.receiveEmailsAboutSx;

        if (this.addAnotherAuthorisedPerson) {
            const ap: ApplicationAuthorizedPersonModel = new ApplicationAuthorizedPersonModel();
            ap.quoteId = this.quoteId === 0 ? null : this.quoteId;
            ap.firstName = this.otherFirstname;
            ap.lastName = this.otherLastname;
            ap.email = this.otherEmail;
            ap.dateOfBirth = CopyModel.dateToString(this.otherDOB);
            ap.phoneNumber = this.otherPhone;
            ap.titleCode = this.otherTitle.Code;
            m.authorisedPeople.push(ap);
        }
        this.pets.forEach((pet: Pet, index: number) => {
            pet.selectedPlanNo = this.getPetPlanNo(pet);
            pet.selectedExcessNo = this.getExcessNo(pet);
            m.addPet(pet, this.quoteId);
        });
        return m;
    }
    public getPetPlanNo(pet: Pet): number {
        if (pet.selectedPlan === "accipet" || pet.overPetCareLimit) {
            return this.planConfig.get("accipet");
        } else {
            return this.planConfig.get(pet.selectedLimitName);
        }
    }
    public getExcessNo(pet: Pet): number {
        if (pet.selectedPlan === "accipet" || pet.overPetCareLimit) {
            return this.planConfig.get("accipet-excess-" + (pet.accipetCoPayment ? "yes" : "no"));
        } else {
            return this.planConfig.get(pet.selectedLimitName + "-excess-" + (pet.petcareCoPayment ? "yes" : "no"));
        }
    }
    public setState(m: ApplicationBodyModel): void {
        this.address = new AddressModel();
        this.address.street = m.address;
        this.address.suburb = m.suburb;
        this.address.city = m.city;
        this.address.postCode = m.postcode;
        this.address.partialAddress = m.address + ", " + m.suburb + " " + m.city;

        this.agreedTerms = m.agreeToTermsAndConditions;
        this.readDeclaration = m.agreeToTermsAndConditions;
        this.bankAccountHolderName = m.bankAccountName;
        this.bankAccountNumber = m.bankAccountNumber;
        this.dob = CopyModel.stringToDate(m.dateOfBirth);
        this.email = m.email;
        this.memberNumber = m.southernCrossMemberNumber;
        this.paymentDate = CopyModel.stringToDate(m.firstCollectionDate);
        this.firstname = m.firstName;
        this.lastname = m.lastName;
        this.paymentFrequency = CopyModel.getPaymentFrequency(m.paymentFrequencyCode);
        this.paymentMethod = CopyModel.getPaymentMethod(m.paymentMethodCode);
        this.phone = m.phoneNumber;
        this.policyStartDate = CopyModel.stringToDate(m.policyDate);
        this.promoCode = m.promotionalCode;
        this.quoteEmail = m.quoteEmail;
        this.quoteId = m.quoteId;
        this.wantToRecieveMarketingPromotional = m.receiveEmailsAboutSx;
        this.securityHash = m.securityHash;
        this.southernCrossSocietyMember = m.southernCrossMember === null ? false : m.southernCrossMember;
        this.memberCardNumber = m.southernCrossMemberNumber;
        this.petInsuranceNumber = m.existingClientNumber.replace("P", "");
        this.alreadyHavePetInsuranceUs = m.ellencoClient;
        this.title = CopyModel.getTitle(m.titleCode);
        this.whereHearAboutUs = CopyModel.getReferral(m.whereDidYouHearCode);
        this.pets = m.getPets(this.policyStartDate);
        this.receiveEmailsAboutEllenco = m.receiveEmailsAboutEllenco;
        this.receiveEmailsAboutSx = m.receiveEmailsAboutSx;
        m.authorisedPeople.forEach((value: ApplicationAuthorizedPersonModel, index: number) => {
            this.addAnotherAuthorisedPerson = true;
            this.authorisedToDiscloseOther = true;
            this.otherFirstname = value.firstName;
            this.otherLastname = value.lastName;
            this.otherEmail = value.email;
            this.otherDOB = CopyModel.stringToDate(value.dateOfBirth);
            this.otherPhone = value.phoneNumber;
            this.otherTitle = CopyModel.getTitle(value.titleCode);
        });
    }
}
