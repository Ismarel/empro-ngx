import { Routes, RouterModule } from '@angular/router';
import { TrabajadoresComponent } from './trabajadores.component';
import { CfdiComponent } from "app/pages/cfdi/cfdi.component";
import { PercepcionesComponent } from '../percepciones/percepciones.component';
import { DeduccionesComponent } from '../deducciones/deducciones.component';
import { NominaComponent } from '../nomina/nomina.component';

const routes: Routes = [
    {
        path: '',
        component: TrabajadoresComponent
    },

    {
        path: 'trabajadores', component: TrabajadoresComponent,
    },
    {
        path: 'cfdi', component: CfdiComponent,
    },
    {
        path: 'percepciones', component: PercepcionesComponent,
    },
    {
        path: 'deducciones', component: DeduccionesComponent,
    },
    {
        path: 'nomina', component: NominaComponent,
    }
];

export const routing = RouterModule.forChild(routes);