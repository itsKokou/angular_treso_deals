import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitutLayoutComponent } from '../../layouts/institut-layout/institut-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfilsComponent } from './profils/profils.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'profils',
        component: ProfilsComponent
      },
      {
        path: 'utilisateurs',
        component: UtilisateursComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInstitutRoutingModule { }
