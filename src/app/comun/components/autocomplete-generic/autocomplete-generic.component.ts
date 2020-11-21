import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'style-loader!./autocomplete-generic.scss';
/**
 * Dependencia NG2 Completer
 */
import { CompleterService, CompleterData, CompleterItem, RemoteData } from 'ng2-completer';

import { EmpresaService } from '../../../servicios-backend/empresa.service';
import { HttpHelper } from "app/http-helper";
import { OptionSelect } from "app/comun/OptionSelect";
import { NgaModule } from "app/theme/nga.module";
import { CpService } from "app/servicios-backend/cp.service";
import { RegimenFiscalService } from "app/servicios-backend/regimen-fiscal.service";
import { ConceptoService } from '../../../servicios-backend/concepto.service';
import { CuentaService } from '../../../servicios-backend/cuenta.service';
import { Banco } from 'app/entidades/banco';
import { TipoContrato } from '../../../entidades/tipo-contrato';
import { SucursalService } from "app/servicios-backend/sucursal.servicio";
import { IngresoEgresoService } from 'app/servicios-backend/ingreso-egreso.service';
import { CajaService } from '../../../servicios-backend/caja.service';
import { ClienteProveedorService } from '../../../servicios-backend/cliente-proveedor.service';
import { TrabajadorService } from '../../../servicios-backend/trabajador.service';
import { ConfiguracionNominaService } from '../../../servicios-backend/configuracion-nomina.service';


const RIESGO_URL_AUTOCOMPLETE_SERVICE: string = 'empresa/autocompleteRiesgo'; // URL autocomplete
const RIESGO_URL_SERVICE_ALIAS: string = 'empresaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const RIESGO_DETALLE_METHOD_NAME: string = 'getDetalleRiesgo'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const RIESGO: string = 'riesgo';


const CODIGOPOSTAL_URL_AUTOCOMPLETE_SERVICE: string = 'cp/autocompleteSimple'; // URL autocomplete
const CODIGOPOSTAL_URL_SERVICE_ALIAS: string = 'cpService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const CODIGOPOSTAL_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const CODIGOPOSTAL: string = 'codigopostal';

const REGIMENFISCAL_URL_AUTOCOMPLETE_SERVICE: string = 'regimenFiscal/autocompleteTipoRegimen'; // URL autocomplete
const REGIMENFISCAL_URL_SERVICE_ALIAS: string = 'regimenFiscal'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)333333
const REGIMENFISCAL_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const REGIMENFISCAL: string = 'regimenes';

const PRODUCTO_URL_AUTOCOMPLETE_SERVICE: string = 'conceptos/autocompleteProducto'; // URL autocomplete
const PRODUCTO_URL_SERVICE_ALIAS: string = 'conceptoService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const PRODUCTO_DETALLE_METHOD_NAME: string = 'getDetalleProducto'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const PRODUCTO: string = 'producto';

const UNIDAD_URL_AUTOCOMPLETE_SERVICE: string = 'conceptos/autocompleteUnidad'; // URL autocomplete
const UNIDAD_URL_SERVICE_ALIAS: string = 'conceptoService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const UNIDAD_DETALLE_METHOD_NAME: string = 'getDetalleUnidad'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const UNIDAD: string = 'unidad';

const BANCO_URL_AUTOCOMPLETE_SERVICE: string = 'cuenta/autocompleteBancos'; // URL autocomplete
const BANCO_URL_SERVICE_ALIAS: string = 'cuentaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const BANCO_DETALLE_METHOD_NAME: string = 'getDetalleBanco'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const BANCO: string = 'bancos';

const TIPOCONTRATO_URL_AUTOCOMPLETE_SERVICE: string = 'trabajador/autocompleteTipoContrato'; // URL autocomplete
const TIPOCONTRATO_URL_SERVICE_ALIAS: string = 'tipoContratos'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TIPOCONTRATO_DETALLE_METHOD_NAME: string = 'detalleTipoContrato'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TIPOCONTRATO: string = 'tipoContratos';

const JORNADA_URL_AUTOCOMPLETE_SERVICE: string = 'trabajador/autocompleteTipoJornada'; // URL autocomplete
const JORNADA_URL_SERVICE_ALIAS: string = 'jornadas'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const JORNADA_DETALLE_METHOD_NAME: string = 'detalleJornada'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const JORNADA: string = 'jornadas';

