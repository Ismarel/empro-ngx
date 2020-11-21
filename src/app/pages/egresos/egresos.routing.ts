import { Routes, RouterModule } from '@angular/router';
import { EgresosComponent } from './egresos.component';

const routes: Routes = [
    {
        path: '',
        component: EgresosComponent,
    },

    {
        path: 'listaEgresos', component: EgresosComponent,
    },

];

export const routing = RouterModule.forChild(routes);