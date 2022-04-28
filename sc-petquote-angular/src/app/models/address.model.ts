export class AddressModel {
    public street = '';
    public suburb = '';
    public city = '';
    public postCode = '';
    public country = 'New Zealand';
    public partialAddress = '';

    public isValid(userPartial: boolean = true): boolean {
        let valid = true;
        if (this.partialAddress.trim() === '' && userPartial) {
            valid = false;
        }
        if (this.street.trim() === '') {
            valid = false;
        }
        if (this.postCode.trim() === '') {
            valid = false;
        }
        if (this.city.trim() === '') {
            valid = false;
        }
        if (this.postCode.trim() === '') {
            valid = false;
        }
        if (this.country.trim() === '') {
            valid = false;
        }
        return valid;
    }
    public reset() {
        this.street = '';
        this.suburb = '';
        this.city = '';
        this.postCode = '';
        this.country = 'New Zealand';
        this.partialAddress = '';
    }
}