const PERIODICIDAD_URL_AUTOCOMPLETE_SERVICE: string = 'configuracionNomina/autocompletePeriodicidad'; // URL autocomplete
const PERIODICIDAD_URL_SERVICE_ALIAS: string = 'configuracionNominaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const PERIODICIDAD_DETALLE_METHOD_NAME: string = 'detallePeriodicidad'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const PERIODICIDAD: string = 'periodicidad';

const SUCURSAL_URL_AUTOCOMPLETE_SERVICE: string = 'sucursal/autocomplete'; // URL autocomplete
const SUCURSAL_URL_SERVICE_ALIAS: string = 'sucursalService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const SUCURSAL_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const SUCURSAL: string = 'sucursal';

const CUENTA_URL_AUTOCOMPLETE_SERVICE: string = 'cuenta/autocomplete'; // URL autocomplete
const CUENTA_URL_SERVICE_ALIAS: string = 'cuentaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const CUENTA_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const CUENTA: string = 'cuenta';

const TCOMPINGRESO_URL_AUTOCOMPLETE_SERVICE: string = 'ingresoEgreso/autocompleteTComprobanteIngreso'; // URL autocomplete
const TCOMPINGRESO_URL_SERVICE_ALIAS: string = 'ingresoEgresoService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TCOMPINGRESO_DETALLE_METHOD_NAME: string = 'getDetalleComprobante'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TCOMPINGRESO: string = 'tipoComprobante';

const CAJA_URL_AUTOCOMPLETE_SERVICE: string = 'caja/autocomplete'; // URL autocomplete
const CAJA_URL_SERVICE_ALIAS: string = 'cajaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const CAJA_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const CAJA: string = 'caja';

const CONCEPTO_URL_AUTOCOMPLETE_SERVICE: string = 'conceptos/autocomplete'; // URL autocomplete
const CONCEPTO_URL_SERVICE_ALIAS: string = 'conceptoService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const CONCEPTO_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const CONCEPTO: string = 'concepto';

const CLIENTE_PROVEEDOR_URL_AUTOCOMPLETE_SERVICE: string = 'clienteProveedor/autocomplete'; // URL autocomplete
const CLIENTE_PROVEEDOR_URL_SERVICE_ALIAS: string = 'clienteProveedorService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const CLIENTE_PROVEEDOR_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const CLIENTE_PROVEEDOR: string = 'nombreClientes';

const TRABAJADOR_URL_AUTOCOMPLETE_SERVICE: string = 'trabajador/autocomplete'; // URL autocomplete
const TRABAJADOR_URL_SERVICE_ALIAS: string = 'trabajadorService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TRABAJADOR_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TRABAJADOR: string = 'trabajador';

const REGIMENEMPRESA_URL_AUTOCOMPLETE_SERVICE: string = 'regimenFiscal/autocompleteTipoRegimenByEmpresa'; // URL autocomplete
const REGIMENEMPRESA_URL_SERVICE_ALIAS: string = 'regimenFiscal'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)333333
const REGIMENEMPRESA_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const REGIMENEMPRESA: string = 'regimenEmpresa';


const TINCIDENCIA_URL_AUTOCOMPLETE_SERVICE: string = 'nomina/autocompleteTipoIncidencia'; // URL autocomplete
const TINCIDENCIA_URL_SERVICE_ALIAS: string = 'nominaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TINCIDENCIA_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TINCIDENCIA: string = 'tipoIncidencia';

const TINCAPACIDAD_URL_AUTOCOMPLETE_SERVICE: string = 'nomina/autocompleteTipoIncapacidad'; // URL autocomplete
const TINCAPACIDAD_URL_SERVICE_ALIAS: string = 'nominaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TINCAPACIDAD_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TINCAPACIDAD: string = 'tipoIncapacidad';

const TPERCEPCION_URL_AUTOCOMPLETE_SERVICE: string = 'nomina/autocompleteTipoPercepcion'; // URL autocomplete
const TPERCEPCION_URL_SERVICE_ALIAS: string = 'nominaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TPERCEPCION_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TPERCEPCION: string = 'tipoPercepcion';

