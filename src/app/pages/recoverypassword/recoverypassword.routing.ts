import { Routes, RouterModule } from '@angular/router';

import { RecoverypasswordComponent } from './recoverypassword.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
    {
        path: '',
        component: RecoverypasswordComponent,
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
