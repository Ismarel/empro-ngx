import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ServiciosBackendComponent } from './servicios-backend.component'
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
    { path: 'servicios', component: ServiciosBackendComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