const PERCEPCION_URL_AUTOCOMPLETE_SERVICE: string = 'nomina/autocompleteNominaPercepcion'; // URL autocomplete
const PERCEPCION_URL_SERVICE_ALIAS: string = 'nominaService?'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const PERCEPCION_DETALLE_METHOD_NAME: string = 'getDetalle_o.o'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const PERCEPCION: string = 'percepcion';

const TDEDUCCION_URL_AUTOCOMPLETE_SERVICE: string = 'nomina/autocompleteTipoDeduccion'; // URL autocomplete
const TDEDUCCION_URL_SERVICE_ALIAS: string = 'nominaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const TDEDUCCION_DETALLE_METHOD_NAME: string = 'getDetalle'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const TDEDUCCION: string = 'tipoDeduccion';

const DEDUCCION_URL_AUTOCOMPLETE_SERVICE: string = 'nomina/autocompleteNominaDeduccion'; // URL autocomplete
const DEDUCCION_URL_SERVICE_ALIAS: string = 'nominaService?'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const DEDUCCION_DETALLE_METHOD_NAME: string = 'getDetalle_o.o'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const DEDUCCION: string = 'deduccion';

const PERIODICIDAD_NOMINA_URL_AUTOCOMPLETE_SERVICE: string = 'configuracionNomina/autocompletePeriodicidadTrabajador'; // URL autocomplete
const PERIODICIDAD_NOMINA_URL_SERVICE_ALIAS: string = 'configuracionNominaService'; // Variable Inyectada del servicio (ver constructor como se ha nombrado)
const PERIODICIDAD_NOMINA_DETALLE_METHOD_NAME: string = 'detallePeriodicidadNomina'; // Metodo del service para obtener el detalle de solo un elemento (Necesario para inicializar el autocomplete con un valor)
const PERIODICIDAD_NOMINA: string = 'periodicidades';

declare var URLEncoder;
@Component({
    selector: 'autocomplete-generic',
    templateUrl: './autocomplete-generic.html'
})
export class AutocompleteGenericComponent implements OnInit {

    @Input('query-params') queryParams: Map<string, string>;
    @Input() getLabel;
    @Input('entidad') entidad: string = '';
    @Input('required') required: boolean = false;
    @Input('textplaceholder') textPlaceHolder: string = 'Buscar';
    @Input('searchStr') searchStrIn: string = '';

    @Output('onIdSelected') idEmmiter = new EventEmitter<number>();
    @Output('onLabelSelected') nameEmmiter = new EventEmitter<string>();
    @Output('onText') textEmmiter = new EventEmitter<string>();
    @Output() close = new EventEmitter();

    @Input('enabled')
    set enabled(x: boolean) {
        /*
         if (this._enabled && !x) {
         this.idSelected = null;
         this.labelSelected = "";
         this.searchStr = "";
         this.idEmmiter.emit(null);
         }
         */
        this._enabled = x;
    }

    get enabled() {
        return this._enabled;
    }


    service: string;
    methodNameDetalle: string;
    _enabled: boolean = true;
    mapDetalleService: Map<string, string> = new Map<string, string>();
    url = HttpHelper.url;
    headers = HttpHelper.headersJSON;
    labelSelected: string = '';
    searchStr: string = '';
    dataRemote: RemoteData;
    idSelected: number = null;
    urlParams: string = '';
    dataParameters: RemoteData;

    error: any;
    navigated = false; // true if navigated here

    values: Array<number> = [];
    anyErrors: boolean;
    finished: boolean;

    constructor(private http: Http,
        private completerService: CompleterService,
        private empresaService: EmpresaService,
        private cpService: CpService,
        private regimenFiscal: RegimenFiscalService,
        private conceptoService: ConceptoService,
        private cuentaService: CuentaService,
        private sucursalService: SucursalService,
        private ingresoEgresoService: IngresoEgresoService,
        private cajaService: CajaService,
        private clienteProveedorService: ClienteProveedorService,
        private TrabajadorService: TrabajadorService,
        private configuracionNomina: ConfiguracionNominaService


    ) { // TODO: Agregar servicios
    }

