import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren : ()=>import("./public/public.module").then(mod=>mod.PublicModule)
    },
    {
        path: 'admin',
        loadChildren : ()=>import("./secure/pages/super-admin/super-admin.module").then(mod=>mod.SuperAdminModule)
    },
    {
        path: 'gestion',
        loadChildren : ()=>import("./secure/pages/admin-gestion/admin-gestion.module").then(mod=>mod.AdminGestionModule)
    },
    {
        path: 'trader',
        loadChildren : ()=>import("./secure/pages/trader/trader.module").then(mod=>mod.TraderModule)
    },
    {
        path: 'validateur',
        loadChildren : ()=>import("./secure/pages/validateur/validateur.module").then(mod=>mod.ValidateurModule)
    },
];
