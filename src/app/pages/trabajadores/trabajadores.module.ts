import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TrabajadoresComponent } from './trabajadores.component';
import { AppTranslationModule } from '../../app.translation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './trabajadores.routing';
import { TrabajadorNuevoComponent } from '../trabajador-nuevo/trabajador-nuevo.component';
import { TrabajadorTablaComponent } from '../trabajador-tabla/trabajador-tabla.component';
import { CfdiComponent } from '../cfdi/cfdi.component';
import { TrabajadorDetalleComponent } from '../trabajador-detalle/trabajador-detalle.component';
import { NominaComponent } from '../nomina/nomina.component';
import { NominaConsultaComponent } from '../nomina-consulta/nomina-consulta.component';
import { NominaNuevaComponent } from '../nomina-nueva/nomina-nueva.component';
import { PercepcionesComponent } from '../percepciones/percepciones.component';
import { PercepcionTablaComponent } from 'app/pages/percepcion-tabla/percepcion-tabla.component';
import { PercepcionNuevoComponent } from 'app/pages/percepcion-nuevo/percepcion-nuevo.component';
import { DeduccionesComponent } from '../deducciones/deducciones.component';
import { DeduccionTablaComponent } from 'app/pages/deduccion-tabla/deduccion-tabla.component';
import { DeduccionNuevoComponent } from 'app/pages/deduccion-nuevo/deduccion-nuevo.component';

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
    ],
    declarations: [
        TrabajadoresComponent,
        TrabajadorNuevoComponent,
        TrabajadorTablaComponent,
        CfdiComponent,
        TrabajadorDetalleComponent,
        NominaComponent,
        NominaConsultaComponent,
        NominaNuevaComponent,
        PercepcionesComponent,
        PercepcionTablaComponent,
        PercepcionNuevoComponent,
        DeduccionesComponent,
        DeduccionTablaComponent,
        DeduccionNuevoComponent,
    ],
})

export class TrabajadoresModule {

}