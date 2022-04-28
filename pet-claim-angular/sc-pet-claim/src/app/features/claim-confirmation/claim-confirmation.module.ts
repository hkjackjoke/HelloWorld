import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimConfirmationRoutingModule } from './claim-confirmation-routing.module';
import { ClaimConfirmationComponent } from './claim-confirmation.component';

@NgModule({
    declarations: [
      ClaimConfirmationComponent
    ],
    imports: [
      CommonModule,
      ClaimConfirmationRoutingModule
    ]
})
export class ClaimConfirmationModule { }
