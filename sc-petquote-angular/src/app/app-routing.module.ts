import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PetDetailsComponent } from "./pages/pet-details/pet-details.component";
import { DiscountQualificationComponent } from "./pages/discount-qualification/discount-qualification.component";
import { ChoosePlanComponent } from "./pages/choose-plan/choose-plan.component";
import { QuoteSummaryComponent } from "./pages/quote-summary/quote-summary.component";
import { ApplyComponent } from "./pages/apply/apply.component";
import { MorePetDetailsComponent } from "./pages/more-pet-details/more-pet-details.component";
import { ApplySummaryComponent } from "./pages/apply-summary/apply-summary.component";
import { PaymentComponent } from "./pages/payment/payment.component";
import { SubmitComponent } from "./pages/submit/submit.component";
import { PaperlessDirectDebitComponent } from "./pages/paperless-direct-debit/paperless-direct-debit.component";
import { ApplicantDetailsComponent } from "./pages/applicant-details/applicant-details.component";

const routes: Routes = [
  { path: "", component: PetDetailsComponent },
  { path: "applicant-details", component: ApplicantDetailsComponent },
  { path: "discount-qualification", component: DiscountQualificationComponent },
  { path: "choose-a-plan", component: ChoosePlanComponent },
  { path: "quote-summary", component: QuoteSummaryComponent },
  { path: "apply/about-you", component: ApplyComponent },
  { path: "apply/some-more-pet-details", component: MorePetDetailsComponent },
  { path: "apply/summary", component: ApplySummaryComponent },
  { path: "apply/payment", component: PaymentComponent },
  { path: "apply/submit", component: SubmitComponent },
  { path: "apply/direct-debit", component: PaperlessDirectDebitComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: "reload",
    relativeLinkResolution: "legacy"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
