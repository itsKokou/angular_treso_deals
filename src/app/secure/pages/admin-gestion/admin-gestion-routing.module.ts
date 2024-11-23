import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionLayoutComponent } from '../../layouts/gestion-layout/gestion-layout.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ProfilsComponent } from './profils/profils.component';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';

const routes: Routes = [
  {
    path: '',
    component: GestionLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashbordComponent
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
export class AdminGestionRoutingModule { }
