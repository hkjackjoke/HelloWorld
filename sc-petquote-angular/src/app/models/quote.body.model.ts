import { QuoteAnimalModel } from './quote.animal.model';

export class QuoteBodyModel {
    public animals: Array<QuoteAnimalModel>;
    public inceptionDate: string;
    public paymentMethod: string;
    public paymentPeriod: string;
    public southernCrossmember: boolean;
    public ellencoMember: boolean;
    public promotionCode: string;
    public postCode: string;
    constructor() {
        this.animals = new Array<QuoteAnimalModel>();
    }
}
