import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SecurityServiceImpl } from './core/services/impl/security.service.impl';
import { AuthenticationGuard } from './core/guards/authentication.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren : ()=>import("./public/public.module").then(mod=>mod.PublicModule)
    },
    {
        path: 'admin',
        loadChildren : ()=>import("./secure/pages/super-admin/super-admin.module").then(mod=>mod.SuperAdminModule),
        canMatch:[AuthenticationGuard]
    },
    {
        path: 'gestion',
        loadChildren : ()=>import("./secure/pages/admin-gestion/admin-gestion.module").then(mod=>mod.AdminGestionModule),
        canMatch:[AuthenticationGuard]
    },
    {
        path: 'institut',
        loadChildren : ()=>import("./secure/pages/admin-institut/admin-institut.module").then(mod=>mod.AdminInstitutModule),
        canMatch:[AuthenticationGuard]
    },
    {
        path: 'trader',
        loadChildren : ()=>import("./secure/pages/trader/trader.module").then(mod=>mod.TraderModule),
        canMatch:[AuthenticationGuard]
    },
    {
        path: 'validateur',
        loadChildren : ()=>import("./secure/pages/validateur/validateur.module").then(mod=>mod.ValidateurModule),
        canMatch:[AuthenticationGuard]
    },
];
