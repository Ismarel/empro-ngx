import { Routes, RouterModule } from '@angular/router';
import { BancosComponent } from './bancos.component';
import { CajasComponent } from './cajas/cajas.component';
import { CuentasComponent } from './cuentas/cuentas.component';

const routes: Routes = [
    {
        path: '',
        component: BancosComponent,
    },
    {
        path: 'bancos', component: BancosComponent,
    },

    {
        path: 'cuentas', loadChildren: './cuentas/cuentas.module#CuentasModule',
    },

    {
        path: 'cajas', component: CajasComponent,
    },
];

export const routing = RouterModule.forChild(routes);