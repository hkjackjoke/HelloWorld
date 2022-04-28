export class ApplicantModel {
    public token = "";
    public leadId = "";
    public firstName = "";
    public lastName = "";
    public email = "";
    public contactNumber = "";
    public leadType = "pet qote";
    public channel = null;
    public leadScore = "";
    public status = "";
    public state = "";
    public quoteId = "";
    public isExistingPetCustomer = "";
    public isSCHSMember = "";
    public engagementChannel = "";
    public promoCode = "";
    public leadPreferences:Array<any> = new Array<any>();
    public pets:Array<ApplicantPetModel> = new Array<ApplicantPetModel>();
    public update(value: any):void {
        this.leadId = value.leadId;
        value.pets.forEach((value: any, index: number) => {
            this.pets[index].petId = value.petId;
        });
    }
}
export class ApplicantPetModel {
    public petId = "";
    public petName = "";
    public animal = "";
    public animalBreed = "";
    public dob = "";
    public gender = "";
}