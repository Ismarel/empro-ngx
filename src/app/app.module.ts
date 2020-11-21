import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

//import { FileUploadModule } from 'ng2-file-upload';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';

/**
 * Custom imports external from the current theme
 */
import { ServiciosBackendModule } from './servicios-backend/servicios-backend.module';
import { UsuarioService } from './servicios-backend/usuario.service';
import { RoleGuard } from './auth/role-guard';
import { EmpresaService } from './servicios-backend/empresa.service';
import { CertificadoService } from './servicios-backend/certificado.service';
import { FoliosService } from './servicios-backend/folios.service';
import { RegimenFiscalService } from './servicios-backend/regimen-fiscal.service';
import { ConceptoService } from './servicios-backend/concepto.service';
import { SucursalService } from './servicios-backend/sucursal.servicio';
import { ClienteProveedorService } from './servicios-backend/cliente-proveedor.service';
import { CpService } from './servicios-backend/cp.service';
import { CuentaService } from './servicios-backend/cuenta.service';
import { TarjetaService } from './servicios-backend/tarjeta.service';
import { ChequeraService } from './servicios-backend/chequera.service';
import { ChequesService } from './servicios-backend/cheques.service';
import { ComprobanteFiscalService } from './servicios-backend/comprobante-fiscal.service';
import { TrabajadorService } from './servicios-backend/trabajador.service';
import { IngresoEgresoService } from './servicios-backend/ingreso-egreso.service';
import { RegistradoService } from './servicios-backend/registrado.service';
import { NominaService } from './servicios-backend/nomina.service';
import { PercepcionService } from './servicios-backend/percepcion.service';
import { DeduccionService } from './servicios-backend/deduccion.service';
import { ConfiguracionNominaService } from './servicios-backend/configuracion-nomina.service';
import { Ng2CompleterModule } from "ng2-completer"; // https://github.com/oferh/ng2-completer -- Autocomplete
import { PagesComponent } from 'app/pages';
import { ActualizacionService } from 'app/comun/actualizacion.service';
import { CajaService } from './servicios-backend/caja.service';
import { TransferenciaService } from 'app/servicios-backend/transferencia.service';
import { DropzoneService } from 'app/servicios-backend/dropzone.service';
import { ComprobanteidService } from './pages/comprobantesfiscales/comprobanteid.service';
import { MailService } from './servicios-backend/mail.service';


const CUSTOM_PROVIDERS = [
    UsuarioService,
    RoleGuard,
    EmpresaService,
    CertificadoService,
    FoliosService,
    RegimenFiscalService,
    ConceptoService,
    ClienteProveedorService,
    CpService,
    SucursalService,
    CuentaService,
    TarjetaService,
    ChequeraService,
    ChequesService,
    ComprobanteFiscalService,
    TrabajadorService,
    IngresoEgresoService,
    NominaService,
    PercepcionService,
    DeduccionService,
    ConfiguracionNominaService,
    RegistradoService,
    ActualizacionService,
    CajaService,
    TransferenciaService,
    DropzoneService,
    ComprobanteidService,
    MailService
];

const CUSTOM_IMPORT_MODULES = [
    ServiciosBackendModule,
    Ng2CompleterModule,
];

// Application wide providers
const APP_PROVIDERS = [
    AppState,
    GlobalState,
    CUSTOM_PROVIDERS,
];

export type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void,
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */

@NgModule({
    bootstrap: [App],
    declarations: [
        App,
    ],
    imports: [ // import Angular's modules
        ...CUSTOM_IMPORT_MODULES,
        BrowserModule,
        HttpModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule.forRoot(),
        NgbModule.forRoot(),
        PagesModule,
        routing,
        //FileUploadModule

    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        APP_PROVIDERS,
    ],
})

export class AppModule {
    constructor(public appState: AppState) {
    }
}
