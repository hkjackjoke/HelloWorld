import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadDocumentsComponent } from './upload-documents.component';


const routes: Routes = [
    {
      path: '',
      component: UploadDocumentsComponent
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadDocumentsRoutingModule{}
