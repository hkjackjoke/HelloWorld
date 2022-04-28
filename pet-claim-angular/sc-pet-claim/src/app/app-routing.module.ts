import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'your-details',
    loadChildren: () => import('./features/your-details/your-details.module').then(m => m.YourDetailsModule)
  },
  {
    path: 'claim-details',
    loadChildren: () => import('./features/claim-details/claim-details.module').then(m => m.ClaimDetailsModule)
  },
  {
    path: 'upload-documents',
    loadChildren: () => import('./features/upload-documents/upload-documents.module').then(m => m.UploadDocumentsModule)
  },
  {
    path: 'review-claim',
    loadChildren: () => import('./features/review-claim/review-claim.module').then(m => m.ReviewClaimModule)
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./features/claim-confirmation/claim-confirmation.module').then(m => m.ClaimConfirmationModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
