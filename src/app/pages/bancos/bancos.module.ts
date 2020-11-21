import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './bancos.routing';

import { BancosComponent } from './bancos.component';
import { CajasComponent } from 'app/pages/bancos/cajas/cajas.component';

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
        BancosComponent,
        CajasComponent,
    ],
})

export class BancosModule {
}