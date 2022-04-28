import { EmailPetOptionBodyModel } from './email.pet.option.body.model';

export class EmailPetBodyModel {
    public quoteId: any;
    public petOrderId: number;
    public dateOfBirthUnknown: boolean;
    public petSpecies: string;
    public petName: string;
    public petSex: string;
    public dateOfBirth: string;
    public approximateAge: string;
    public approximateAgeCode: string;
    public petBreedCode: string;
    public planId: number;
    public excessId: number;
    public optionals = new Array<EmailPetOptionBodyModel>();
}
