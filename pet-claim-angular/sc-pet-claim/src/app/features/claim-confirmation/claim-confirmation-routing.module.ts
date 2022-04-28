import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimConfirmationComponent } from './claim-confirmation.component';


const routes: Routes = [
    {
      path: '',
      component: ClaimConfirmationComponent
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClaimConfirmationRoutingModule{}
