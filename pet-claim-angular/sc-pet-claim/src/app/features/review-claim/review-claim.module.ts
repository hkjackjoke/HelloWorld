import { NgModule } from '@angular/core';
import { ReviewClaimComponent } from './review-claim.component';
import { ReviewClaimRoutingModule } from './review-claim-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
      ReviewClaimComponent
    ],
    imports: [
      SharedModule,
      ReviewClaimRoutingModule
    ]
})
export class ReviewClaimModule { }
