import { Routes, RouterModule } from '@angular/router';
import { CuentasComponent } from './cuentas.component';
import { GestioncuentasComponent } from './gestioncuentas/gestioncuentas.component';
import { GestiontarjetasComponent } from './gestiontarjetas/gestiontarjetas.component';
import { GestionchequerasComponent } from './gestionchequeras/gestionchequeras.component';
import { EstadoscuentaComponent } from './estadoscuenta/estadoscuenta.component';

const routes: Routes = [
    {
        path: '',
        component: CuentasComponent,
    },

    {
        path: 'cuentas', component: CuentasComponent,
    },

    {
        path: 'cuentasgestion', component: GestioncuentasComponent,
    },

    {
        path: 'tarjetasgestion', component: GestiontarjetasComponent,
    },

    {
        path: 'chequerasgestion', component: GestionchequerasComponent,
    },

    {
        path: 'estadoscuenta', component: EstadoscuentaComponent,
    },
];

export const routing = RouterModule.forChild(routes);
