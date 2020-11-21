import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { RoleGuard } from '../auth/role-guard';
// import { IngresosModule } from 'app/pages/ingresos/ingresos.module';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: 'app/pages/login/login.module#LoginModule',
    },
    {
        path: 'register',
        loadChildren: 'app/pages/register/register.module#RegisterModule',
    },
    {
        path: 'recoverypassword',
        loadChildren: 'app/pages/recoverypassword/recoverypassword.module#RecoverypasswordModule',
    },
    {
        path: 'pages',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule',
                canActivate: [RoleGuard],
                data: {
                    path: 'dashboard'
                }
            },
            {
                path: 'miempresa',
                loadChildren: './empresa/empresa.module#EmpresaModule',
                canActivate: [RoleGuard],
                data: {
                    path: 'miempresa'
                }
            },
            { path: 'bancos', loadChildren: './bancos/bancos.module#BancosModule', canActivate: [RoleGuard], data: { path: 'bancos' } },
            { path: 'editors', loadChildren: './editors/editors.module#EditorsModule' },
            { path: 'components', loadChildren: './components/components.module#ComponentsModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'ui', loadChildren: './ui/ui.module#UiModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
            { path: 'listaEgresos', loadChildren: './egresos/egresos.module#EgresosModule', canActivate: [RoleGuard], data: { path: 'listaEgresos' } },
            { path: 'nomina', loadChildren: './trabajadores/trabajadores.module#TrabajadoresModule', canActivate: [RoleGuard], data: { path: 'nomina' } },
            { path: 'listaIngresos', loadChildren: './ingresos/ingresos.module#IngresosModule', canActivate: [RoleGuard], data: { path: 'listaIngresos' } },
            { path: 'comprobantesFiscales', loadChildren: './comprobantesfiscales/comprobantesfiscales.module#ComprobantesfiscalesModule', canActivate: [RoleGuard], data: { path: 'comprobantesFiscales' } }
        ],
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
