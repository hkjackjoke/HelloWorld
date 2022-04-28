import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimDetailsComponent } from './claim-details.component';

const routes: Routes = [
    {
      path: '',
      component: ClaimDetailsComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimDetailsRoutingModule{}
