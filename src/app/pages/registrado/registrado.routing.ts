import { Routes, RouterModule } from '@angular/router';
import { RegistradoComponent } from './registrado.component';

const routes: Routes = [
    {
        path: '',
        component: RegistradoComponent
    },

    {
        path: 'registrado', component: RegistradoComponent,
    },
];

export const routing = RouterModule.forChild(routes);