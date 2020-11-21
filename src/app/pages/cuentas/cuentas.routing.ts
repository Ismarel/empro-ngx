import { Routes, RouterModule } from '@angular/router';
import { CuentasComponent } from "app/pages/cuentas/cuentass.component";
import { BancosComponent } from "app/pages/bancos/bancos.component";





// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: CuentasComponent,
    }
    , {
        path: 'bancos', component: BancosComponent,
    }

];

export const routing = RouterModule.forChild(routes);
