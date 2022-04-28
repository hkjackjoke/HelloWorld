import { QuoteAnimalModel } from './quote.animal.model';
import { QuoteAnimalProduct } from './quote.animal.product.model';

export class QuoteResultModel {

    public Animals = new Array<QuoteAnimalModel>();
    public Dob: any;
    public EllencoMember: boolean;
    public GrandMaster: string;
    public InceptionDate: string;
    public PaymentMethod: string;
    public PaymentPeriod: string;
    public Postcode: any;
    public PromotionCode: any;
    public SouthernCrossMember: boolean;
    public Total: number;

    constructor(data: any) {
        this.Dob = data.dob;
        this.EllencoMember = data.ellencoMember;
        this.GrandMaster = data.grandMaster;
        this.InceptionDate = data.inceptionDate;
        this.PaymentMethod = data.paymentMethod;
        this.PaymentPeriod = data.paymentPeriod;
        this.Postcode = data.postcode;
        this.PromotionCode = data.promotionCode;
        this.SouthernCrossMember = data.southernCrossMember;
        this.Total = data.total;

        if (data.animals !== undefined) {
            data.animals.forEach((value: any, index: number) => {
                const pet = new QuoteAnimalModel();
                pet.breedCode = value.breedCode;
                pet.dob = value.dob;
                pet.speciesCode = value.speciesCode;
                pet.total = value.total;
                pet.order = index;
                value.products.forEach((prod: any, i: number) => {
                    const p = new QuoteAnimalProduct();
                    p.planNo = prod.planNo;
                    p.excessNo = prod.excessNo;
                    p.basePremium = prod.basePremium;
                    prod.loadings.forEach((load: any, n: number) => {
                        p.addQuoteLoading(load);
                    });
                    prod.options.forEach((opt: any, n: number) => {
                        p.addQuoteOption(opt);
                    });
                    pet.products.push(p);
                });
                this.Animals.push(pet);
            });
        }
    }
}
