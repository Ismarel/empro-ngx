import { Routes, RouterModule } from '@angular/router';
import { ComprobantesfiscalesComponent } from './comprobantesfiscales.component';

const routes: Routes = [
    {
        path: '',
        component: ComprobantesfiscalesComponent,
    },

    {
        path: 'comprobantesFiscales', component: ComprobantesfiscalesComponent,
    },

];

export const routing = RouterModule.forChild(routes);