import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { routing } from './comprobantesfiscales.routing';
import { ComprobantesfiscalesComponent } from './comprobantesfiscales.component';
import { ComprobantefiscalComponent } from '../comprobantefiscal/comprobantefiscal.component';

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
        ComprobantesfiscalesComponent,
        ComprobantefiscalComponent,

    ],
})

export class ComprobantesfiscalesModule {

}