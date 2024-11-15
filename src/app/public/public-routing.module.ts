import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AddProfilInstitutComponent } from './pages/add-profil-institut/add-profil-institut.component';
import { AddProfilIntermediaireComponent } from './pages/add-profil-intermediaire/add-profil-intermediaire.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path : "add/profil/institut",
        component: AddProfilInstitutComponent
      },
      {
        path : "add/profil/intermediaire",
        component: AddProfilIntermediaireComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
