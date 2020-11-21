import { Routes, RouterModule } from '@angular/router';
import { IngresosComponent } from './ingresos.component';


const routes: Routes = [
    {
        path: '',
        component: IngresosComponent
    },
    {
        path: 'listaIngresos', component: IngresosComponent
    }
];

export const routing = RouterModule.forChild(routes);