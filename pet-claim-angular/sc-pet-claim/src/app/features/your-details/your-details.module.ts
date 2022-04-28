import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YourDetailsRoutingModule } from './your-details-routing.module';
import { YourDetailsComponent } from './your-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
      YourDetailsComponent
    ],
    imports: [
      SharedModule,
      YourDetailsRoutingModule
    ]
})
export class YourDetailsModule { }
