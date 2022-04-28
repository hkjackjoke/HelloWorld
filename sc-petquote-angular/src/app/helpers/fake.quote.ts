import QuoteData from '../data/quote-base.json';
import QuoteAnimal from '../data/quote-animal.json';
import { QuoteBodyModel } from '../models/quote.body.model';
import { QuoteAnimalModel } from '../models/quote.animal.model';

export class FakeQuote {

    static quoteData: any = QuoteData;
    static quoteAnimal: any = QuoteAnimal;
    public result: any;
    constructor(quoteBody: QuoteBodyModel) {
        this.result = FakeQuote.quoteData;
        this.result.Animals = [];
        quoteBody.animals.forEach((value: QuoteAnimalModel, index: number) => {
            this.result.Animals.push(FakeQuote.quoteAnimal);
        });
    }
    data(): any {
        return this.result;
    }
}
