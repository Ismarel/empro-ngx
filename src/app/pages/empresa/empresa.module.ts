import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { EmpresaComponent } from './empresa.component';
import { routing } from './empresa.routing';


//import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { ConceptosComponent } from 'app/pages/conceptos/conceptos.component';
import { CertificadosComponent } from 'app/pages/certificados/certificados.component';
import { FoliosComponent } from 'app/pages/folios/folios.component';
import { RegimenComponent } from "app/pages/regimenes/regimen.component";
import { UsuariosComponent } from "app/pages/usuarios/usuarios.component";
import { ProveedoresComponent } from '../proveedores/proveedores.component';
import { SucursalesComponent } from '../sucursales/sucursales.component';
import { PerfilComponent } from 'app/pages/perfil/perfil.component';





//import { SorterTableComponent } from 'app/comun/components/sorterTable';


@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
        //NgxPaginationModule,
    ],
    declarations: [
        EmpresaComponent,
        ConceptosComponent,
        CertificadosComponent,
        FoliosComponent,
        RegimenComponent,
        UsuariosComponent,
        ProveedoresComponent,
        SucursalesComponent,
        PerfilComponent,
        //SorterTableComponent
    ],
})
export class EmpresaModule {

}
