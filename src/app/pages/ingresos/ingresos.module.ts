import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './ingresos.routing';
import { IngresosComponent } from './ingresos.component';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

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
        IngresosComponent

    ],
})
export class IngresosModule {

}
