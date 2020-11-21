import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { PagesComponent } from './pages.component';
//import { ComprobantefiscalComponent } from './comprobantefiscal/comprobantefiscal.component';
//import { ComprobantesfiscalesComponent } from './comprobantesfiscales/comprobantesfiscales.component';

@NgModule({
    imports: [CommonModule, AppTranslationModule, NgaModule, routing],
    declarations: [PagesComponent],//ComprobantefiscalComponent],
})
export class PagesModule {
}
