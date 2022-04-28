import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YourDetailsComponent } from './your-details.component';

const routes: Routes = [
    {
      path: '',
      component: YourDetailsComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YourDetailsRoutingModule{}
