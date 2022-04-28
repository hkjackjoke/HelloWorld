export class CustomerLeadModel {
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
  public leadPreferences: Array<any> = new Array<any>();
  public quoteId = "";
  public isExistingPetCustomer: boolean = false;
  public isSCHSMember: boolean = false;
  public engagementChannel = "";
  public promoCode = "";
  public pets: Array<PetModel> = new Array<PetModel>();
  public update(value: any): void {
    this.leadId = value.leadId;
    value.pets.forEach((value: any, index: number) => {
      this.pets[index].petId = value.petId;
    });
  }
}

export class PetModel {
  public petId = "";
  public petName = "";
  public animal = "";
  public animalBreed = "";
  public dob: Date = null;
  public gender = "";
}