    ngOnInit() {
        this.searchStr = this.searchStrIn;
        this.restartConfig();
        if (this.entidad) {
            switch (this.entidad) {
                case RIESGO: {
                    this.mapDetalleService.set(this.entidad, RIESGO_URL_SERVICE_ALIAS);
                    this.service = RIESGO_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = RIESGO_DETALLE_METHOD_NAME;
                    break;
                }
                case CODIGOPOSTAL: {
                    this.mapDetalleService.set(this.entidad, CODIGOPOSTAL_URL_SERVICE_ALIAS);
                    this.service = CODIGOPOSTAL_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = CODIGOPOSTAL_DETALLE_METHOD_NAME;
                    break;
                }
                case REGIMENFISCAL: {
                    this.mapDetalleService.set(this.entidad, REGIMENFISCAL_URL_SERVICE_ALIAS);
                    this.service = REGIMENFISCAL_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = REGIMENFISCAL_DETALLE_METHOD_NAME;
                    break;
                }
                case PRODUCTO: {
                    this.mapDetalleService.set(this.entidad, PRODUCTO_URL_SERVICE_ALIAS);
                    this.service = PRODUCTO_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = PRODUCTO_DETALLE_METHOD_NAME;
                    break;
                }

                case UNIDAD: {
                    this.mapDetalleService.set(this.entidad, UNIDAD_URL_SERVICE_ALIAS);
                    this.service = UNIDAD_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = UNIDAD_DETALLE_METHOD_NAME;
                    break;
                }

                case BANCO: {
                    this.mapDetalleService.set(this.entidad, BANCO_URL_SERVICE_ALIAS);
                    this.service = BANCO_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = BANCO_DETALLE_METHOD_NAME;
                    break;
                }

                case TIPOCONTRATO: {
                    this.mapDetalleService.set(this.entidad, TIPOCONTRATO_URL_SERVICE_ALIAS);
                    this.service = TIPOCONTRATO_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TIPOCONTRATO_DETALLE_METHOD_NAME;
                    break;
                }

                case JORNADA: {
                    this.mapDetalleService.set(this.entidad, JORNADA_URL_SERVICE_ALIAS);
                    this.service = JORNADA_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = JORNADA_DETALLE_METHOD_NAME;
                    break;
                }

                case PERIODICIDAD: {
                    this.mapDetalleService.set(this.entidad, PERIODICIDAD_URL_SERVICE_ALIAS);
                    this.service = PERIODICIDAD_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = PERIODICIDAD_DETALLE_METHOD_NAME;
                    break;
                }

                case SUCURSAL: {
                    this.mapDetalleService.set(this.entidad, SUCURSAL_URL_SERVICE_ALIAS);
                    this.service = SUCURSAL_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = SUCURSAL_DETALLE_METHOD_NAME;
                    break;
                }

                case CUENTA: {
                    this.mapDetalleService.set(this.entidad, CUENTA_URL_SERVICE_ALIAS);
                    this.service = CUENTA_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = CUENTA_DETALLE_METHOD_NAME;
                    break;
                }

                case TCOMPINGRESO: {
                    this.mapDetalleService.set(this.entidad, TCOMPINGRESO_URL_SERVICE_ALIAS);
                    this.service = TCOMPINGRESO_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TCOMPINGRESO_DETALLE_METHOD_NAME;
                    break;
                }

                case CAJA: {
                    this.mapDetalleService.set(this.entidad, CAJA_URL_SERVICE_ALIAS);
                    this.service = CAJA_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = CAJA_DETALLE_METHOD_NAME;
                    break;
                }

                case CONCEPTO: {
                    this.mapDetalleService.set(this.entidad, CONCEPTO_URL_SERVICE_ALIAS);
                    this.service = CONCEPTO_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = CONCEPTO_DETALLE_METHOD_NAME;
                    break;
                }
                case CLIENTE_PROVEEDOR: {
                    this.mapDetalleService.set(this.entidad, CLIENTE_PROVEEDOR_URL_SERVICE_ALIAS);
                    this.service = CLIENTE_PROVEEDOR_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = CLIENTE_PROVEEDOR_DETALLE_METHOD_NAME;
                    break;
                }
                case TRABAJADOR: {
                    this.mapDetalleService.set(this.entidad, TRABAJADOR_URL_SERVICE_ALIAS);
                    this.service = TRABAJADOR_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TRABAJADOR_DETALLE_METHOD_NAME;
                    break;
                }
                case REGIMENEMPRESA: {
                    this.mapDetalleService.set(this.entidad, REGIMENEMPRESA_URL_SERVICE_ALIAS);
                    this.service = REGIMENEMPRESA_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = REGIMENEMPRESA_DETALLE_METHOD_NAME;
                    break;
                }

                case TINCIDENCIA: {
                    this.mapDetalleService.set(this.entidad, TINCIDENCIA_URL_SERVICE_ALIAS);
                    this.service = TINCIDENCIA_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TINCIDENCIA_DETALLE_METHOD_NAME;
                    break;
                }

                case TINCAPACIDAD: {
                    this.mapDetalleService.set(this.entidad, TINCAPACIDAD_URL_SERVICE_ALIAS);
                    this.service = TINCAPACIDAD_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TINCAPACIDAD_DETALLE_METHOD_NAME;
                    break;
                }

                case TPERCEPCION: {
                    this.mapDetalleService.set(this.entidad, TPERCEPCION_URL_SERVICE_ALIAS);
                    this.service = TPERCEPCION_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TPERCEPCION_DETALLE_METHOD_NAME;
                    break;
                }

                case PERCEPCION: {
                    this.mapDetalleService.set(this.entidad, PERCEPCION_URL_SERVICE_ALIAS);
                    this.service = PERCEPCION_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = PERCEPCION_DETALLE_METHOD_NAME;
                    break;
                }

                case TDEDUCCION: {
                    this.mapDetalleService.set(this.entidad, TDEDUCCION_URL_SERVICE_ALIAS);
                    this.service = TDEDUCCION_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = TDEDUCCION_DETALLE_METHOD_NAME;
                    break;
                }

                case DEDUCCION: {
                    this.mapDetalleService.set(this.entidad, DEDUCCION_URL_SERVICE_ALIAS);
                    this.service = DEDUCCION_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = DEDUCCION_DETALLE_METHOD_NAME;
                    break;
                }

                case PERIODICIDAD_NOMINA: {
                    this.mapDetalleService.set(this.entidad, PERIODICIDAD_NOMINA_URL_SERVICE_ALIAS);
                    this.service = PERIODICIDAD_NOMINA_URL_AUTOCOMPLETE_SERVICE;
                    this.methodNameDetalle = PERIODICIDAD_NOMINA_DETALLE_METHOD_NAME;
                    break;
                }

                default: {
                    this.methodNameDetalle = 'getDetalle';
                    break;
                }
            }
        } else {
            console.warn('La entidad es requerida');
        }
    }

