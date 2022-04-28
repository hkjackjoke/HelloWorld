import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewClaimComponent } from './review-claim.component';

const routes: Routes = [
    {
      path: '',
      component: ReviewClaimComponent
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReviewClaimRoutingModule{}
