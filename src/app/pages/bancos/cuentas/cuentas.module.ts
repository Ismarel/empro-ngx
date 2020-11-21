import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';
import { routing } from './cuentas.routing';
import { GestioncuentasComponent } from './gestioncuentas/gestioncuentas.component';
import { CuentasComponent } from './cuentas.component';
import { GestiontarjetasComponent } from './gestiontarjetas/gestiontarjetas.component';
import { GestionchequerasComponent } from './gestionchequeras/gestionchequeras.component';
import { EstadoscuentaComponent } from './estadoscuenta/estadoscuenta.component';
import { ChequerasComponent } from '../../chequeras/chequeras.component';
import { ChequesComponent } from '../../cheques/cheques.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
        NgbModule
    ],
    declarations: [
        CuentasComponent,
        GestioncuentasComponent,
        GestiontarjetasComponent,
        GestionchequerasComponent,
        EstadoscuentaComponent,
        ChequerasComponent,
        ChequesComponent,
    ],
})

export class CuentasModule {
}