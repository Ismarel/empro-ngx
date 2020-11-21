import { Routes, RouterModule } from '@angular/router';

import { EmpresaComponent } from './empresa.component';
import { ConceptosComponent } from '../conceptos/conceptos.component';
import { ClientesComponent } from 'app/pages/clientes';

import { UsuariosComponent } from 'app/pages/usuarios/usuarios.component';

import { ProveedoresComponent } from '../proveedores/proveedores.component';
import { SucursalesComponent } from '../sucursales/sucursales.component';
import { PerfilComponent } from 'app/pages/perfil/perfil.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: EmpresaComponent,
    },

    {
        path: 'empresa', component: EmpresaComponent,
    },

    {
        path: 'conceptos', component: ConceptosComponent,
    },

    {
        path: 'clientes', component: ClientesComponent,
    },

    {
        path: 'usuarios', component: UsuariosComponent,
    },

    {
        path: 'proveedores', component: ProveedoresComponent,
    },

    {
        path: 'sucursales', component: SucursalesComponent,
    },
    {
        path: 'perfil', component: PerfilComponent,
    },
];

export const routing = RouterModule.forChild(routes);
