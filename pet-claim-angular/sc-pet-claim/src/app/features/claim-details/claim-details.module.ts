import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimDetailsRoutingModule } from './claim-details-routing.module';
import { ClaimDetailsComponent } from './claim-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
      ClaimDetailsComponent
    ],
    imports: [
      SharedModule,
      ClaimDetailsRoutingModule
    ]
})
export class ClaimDetailsModule { }
