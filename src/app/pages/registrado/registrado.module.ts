import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppTranslationModule } from '../../app.translation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { RegistradoComponent } from './registrado.component';
import { routing } from './registrado.routing';


@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing
    ],
    declarations: [
        RegistradoComponent
    ],
})

export class RegistradoModule {

}