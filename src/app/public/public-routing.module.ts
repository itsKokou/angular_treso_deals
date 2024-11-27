import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProfilInstitutComponent } from './pages/add-profil-institut/add-profil-institut.component';
import { AddProfilIntermediaireComponent } from './pages/add-profil-intermediaire/add-profil-intermediaire.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ValidationPageComponent } from './pages/validation-page/validation-page.component';

const routes: Routes = [
  {
    path : "add/profil/institut",
    component: AddProfilInstitutComponent
  },
  {
    path : "add/profil/intermediaire",
    component: AddProfilIntermediaireComponent
  },
  {
    path : "login",
    component: LoginPageComponent
  },
  {
    path : "",
    redirectTo: "/login",
    pathMatch: "full" 
  },
  {
    path: "validation",
    component: ValidationPageComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
