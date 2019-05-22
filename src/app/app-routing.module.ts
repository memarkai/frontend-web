import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClinicComponent } from './clinic/clinic.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/clinic', pathMatch: 'full'
  },
  {
    path: 'clinic', component: ClinicComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