    restartConfig() {
        setTimeout(() => {
            this.autocomplete(this.completerService);
        }, 50);
    }

    prepareAdd() {
        //console.log(this.entidad);

        this.searchStr = '';
        this.idSelected = null;
    }

    prepareEdit(id: number) {
        this.getDetalle(id);
    }

    cleanCampo() {
        this.searchStr = '';
    }

    cleanData() {
        this.idSelected = null;
        this.labelSelected = '';
        this.searchStr = '';
        this.idEmmiter.emit(null);
    }

    public getDetalle(id: number) {

        // console.log(id, this.entidad);
        if (id == null) {
            console.warn('Comprueba tu logica estas enviando nulo');
        } else if (id < 0) {
            console.warn('Comprueba tu logica no estas buscando algo');
        }
        else {
            if (this.entidad === '') {
                console.warn('La entidad  es requerida');
            } else {

                let servicioDetalle = this.mapDetalleService.get(this.entidad);
                //  console.log("ServicioDetalle ",this[servicioDetalle]);
                //  console.log("ServicioDetalle ",servicioDetalle);

                // console.log("MethodNameDetalle ",this.methodNameDetalle);
                // console.log("ID ",id); 


                let $detalle: Observable<any> = this[servicioDetalle][this.methodNameDetalle](id) as Observable<any>;

                $detalle.subscribe(
                    (response) => {
                        // console.log(this.entidad, ':', 'id-', id, '->', response);
                        let item: OptionSelect = new OptionSelect();
                        this.idSelected = id;
                        item.value = response.id + '';

                        switch (this.entidad) {

                            case RIESGO:
                                item.label = response.nombre; // Lo que se va a mostrar en como texto al usuario 
                                break;
                            case CODIGOPOSTAL:
                                item.label = response.codigo; // Lo que se va a mostrar en como texto al usuario 
                                break;
                            case REGIMENFISCAL:
                                item.label = response.tipoRegimen.nombre; // Lo que se va a mostrar en como texto al usuario 
                                break;
                            case PRODUCTO:
                                item.label = response.descripcion;
                                break;
                            case UNIDAD:
                                item.label = response.nombre;
                                break;
                            case BANCO:
                                item.label = response.nombre;
                                break;
                            case TIPOCONTRATO:
                                item.label = response.tipoContrato.descripcion;
                                break;
                            case JORNADA:
                                item.label = response.jornada.descripcion;
                                break;
                            case PERIODICIDAD:
                                item.label = response.periodicidad.descripcion;
                            case SUCURSAL:
                                item.label = response.nombre;
                                break;
                            case CUENTA:
                                item.label = response.numeroCuenta;
                                break;
                            case TCOMPINGRESO:
                                item.label = response.nombre;
                                break;
                            case CAJA:
                                // console.log(response.nombre);
                                item.label = response.nombre;
                                break;
                            case CONCEPTO:
                                item.label = response.nombre;
                                console.log("AUTOCOMPLETADO: ", response.nombre);
                                break;
                            case CLIENTE_PROVEEDOR:
                                item.label = response.nombre;
                                break;
                            case TRABAJADOR:
                                item.label = response.nombre;
                                break;
                            case REGIMENEMPRESA:
                                item.label = response.tipoRegimen.nombre;
                                break;
                            case TINCIDENCIA:
                                item.label = response.nombre;
                                break;
                            case TINCAPACIDAD:
                                item.label = response.nombre;
                                break;
                            case TPERCEPCION:
                            case PERCEPCION:
                                item.label = response.nombre;
                                break;
                            case TDEDUCCION:
                            case DEDUCCION:
                                item.label = response.nombre;
                                break;
                            case PERIODICIDAD_NOMINA:
                                item.label = response.nombre;
                                break;
                            default:
                                item.label = response.nombre;
                        }
                        this.searchStr = item.label;
                        //console.log( item.label);


                    }, (error) => {
                        console.warn(error);
                    }
                );

            }

        }

    }

