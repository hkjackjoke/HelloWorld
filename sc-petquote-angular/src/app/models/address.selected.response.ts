export class AddressSelectResponse {
    public line1: string;
    public line2: string;
    public suburb: string;
    public city: string;
    public postCode: string;
    public dpId: string;
    public country: string;
    constructor(value: any) {
        this.line1 = value.result.line1;
        this.line2 = value.result.line2;
        this.suburb = value.result.suburb;
        this.city = value.result.city;
        this.postCode = value.result.postcode;
        this.dpId = value.result.dpId;
        this.country = value.result.country;
    }
}
