import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: 'app/pages/login/login.module#LoginModule',
    },
    {
        path: 'register',
        loadChildren: 'app/pages/register/register.module#RegisterModule',
    },

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'pages/dashboard' },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
