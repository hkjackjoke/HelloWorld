export class BankAccountModel {
    constructor(
        public bankNumber: string,
        public branch: string,
        public account: string,
        public suffix: string
    ) { }

    toFormattedString(): string {
        return `${this.bankNumber}-${this.branch}-${this.account}-${this.suffix}`;
    }
}
