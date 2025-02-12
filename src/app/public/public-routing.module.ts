import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProfilInstitutComponent } from './pages/add-profil-institut/add-profil-institut.component';
import { AddProfilIntermediaireComponent } from './pages/add-profil-intermediaire/add-profil-intermediaire.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ValidationPageComponent } from './pages/validation-page/validation-page.component';
import { SecurityServiceImpl } from '../core/services/impl/security.service.impl';
import { AuthenticationGuard } from '../core/guards/authentication.guard';
import { CguPageComponent } from './pages/cgu-page/cgu-page.component';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';

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
    component: ValidationPageComponent,
    canMatch:[AuthenticationGuard]
  },
  {
    path: "conditions/generales",
    component: CguPageComponent,
    // canMatch:[AuthenticationGuard]
  },
  {
    path: "change/password",
    component: ChangePasswordPageComponent,
    // canMatch:[AuthenticationGuard]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
