import { Plan } from './plan.model';

export class PetQuote {
    premium = 87.35;
    premiumplus = 87.35;
    discount = 6.54;
    total = 80.81;
    selectedLimit = 3;
    coPayment = '';
    premiumSummary = [];
    discountSummary = [];

    updateQuoteFromPlan(plan: Plan) {
        plan.updatePlan(plan.name, true);
        this.premium = plan.premium;
        this.premiumplus = plan.premiumplus;
        this.discount = plan.discount;
        this.total = plan.total;
        this.selectedLimit = plan.selectedLimit;
        this.coPayment = plan.getCoPayment();
    }
}
