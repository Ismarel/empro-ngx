import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppTranslationModule } from '../app.translation.module';

import {
    BaThemeConfig
} from './theme.config';

import {
    BaThemeConfigProvider
} from './theme.configProvider';

import {
    BaBackTop,
    BaCard,
    BaChartistChart,
    BaCheckbox,
    BaContentTop,
    BaFullCalendar,
    BaMenuItem,
    BaMenu,
    BaMsgCenter,
    BaMultiCheckbox,
    BaPageTop,
    BaSidebar
} from './components';

import { BaCardBlur } from './components/baCard/baCardBlur.directive';

import {
    BaScrollPosition,
    BaSlimScroll,
    BaThemeRun
} from './directives';

import {
    BaAppPicturePipe,
    BaKameleonPicturePipe,
    BaProfilePicturePipe
} from './pipes';

import {
    BaImageLoaderService,
    BaMenuService,
    BaThemePreloader,
    BaThemeSpinner
} from './services';

import {
    EmailValidator,
    EqualPasswordsValidator
} from './validators';


import { SorterTableComponent } from '../comun/components/sorterTable/sorterTable.component';
import { AutocompleteGenericComponent } from '../comun/components/autocomplete-generic/autocomplete-generic.component';
import { Ng2CompleterModule } from "ng2-completer";
import { NgxPaginationModule } from 'ngx-pagination';
import { ClientesComponent } from '../pages/clientes/clientes.component';
import { SanitizedLinkComponent } from "app/comun/sanitized-link";
import { RegistraCFDIComponent } from 'app/theme/components/registra-cfdi/registra-cfdi.component';
import { RegistraCSDComponent } from 'app/theme/components/registra-csd/registra-csd.component';
import { RegistraDFEComponent } from 'app/theme/components/registra-dfe/registra-dfe.component';
import { RegistraRFComponent } from 'app/theme/components/registra-rf/registra-rf.component';



// Componentes propios / No declarados al inicio de la plantilla
const NGA_CUSTOM_COMPONENTS = [
    SorterTableComponent,
    AutocompleteGenericComponent,
    ClientesComponent,
    SanitizedLinkComponent,
    RegistraCFDIComponent,
    RegistraCSDComponent,
    RegistraDFEComponent,
    RegistraRFComponent,

];

const CUSTOM_IMPORT_MODULES = [
    Ng2CompleterModule,
    NgxPaginationModule,
];

const NGA_COMPONENTS = [
    BaBackTop,
    BaCard,
    BaChartistChart,
    BaCheckbox,
    BaContentTop,
    BaFullCalendar,
    BaMenuItem,
    BaMenu,
    BaMsgCenter,
    BaMultiCheckbox,
    BaPageTop,
    BaSidebar
];

const NGA_DIRECTIVES = [
    BaScrollPosition,
    BaSlimScroll,
    BaThemeRun,
    BaCardBlur
];

const NGA_PIPES = [
    BaAppPicturePipe,
    BaKameleonPicturePipe,
    BaProfilePicturePipe
];

const NGA_SERVICES = [
    BaImageLoaderService,
    BaThemePreloader,
    BaThemeSpinner,
    BaMenuService
];

const NGA_VALIDATORS = [
    EmailValidator,
    EqualPasswordsValidator
];

@NgModule({
    declarations: [
        ...NGA_CUSTOM_COMPONENTS,
        ...NGA_PIPES,
        ...NGA_DIRECTIVES,
        ...NGA_COMPONENTS,

    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AppTranslationModule,
        ...CUSTOM_IMPORT_MODULES
    ],
    exports: [
        ...CUSTOM_IMPORT_MODULES,
        ...NGA_CUSTOM_COMPONENTS,
        ...NGA_PIPES,
        ...NGA_DIRECTIVES,
        ...NGA_COMPONENTS
    ]
})
export class NgaModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: NgaModule,
            providers: [
                BaThemeConfigProvider,
                BaThemeConfig,
                ...NGA_VALIDATORS,
                ...NGA_SERVICES
            ],
        };
    }
}
