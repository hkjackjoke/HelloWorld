export class AddressSearchResponseAddress {
    public addressId: string;
    public labelAddress: string;
    public partialAddress: string;

    constructor(value: any, keyword: string) {
        this.addressId = value.addressId;
        this.labelAddress = value.partialAddress.split(keyword).join('<span>' + keyword + '</span>');
        this.partialAddress = value.partialAddress;
    }
}
