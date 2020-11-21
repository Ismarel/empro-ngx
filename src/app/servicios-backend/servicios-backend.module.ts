import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './servicios-backend.routing';
import { AppTranslationModule } from '../app.translation.module';
import { ServiciosBackendComponent } from './servicios-backend.component';

@NgModule({
    imports: [CommonModule, AppTranslationModule, routing],
    declarations: [ServiciosBackendComponent]
})
export class ServiciosBackendModule {
}
