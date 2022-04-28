import { NgModule } from '@angular/core';
import { UploadDocumentsComponent } from './upload-documents.component';
import { UploadDocumentsRoutingModule } from './upload-documents-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
      UploadDocumentsComponent
    ],
    imports: [
      SharedModule,
      UploadDocumentsRoutingModule
    ]
})
export class UploadDocumentsModule { }
