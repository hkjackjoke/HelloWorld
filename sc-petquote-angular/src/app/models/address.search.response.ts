import { AddressSearchResponseAddress } from './address.search.reponse.address';

export class AddressSearchResponse {
    public addresses: Array<AddressSearchResponseAddress>;
    public totalResults: number;
    constructor(value: any, keyword: string) {
        this.addresses = new Array<AddressSearchResponseAddress>();
        this.totalResults = Number(value.totalItems);
        if (this.totalResults) {
            (value.result as Array<any>).forEach((item: any, index: number) => {
                this.addresses.push(new AddressSearchResponseAddress(item, keyword));
            });
        }
    }
}

