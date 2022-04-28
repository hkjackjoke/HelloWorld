import { QuoteAnimalProduct } from './quote.animal.product.model';

export class QuoteAnimalModel {
    public dob: string;
    public breedCode: string;
    public speciesCode: string;
    public order: number;
    public total: number;
    public products: Array<QuoteAnimalProduct>;

    constructor() {
        this.products = new Array<QuoteAnimalProduct>();
    }
}