    autocomplete(completerService: CompleterService) {
        let token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);
        } else {
            console.warn('No esta presente el token');
        }
        // remote(url: string, searchFields = "", titleField = ""):
        this.dataRemote = completerService.remote(null, 'label', 'label');
        //console.log(this.service);

        if (this.service) {
            this.convertParamUrl().then(parametros => {
                this.dataRemote.urlFormater(term => {
                    let url: string = `${this.url}${this.service}/?`;
                    if (term != null && term.length > 0) {
                        url += `filterQuery=${term}&${parametros}`;
                    } else {
                        url += `${parametros}`;
                    }
                    return url;
                });
                this.dataRemote.headers(this.headers);
            });
        }

    }

    onSelected(selected: CompleterItem) {
        if (selected) {
            this.idSelected = selected.originalObject.value;
            this.searchStr = selected.originalObject.label;
            this.idEmmiter.emit(this.idSelected);
            this.nameEmmiter.emit(this.searchStr);
            this.labelSelected = this.searchStr;

        }
        // console.log('Seleccionado:', selected);
    }

    onKey(event: any) {
        if (this.searchStr.length === 0 || this.labelSelected !== this.searchStr) {
            this.idSelected = null;
            this.idEmmiter.emit(this.idSelected);
        }
        this.textEmmiter.emit(this.searchStr);
    }

    getLugarExpedicion(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    getTipoContrato(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    getTipoRegimen(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    getBanco(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getTipoJornada(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    getPeriodicidad(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    getTComprobanteIngreso(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getCaja(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    getConcepto(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getTrabajador(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getClienteProveedor(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getIncapacidad(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getPercepcion(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getDeduccion(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }

    getIncidente(variable: number) {
        let item: OptionSelect = new OptionSelect();
        item.value = variable + '';
        item.label = variable + "";
        this.searchStr = item.label;
    }
    onPrueba(event) {
        this.autocomplete(this.completerService);
    }

    convertParamUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let stringPrams: string = '';
            if (this.queryParams && this.queryParams.size > 0) {
                this.queryParams.forEach((value: any, key: any) => {
                    // console.log('item : ', key, value);
                    stringPrams += `${key}=${value}&`;
                });
                this.urlParams = stringPrams;
                // console.log('stringPrams ', stringPrams);
                resolve(stringPrams);
            }
            resolve('');
        });

    }

}
