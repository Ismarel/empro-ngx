import { Component, OnInit, ViewChild } from '@angular/core';
import { AutocompleteGenericComponent } from '../../comun/components/autocomplete-generic';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PeriodicidadPago } from '../../entidades/periodicidad-pago';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { NominaService } from '../../servicios-backend/nomina.service';
import { Nomina } from '../../entidades/nomina';
import { Trabajador } from '../../entidades/trabajador';
import { TrabajadorIncidencia } from '../../entidades/trabajador-incidencia';
import { TrabajadorService } from '../../servicios-backend/trabajador.service';
import { TipoIncidencia } from '../../entidades/tipo-incidencia';
import { TipoIncapacidad } from '../../entidades/tipo-incapacidad';
import { TipoPercepcion } from '../../entidades/tipo-percepcion';
import { TipoDeduccion } from '../../entidades/tipo-deduccion';
import { ConfiguracionNominaService } from '../../servicios-backend/configuracion-nomina.service';
import { ConfiguracionNomina } from 'app/entidades/configuracion-nomina';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { Http } from '@angular/http';
import { MailService } from '../../servicios-backend/mail.service';
import { Empresa } from '../../entidades/empresa';
import { ActualizacionService } from '../../comun/actualizacion.service';
import { Usuario } from '../../entidades/usuario';
import { forEach } from '../../../../node_modules/@angular/router/src/utils/collection';
import { NominaPercepcion } from 'app/entidades/nomina-percepcion';
import { NominaDeduccion } from '../../entidades/nomina-deduccion';
import { PercepcionService } from 'app/servicios-backend/percepcion.service';
import { DeduccionService } from 'app/servicios-backend/deduccion.service';
import { CfdiComponent } from '../cfdi/cfdi.component';

@Component({
    selector: 'app-nomina',
    templateUrl: './nomina.component.html',
    styleUrls: ['./nomina.component.scss']
})

export class NominaComponent implements OnInit {

    @ViewChild('autocompletePeriodicidad') autocompletePeriodicidad: AutocompleteGenericComponent;
    @ViewChild('autocompleteTipoIncidencia') autocompleteTipoIncidencia: AutocompleteGenericComponent;
    @ViewChild('autocompleteTipoIncapacidad') autocompleteTipoIncapacidad: AutocompleteGenericComponent;
    @ViewChild('autocompletePercepcion') autocompletePercepcion: AutocompleteGenericComponent;
    @ViewChild('autocompleteDeduccion') autocompleteDeduccion: AutocompleteGenericComponent;

    public myGroupBuscarPeriodo: FormGroup;
    public formularioFilterQuery: FormGroup;
    public formInc: FormGroup;
    public delayBeforeSearch: number = 400; // Delay in miliseconds
    public querySubscription$: Subscription;
    public query: string = '';
    public rowsOnPage: number = 10;
    public sortBy: string;
    public sortOrder: string = 'asc';
    public page: number = 1;
    public estatus: number;
    public periodicidad: number;
    public periodicidadObject: PeriodicidadPago;
    public anio: number;
    public fechaInicio: number;
    public fechaFin: number;
    public idtrabajador: number;
    public totalNominas: number = 0;
    public data: Nomina[];
    public valor: Date;
    public fechaPeriodoDiario: Date;
    public fechaInferior: number;
    public fechaSuperior: number;
    public fechaPrimeraSemanal: number;
    public fechaSegundaSemanal: number;
    public fechaPrimeraQuincenal: number;
    public fechaSegundaQuincenal: number;
    public fechaPrimeraMensual: number;
    public fechaSegundaMensual: number;
    public semanal: number;
    public cosa: Number;
    public tablita = 0;
    public periodo: String;
    public idPeriodicidad: number;
    public iscosa: number;
    public mensajeError: String;
    public periodoButton: number = 0;
    public idTrabajador: any;
    public totalConfiguracion: any;
    public idtipoIncidencia: number;
    public userName: string;
    public idNomina: number;
    public nominaSeleccionada: any;
    public listaIds: string = "";
    public tipoTimbrado: boolean = true;
    /**
     * 1 Diario
     * 2 Semanal
     * 3 Catorcenal
     * 4 Quincenal
     * 5 Mensual
     * 6 Bimestral
     * 7 Unidad obra
     * 8 Comisión
     * 9 Precio alzado
     * 10 DecenalOtra Periodicidad
     * 11 Otra Periodicidad
     */
    public banderaPeriodicidad: number = 0;
    public incidencias = [];
    public sstrInci = [];
    public sstrInca = [];
    public percepciones = [];
    public allPerc = [];
    public sstrPerc = [];
    public deducciones = [];
    public sstrDedu = [];

    public invoiceForm: FormGroup;
    public invoiceFormPer: FormGroup;
    public invoiceFormDed: FormGroup;
    public incidenciasNotNull: boolean;
    nombreRFCDisponible: boolean;
    entidad_update: any;
    dataTable: any;
    public userNomina: any;
    configNomina: boolean = false;
    idEmpresa: number;
    tipoIncidenciasSelect = [];
    tipoIncapacidadesSelect = [];
    mesesAnio: string[] = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    usuarioEmpresa: Usuario;
    dataNomina: any[];
    quinceNomina: any[];
    semNomina: any[];
    mesNomina: any[];


    //Constructor de la clase
    constructor(private fb: FormBuilder,
        private nominaService: NominaService,
        private configuracionNominaService: ConfiguracionNominaService,
        private empresaService: EmpresaService,
        private httpDownload: Http,
        private mailService: MailService,
        private actualizacionService: ActualizacionService,
        private percepcionService: PercepcionService,
        private deduccionService: DeduccionService,
        private cfdiComponent: CfdiComponent,
        private trabajadorService: TrabajadorService,
    ) {
        this.nominaService = nominaService;
    }

    direccionMail: any;
    regexMultipleMail: string = `^((\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}),?)+$`;

    modalEnvioMail = new FormGroup({
        direccionMail: new FormControl('', [Validators.pattern(this.regexMultipleMail), Validators.required])
    })

    ngOnInit() {

        this.initFormInc();
        this.initFormQuery();
        this.initMyGroupBuscarPeriodo();
        this.buscarNominas();

        document.getElementById('periodoLabel').style.display = 'none';
        document.getElementById('periodoInput').style.display = 'none';
        document.getElementById('periodoLabelTwo').style.display = 'none';
        document.getElementById('periodoSelect').style.display = 'none';
        document.getElementById('primerDiaPeriodo').style.display = 'none';
        document.getElementById('primerDiaPeriodoInput').style.display = 'none';
        document.getElementById('quincenalPeriodo').style.display = 'none';
        document.getElementById('monthsOfyear').style.display = 'none';
        document.getElementById('periodoDiario').style.display = 'none';
        document.getElementById('periodoDiarioLabel').style.display = 'none';

        this.invoiceForm = this.fb.group({
            itemRows: this.fb.array([])
        });

        this.invoiceFormPer = this.fb.group({
            itemRowsPer: this.fb.array([])
        });

        this.invoiceFormDed = this.fb.group({
            itemRowsDed: this.fb.array([])
        });

        this.empresaService.getDetalle().then((response) => {
            this.idEmpresa = response.id;
            console.log("Empresa: ", response);
        }).catch((error) => {
            console.log('error no existe empresa', error);
        });
    }

    initFormInc() {
        this.formInc = new FormGroup({
            tipoIncidencia: new FormControl(),
            tipoPercepcion: new FormControl(),
            tipoDeduccion: new FormControl(),
            tipoIncapacidad: new FormControl(),
            fechaIncidenciaInicio: new FormControl(),
            fechaIncidenciaFin: new FormControl(),
            concepto: new FormControl(),
            monto: new FormControl(),
            dias: new FormControl(),
            numPercepcion: new FormControl(),
            conceptoA: new FormControl(),
            montoA: new FormControl(),
            numDeduccion: new FormControl(),
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this.fb.group({
            'query': ['',
                [Validators.minLength(1)]
            ]
        });

        let query$: Observable<any> = this.formularioFilterQuery.valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.query = data.query;
                console.log("Iniiit", this.query);
                this.buscar();
            });
    }

    initMyGroupBuscarPeriodo() {
        this.myGroupBuscarPeriodo = new FormGroup({
            fecha: new FormControl(),
            periodicidades: new FormControl(),
            periodoMesQuincena: new FormControl(),
            periodoQuincenal: new FormControl(),
            periodoDiario: new FormControl(),
            periodoMensual: new FormControl(),
            periodoInputnomina: new FormControl()
        });
        this.addRequiredValidator('periodicidades', this.myGroupBuscarPeriodo);
    }

    initItemRows() {
        return this.fb.group({
            tipoIncidencia: [''],
            tipoIncapacidad: [''],
            fechaIncidenciaInicio: [''],
            fechaIncidenciaFin: [''],
        });
    }

    initItemRowsPer() {
        return this.fb.group({
            tipoPercepcion: [''],
            concepto: [''],
            monto: [''],
            dias: [''],
            numPercepcion: [''],
        });
    }

    initItemRowsDed() {
        return this.fb.group({
            tipoDeduccion: [''],
            conceptoA: [''],
            montoA: [''],
            numDeduccion: [''],
        });
    }
    
    //Remueve las validaciones para el campo recibido del formulario 
    removeValidators(campo: string, form: FormGroup) {
        form.controls[campo].clearValidators();
        form.controls[campo].updateValueAndValidity();
    }

    //Agrega campo requerido 
    addRequiredValidator(campo: string, form: FormGroup) {
        form.controls[campo].setValidators(Validators.required);
        form.controls[campo].updateValueAndValidity();
    }

    get formDataInc() { return <FormArray>this.invoiceForm.get('itemRows'); }
    get formDataPer() { return <FormArray>this.invoiceFormPer.get('itemRowsPer'); }
    get formDataDed() { return <FormArray>this.invoiceFormDed.get('itemRowsDed'); }

    buscarNominas(){

        this.nominaService.listNominas(1, this.query, this.sortBy, this.sortOrder, 1, this.page).then((response) => {
            this.dataNomina = response.data;
            console.log("diaria", this.dataNomina);
        }).catch();

        this.nominaService.listNominas(2, this.query, this.sortBy, this.sortOrder, 1, this.page).then((response) => {
            this.semNomina = response.data;
            console.log("semanal", this.semNomina);
        }).catch();

        this.nominaService.listNominas(3, this.query, this.sortBy, this.sortOrder, 1, this.page).then((response) => {
            this.quinceNomina = response.data;
            console.log("quincenal", this.quinceNomina);
        }).catch();

        this.nominaService.listNominas(4, this.query, this.sortBy, this.sortOrder, 1, this.page).then((response) => {
            this.mesNomina = response.data;
            console.log("Mensual", this.mesNomina);
        }).catch();

        /*Agregar todas las nominas sin timbrar
        console.log('buscar: "' + this.periodicidad + '", "' + this.query + '", "' + this.sortBy
            + '", "' + this.sortOrder + '", "' + this.rowsOnPage + '", "' + this.page + '"');
        this.nominaService.listNominas(this.periodicidad, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).then((response) => {
            this.dataTable = response.data;
            this.totalNominas = this.dataTable.length;
            console.log("---" + this.totalNominas, this.dataTable);
            if (this.totalNominas > 0){
                this.tablita = 2
            } else {
                this.tablita = 1;
            }
        });*/
    }
    
    buscar() {
        this.nominaService.listNominas(this.periodicidad, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).then((response) => {
            this.dataTable = response.data;
            this.totalNominas = this.dataTable.length;
            if (this.totalNominas > 0){
                this.tablita = 2
            } else {
                this.buscarNominas();
                this.tablita = 1;
            }
        });
    }

    //Funciones de periodicidad
    onPeriodicidadSelected(periodicidad: any) {
        this.periodicidadObject = new PeriodicidadPago();
        this.periodicidadObject.id = periodicidad;
        this.periodicidad = periodicidad;
        if (periodicidad !== undefined && periodicidad != null && periodicidad > 0) {
            console.log("cambio");
            this.periodicidad = periodicidad.id;
            this.onPrepareGeneracion(periodicidad);
        } else {
            $( "#btnGenerate" ).prop( "disabled", true);
            this.myGroupBuscarPeriodo.get('periodicidades').setValue(0);
        }
    }

    checkPeriodo(){
        if (this.idPeriodicidad == 3){
            let mes = this.myGroupBuscarPeriodo.get("periodoMesQuincena").value;
            let periodo = this.myGroupBuscarPeriodo.get('periodoQuincenal').value;
            if (mes != null && periodo != null){
                $( "#btnGenerate" ).prop( "disabled", false);
            }
        } else {
            $( "#btnGenerate" ).prop( "disabled", false);
        }
    }
    
    onPrepareGeneracion(id: any) {
        if (id) {
            switch (id) {
                //Diario
                case '1': {
                    this.resetPeriodicidad();
                    let periodoDiario: string;
                    periodoDiario = this.myGroupBuscarPeriodo.get('periodoDiario').value;
                    this.empresaService.getDetalle().then((response) => {
                        console.log(periodoDiario,response);
                        this.configuracionNominaService.existeConfiguracion(1, response.id).then((responseNomina) => {
                            console.log(responseNomina);
                            if (responseNomina.ok == "true") {
                                console.log("SI contiene configuracion, mostrar solo el periodo siguiente a la configuracion inicial");
                                document.getElementById('periodoLabel').style.display = 'block';
                                document.getElementById('periodoInput').style.display = 'block';
                                $( "#btnGenerate" ).prop( "disabled", false );
                                this.configuracionNominaService.getPeriodo(id).then((dato) => {
                                    this.fechaPeriodoDiario = new Date();
                                    console.log(new Date().toDateString());
                                    this.fechaInferior = dato.periodo.fechaInicio;
                                    this.fechaSuperior = dato.periodo.fechaFin;
                                    let limiteSuperior: Date = new Date(this.fechaSuperior);
                                    let fechaInput: String = new Date(this.fechaInferior).getDate() + " de " + this.mesesAnio[limiteSuperior.getMonth()] + "," + limiteSuperior.getFullYear();
                                    this.myGroupBuscarPeriodo.get("periodoInputnomina").setValue(fechaInput);
                                }).catch();
                                this.configNomina = true;
                            } else {
                                document.getElementById('periodoDiario').style.display = 'block';
                                document.getElementById('periodoDiarioLabel').style.display = 'block';
                                this.configNomina = false;
                            }
                        }).catch((error) => {
                            console.log('error no existe configuracion', error);
                        });
                    });
                    break;
                }
                //Semanal
                case '2': {
                    this.resetPeriodicidad();
                    this.empresaService.getDetalle().then((data) => {
                        this.configuracionNominaService.existeConfiguracion(2, data.id).then((dato) => {
                            if (dato.ok == "true") {
                                document.getElementById('periodoLabel').style.display = 'block';
                                document.getElementById('periodoInput').style.display = 'block';
                                $( "#btnGenerate" ).prop( "disabled", false );
                                this.configuracionNominaService.getPeriodo(id).then((dato) => {
                                    this.fechaInferior = dato.periodo.fechaInicio;
                                    this.fechaSuperior = dato.periodo.fechaFin;
                                    let limiteSuperior: Date = new Date(this.fechaSuperior);
                                    let fechaInput: String = new Date(this.fechaInferior).getDate() + " al " + limiteSuperior.getDate() + " de " + this.mesesAnio[limiteSuperior.getMonth()] + "," + limiteSuperior.getFullYear();
                                    this.myGroupBuscarPeriodo.get("periodoInputnomina").setValue(fechaInput);
                                }).catch();
                                this.configNomina = true;
                            } else {
                                document.getElementById('primerDiaPeriodo').style.display = 'block';
                                document.getElementById('primerDiaPeriodoInput').style.display = 'block';
                                this.configNomina = false;
                            }
                        }).catch((error) => {
                            console.log("Error configuración: ", error);
                        });
                    });
                    break;
                }
                //Quincenal
                case '3': {
                    this.resetPeriodicidad();
                    this.empresaService.getDetalle().then((response) => {
                        this.configuracionNominaService.existeConfiguracion(3, response.id).then((responseNomina) => {
                            if (responseNomina.ok == "true") {
                                document.getElementById('periodoLabel').style.display = 'block';
                                document.getElementById('periodoInput').style.display = 'block';
                                $( "#btnGenerate" ).prop( "disabled", false );
                                this.configuracionNominaService.getPeriodo(id).then((dato) => {
                                    this.fechaPrimeraQuincenal = dato.periodo.fechaInicio;
                                    this.fechaSegundaQuincenal = dato.periodo.fechaFin;
                                    let limiteSuperior: Date = new Date(this.fechaSegundaQuincenal);
                                    let fechaInput: String = new Date(this.fechaPrimeraQuincenal).getDate() + " al " + limiteSuperior.getDate() + " de " + this.mesesAnio[limiteSuperior.getMonth()] + "," + limiteSuperior.getFullYear();
                                    this.myGroupBuscarPeriodo.get("periodoInputnomina").setValue(fechaInput);
                                }).catch();
                                this.configNomina = true;
                            } else {
                                document.getElementById('quincenalPeriodo').style.display = 'block';
                                document.getElementById('monthsOfyear').style.display = 'block';
                                document.getElementById('periodoLabelTwo').style.display = 'block';
                                document.getElementById('periodoSelect').style.display = 'block';
                                this.configNomina = false;
                            }
                        }).catch((error) => {
                            console.log("Error configuración: ", error);
                        });
                    });
                    break;
                }
                //Mensual
                case '4': {
                    this.resetPeriodicidad();
                    this.empresaService.getDetalle().then((response) => {
                        this.configuracionNominaService.existeConfiguracion(4, response.id).then((responseNomina) => {
                            if (responseNomina.ok == "true") {
                                document.getElementById('periodoLabel').style.display = 'block';
                                document.getElementById('periodoInput').style.display = 'block';
                                $( "#btnGenerate" ).prop( "disabled", false );
                                this.configuracionNominaService.getPeriodo(id).then((dato) => {
                                    this.fechaPrimeraMensual = new Date(new Date().getFullYear(), dato.periodo.mes - 1, 1).getTime();
                                    this.fechaSegundaMensual = new Date(new Date().getFullYear(), dato.periodo.mes - 1, this.daysInMonth(dato.periodo.mes, new Date().getFullYear())).getTime();
                                    let limiteSuperior: Date = new Date(this.fechaSegundaMensual);
                                    let fechaInput: String = new Date(this.fechaPrimeraMensual).getDate() + " al " + limiteSuperior.getDate() + " de " + this.mesesAnio[limiteSuperior.getMonth()] + "," + limiteSuperior.getFullYear();
                                    this.myGroupBuscarPeriodo.get("periodoInputnomina").setValue(fechaInput);
                                }).catch();
                                this.configNomina = true;
                            } else {
                                document.getElementById('quincenalPeriodo').style.display = 'block';
                                document.getElementById('monthsOfyear').style.display = 'block';
                                this.configNomina = false;
                            }
                        }).catch((error) => {
                            console.log("Error configuración: ", error);
                        });
                    });
                    break;
                }
            }
        }
    }

    resetPeriodicidad() {
        document.getElementById('periodoLabel').style.display = 'none';
        document.getElementById('periodoInput').style.display = 'none';
        document.getElementById('periodoLabelTwo').style.display = 'none';
        document.getElementById('periodoSelect').style.display = 'none';
        document.getElementById('primerDiaPeriodo').style.display = 'none';
        document.getElementById('primerDiaPeriodoInput').style.display = 'none';
        document.getElementById('quincenalPeriodo').style.display = 'none';
        document.getElementById('monthsOfyear').style.display = 'none';
        document.getElementById('periodoDiario').style.display = 'none';
        document.getElementById('periodoDiarioLabel').style.display = 'none';
    }
    
    //Fuinciones para generar nominas
    generarNomina(){
        this.periodicidad = this.periodicidadObject.id;
        if (!this.configNomina) {
            this.crearConfiguracionNomina(this.periodicidadObject.id);
        } else {
            this.nominaService.generateNominaByTrabajadores(this.periodicidad).then((data) => {
                this.buscarNominas();
                this.buscar();
            }).catch((error) => {
                console.log("Error al crear nominas", error);
            });
        }
    }

    onSearchNomina() {
        this.periodoButton = 1;
        this.tablita = 2;
        this.periodoButton = 0;
        this.iscosa = 1;
        this.page = 1;
        this.periodicidad = this.periodicidadObject.id;
        
        console.log('----Buscar: ', this.periodoButton, this.tablita, this.periodicidad, this.configNomina);

        if (!this.configNomina) {
            this.crearConfiguracionNomina(this.periodicidadObject.id);
        }

        //Periocidad Diario
        if (this.periodicidad == 1) {
            this.banderaPeriodicidad = 1;
            this.fechaPeriodoDiario = this.myGroupBuscarPeriodo.get("periodoDiario").value;
            this.configuracionNominaService.getPeriodo(this.banderaPeriodicidad).then((data) => {
                this.periodicidad = data.periodo.periodicidad.id;
                console.log("data...", data, this.periodicidad);
                this.buscar();
            }).catch((error) => {
                console.log("error con el periodo");
            });
        }
        //periodo semanal de pago
        else if (this.periodicidad == 2) {
            this.banderaPeriodicidad = 2;
            this.configuracionNominaService.getPeriodo(this.banderaPeriodicidad)
                .then((data) => {
                    console.log(data);
                    this.periodicidad = data.periodo.periodicidad.id;
                    console.log(this.periodicidad);

                    this.buscar();
                })
                .catch();


        }

        else if (this.periodicidad == 3) {
            this.banderaPeriodicidad = 3;
            let monthQuincena: any = this.myGroupBuscarPeriodo.get('periodoMesQuincena').value;

            if (this.myGroupBuscarPeriodo.get("periodoQuincenal").value == 0) {
                this.fechaInferior = new Date(new Date().getFullYear(), monthQuincena - 1, 1).getTime();
                this.fechaSuperior = new Date(new Date().getFullYear(), monthQuincena - 1, 15).getTime();
            }
            else {
                this.fechaInferior = new Date(new Date().getFullYear(), monthQuincena - 1, 16).getTime();
                this.fechaSuperior = new Date(new Date().getFullYear(), monthQuincena - 1, this.daysInMonth(monthQuincena, new Date().getFullYear())).getTime();
            }

            this.configuracionNominaService.getPeriodo(this.banderaPeriodicidad)
                .then((data) => {
                    console.log(data);
                    this.periodicidad = data.periodo.periodicidad.id;
                    console.log(this.periodicidad);

                    this.buscar();
                })
                .catch();
        }

        else if (this.periodicidad == 4) {
            this.banderaPeriodicidad = 4;
            this.fechaInferior = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
            this.fechaSuperior = new Date(new Date().getFullYear(), new Date().getMonth(), this.daysInMonth(new Date().getMonth() + 1, new Date().getFullYear())).getTime();

        }
        else {
            console.log("Error... Checacheca");
        }


    }

    /* Metodo para crear una configuracion de nomina para la empresa con la periodicidad indicada */
    crearConfiguracionNomina(periodicidad: number) {
        let configuracion = new ConfiguracionNomina();
        configuracion.periodicidad = new PeriodicidadPago;

        this.empresaService.getDetalle().then((response) => {
            configuracion.empresa = new Empresa();
            configuracion.empresa.id = Number(response.id);
        });

        configuracion.periodicidad.id = periodicidad;

        switch (Number(periodicidad)) {
            //Diario
            case 1: {
                configuracion.periodo = new Date(this.myGroupBuscarPeriodo.get("periodoDiario").value).getTime();
                console.log("confNomina ", configuracion);
                this.configuracionNominaService.create(configuracion).then((response) => {
                    console.log("configuracion creada", response);
                    this.nominaService.generateNominaByTrabajadores(this.periodicidad).then((data) => {
                        console.log("Salio bien: ", data);
                        this.buscarNominas();
                        this.buscar();
                    }).catch((error) => {
                        console.log("Error al crear nominas", error);
                    });
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
            //Semanal --- Guardar la fecha para la configuracion de la nomina solo la primera vez
            case 2: {
                configuracion.periodo = new Date(this.myGroupBuscarPeriodo.get("fecha").value).getTime();
                this.configuracionNominaService.create(configuracion).then((response) => {
                    this.nominaService.generateNominaByTrabajadores(this.periodicidad).then((data) => {
                        this.buscarNominas();
                        this.buscar();
                    }).catch((error) => {
                        console.log("Error al crear nominas", error);
                    });
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
            //Quincenal -- Guardar solo el primer dia o el dia 16 para determinar el periodo de pago
            case 3: {
                configuracion.mes = Number(this.myGroupBuscarPeriodo.get("periodoMesQuincena").value);
                if (Number(this.myGroupBuscarPeriodo.get('periodoQuincenal').value) == 0) {
                    configuracion.periodo = 1;
                } else {
                    configuracion.periodo = 16
                }
                this.configuracionNominaService.create(configuracion).then((response) => {
                    this.nominaService.generateNominaByTrabajadores(this.periodicidad).then((data) => {
                        this.buscarNominas();
                        this.buscar();
                    }).catch((error) => {
                        console.log("Error al crear nominas", error);
                    });
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
            //Mensual - Periodo = 1 para indicar que inicia con el primer dia del mes
            case 4: {
                configuracion.periodo = 1;
                configuracion.mes = Number(this.myGroupBuscarPeriodo.get("periodoMesQuincena").value);
                this.configuracionNominaService.create(configuracion).then((response) => {
                    this.nominaService.generateNominaByTrabajadores(this.periodicidad).then((data) => {
                        this.buscarNominas();
                        this.buscar();
                    }).catch((error) => {
                        console.log("Error al crear nominas", error);
                    });
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
        }

    }

    //Fuinciones de tabla
    onBotonTimbrar(item) {
        console.log("seleccion nomina", item);
        this.nominaSeleccionada = item;
    }
    
    onClick_elim(item: any) {

    }

    onChangeSize() {
        this.page = 1;
        this.buscar();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        console.log(event);

        this.buscar();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscar();
    }

    onTablaFilter(item) {
        this.periodicidad = Number(item);
        this.buscar();
        this.tablita = 2;

        switch (this.periodicidad) {
            case 1: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 2: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 3: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 4: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 5: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 6: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 7: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 8: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 9: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 10: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
            case 11: {
                this.iscosa = 1;
                console.log("El this.periodicidad es: ", this.periodicidad);
                break;
            }
        }
    }

    onElimSearch(id: number) {
        this.autocompletePeriodicidad.prepareAdd();
        this.resetPeriodicidad();
        this.banderaPeriodicidad = 0;
        this.nominaService.eliminarNomina(id);
    }

    prepareDeleteNomina(item: any){
        this.userName = item.trabajador.nombre;
        this.userNomina = item;
    }

    deleteNomina(id: number) {
        this.nominaService.eliminarNomina(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            this.buscar();
            console.log(error);
        });
        $('#modalEliminar').modal('hide');
    }

    //Funciones para timbrar
    timbrar() {
        //Timbrado Masivo
        if (this.tipoTimbrado) {
            $('#modalTimbrado .modal-title').html('Timbrado Masivo');
            $('#modalTimbrado .modal-body-dyn').html('...');
            let idConfiguracion: string = this.nominaSeleccionada.configuracion.id;
            let fechaInicio: string = this.nominaSeleccionada.fechaInicioPeriodo;
            let fechaFin: string = this.nominaSeleccionada.fechaFinPeriodo;
            console.log("masivo", this.nominaSeleccionada, fechaInicio, fechaFin, idConfiguracion);
            this.nominaService.timbradoMasivo(idConfiguracion, fechaInicio, fechaFin).then((response) => {
                if (response.ok == "ok") {
                    console.log("timbrado masivo");
                    $('#modalTimbrado .modal-body-dyn').html('Timbrado exitoso');
                }
                else if (response.ok) {
                    console.log("timbrado masivo con warning?");
                    $('#modalTimbrado .modal-body-dyn').html(response.ok);
                }
                else {
                    console.log(response);
                    $('#modalTimbrado .modal-body-dyn').html('Error al timbrar masivamente');
                }
            }).catch((error) => {
                console.log("error al timbrar masivamente");
                console.log(error);
                $('#modalTimbrado .modal-body-dyn').html('Error al timbrar masivamente');
            });
        }
        //Timbrado selectivo
        else {
            this.concatenaIds();
            this.nominaService.timbradoSeleccion(this.listaIds).then((response) => {
                if (response.ok = "ok") {
                    console.log("timbrado selectivo");
                    $('#modalTimbrado .modal-body-dyn').html('Timbrado exitoso');
                }
            }).catch((error) => {
                console.log("error al timbrar selectivo");
                $('#modalTimbrado .modal-body-dyn').html('Error al timbrar selectivo');
            })
        }
    }

    activaTimbrado(id: number) {
        //Timbrado manual
        $('#modalTimbrado .modal-title').html('Timbrado Manual');
        $('#modalTimbrado .modal-body-dyn').html('...');
        this.nominaService.timbradoManual(id).then((response) => {
            console.log(response);
            if (response.ok == 'ok')
                $('#modalTimbrado .modal-body-dyn').html('Timbrado exitoso');
            else if (response.ok)
                $('#modalTimbrado .modal-body-dyn').html(response.ok);
            else
                $('#modalTimbrado .modal-body-dyn').html(response.mensaje);
        }).catch((error) => {
            console.log(error);
            $('#modalTimbrado .modal-body-dyn').html('Error al timbrar: ' + error.mensaje);
        })
    }

    concatenaIds() {
        let checks: any = document.getElementsByClassName('timbrar');
        for (var i = 0; i < checks.length; i++) {
            if (checks[i].checked == true) {
                this.listaIds += checks[i].id;
                if (i < checks.length - 1) {
                    this.listaIds += ",";
                }
            }
        }
    }

    //Metodo para generar vista previa del PDF de nomina (antes de ser timbrada)
    generatePDF(item: any) {
        let idNomina: String = item.id;
        this.generateXML(item, false);
        let rfcEmpresa = item.trabajador.empresa.rfc;
        console.log("Datos pdf: ", rfcEmpresa, item);

        this.nominaService.crearPdf(item.id).then((response) => {
            if (response.ok == "ok") {
                setTimeout(() => {
                    this.nominaService.descargarPDF(idNomina);
                }, 200);
            }
        }).catch((error) => {
            console.log("error con el archivo PDF...", error);
        });
    }

    //Metodo para generar XMl previo al trimbrado
    generateXML(item: any, download: boolean) {
        let idNomina: String = item.id;
        let rfcEmpresa = item.trabajador.empresa.rfc
        console.log("Datos xml: ", rfcEmpresa, item);

        this.nominaService.generaXml(item.id).then((response) => {
            if (response.ok == "ok" && download == true) {
                console.log(this.idEmpresa);
                setTimeout(() => {
                    this.nominaService.descargarXML(idNomina);
                }, 200);
            }
        }).catch((error) => {
            console.log("error con el archivo XML...", error);
        });
    }

    //Metodo para generar CSV previo al trimbrado
    generateCSV() {
        this.nominaService.getNominaCSV(this.nominaSeleccionada.configuracion.id);
    }
    
    //Funciones para enviar correo
    prepararMail(item: any) {
        console.log("Correo", item);
        this.entidad_update = item;
        this.modalEnvioMail.reset();
        if ((item.trabajador.nombre != null && item.trabajador.nombre != undefined) || (item.trabajador.rfc != null && item.trabajador.rfc != undefined)) {
            this.nombreRFCDisponible = true;
            this.modalEnvioMail.get("direccionMail").setValue(item.trabajador.correo + "," + item.trabajador.correosExtras);
        }
    }

    sendMail() {
        let listMail = this.modalEnvioMail.controls["direccionMail"].value;
        this.mailService.sendMailNomina(this.entidad_update.id, listMail).then((response) => {
            console.log(response);
            if (response.ok == "enviado") {
                console.log("Correo Enviado con exitó");
                $('#modalMail').modal('hide');
            }
        }).catch((error) => {
            console.log("Error de correo: ", error);
            this.mensajeError = "Error al enviar correo";
        });
    }

    //Funciones de incidencias
    prepareIncidencia(item: any) {
        this.incidenciasNotNull = true;

        this.invoiceForm = this.fb.group({
            itemRows: this.fb.array([])
        });
        this.incidencias = []
        this.sstrInci = [];
        this.sstrInca = [];
        this.invoiceFormPer = this.fb.group({
            itemRowsPer: this.fb.array([])
        });
        this.percepciones = [];
        this.allPerc = [];
        this.sstrPerc = [];
        this.invoiceFormDed = this.fb.group({
            itemRowsDed: this.fb.array([])
        });
        this.deducciones = [];
        this.sstrDedu = [];

        console.log(item.trabajador.trabajadorIncidenciaList);
        if (item.trabajador.trabajadorIncidenciaList == null)
            item.trabajador.trabajadorIncidenciaList = [];
        item.trabajador.trabajadorIncidenciaList.forEach((e, i) => {
            if (e.tipoIncidencia.id !== undefined) {
                console.log(i + ': [' + e.id + '] Incidencia');
                this.addNewRow(e);
                this.incidencias.push(e.id);
            }
            else if (e.nominaPercepcion.id !== undefined) {
                console.log(i + ': [' + e.id + '] Percepcion');
                this.addNewRowPer(e);
                this.percepciones.push(e.id);
            }
            else if (e.nominaDeduccion.id !== undefined) {
                console.log(i + ': [' + e.id + '] Deduccion');
                this.addNewRowDed(e);
                this.deducciones.push(e.id);
            }
            else
                console.log(i + ': [' + e.id + '] Error');
        });
        // console.log(this.incidencias);
        // console.log(this.percepciones);
        // console.log(this.deducciones);

        this.userName = item.trabajador.nombre;
        this.idTrabajador = item;
        this.formInc.reset();

        this.nominaService.selectIncidencia().subscribe((response) => {
            this.tipoIncidenciasSelect = response;
            // console.log(response);
        });

        this.nominaService.selectIncapacidad().subscribe((response) => {
            this.tipoIncapacidadesSelect = response;
            // console.log(response);
        });
    }
    
    ontipoIncidenciaSelected(tipoIncidencias: any, ctrl: any) {
        if (tipoIncidencias !== undefined && tipoIncidencias != null && tipoIncidencias > 0) {
            ctrl.get('tipoIncidencia').setValue(tipoIncidencias);
            this.onRecibeIncidencia(tipoIncidencias);
        } else {
            ctrl.get('tipoIncidencia').setValue(0);
        }
    }

    onRecibeIncidencia(id: any) {
        if (id) {
            this.removeValidators('tipoIncidencia', this.formInc);
            this.removeValidators('tipoPercepcion', this.formInc);
            this.removeValidators('concepto', this.formInc);
            this.removeValidators('monto', this.formInc);
            this.removeValidators('numPercepcion', this.formInc);
            this.removeValidators('tipoDeduccion', this.formInc);
            this.removeValidators('conceptoA', this.formInc);
            this.removeValidators('montoA', this.formInc);
            this.removeValidators('numDeduccion', this.formInc);
            // document.getElementById('agregaIncidenciaBtn').removeAttribute("disabled");
            // document.getElementById("agregaIncidenciaBtn").classList.remove("btn-opcion");
            // document.getElementById("agregaIncidenciaBtn").classList.add("btn-warning");
            switch (id) {
                case '1':
                case '2':
                case '3':

                    // document.getElementById('tipoIncapacidad').style.display = 'block';
                    // document.getElementById('fechaIncidenciaInicio').style.display = 'block';
                    // document.getElementById('fechaIncidenciaFin').style.display = 'block';

                    break;

                // case '2':
                //   break;

                // case '3':
                //   break;

            }
        }
        else {
            console.log("Cocha pacha");
        }
    }

    onTipoIncapacidadSelected(tipoIncapacidad: any, ctrl: any) {
        if (tipoIncapacidad !== undefined && tipoIncapacidad != null && tipoIncapacidad > 0) {
            ctrl.get('tipoIncapacidad').setValue(tipoIncapacidad);
        } else {
            ctrl.get('tipoIncapacidad').setValue(0);
        }
    }

    onPercepcionSelected(tipoPercepcion: any, ctrl: any, idx: number) {
        if (tipoPercepcion !== undefined && tipoPercepcion != null && tipoPercepcion > 0) {
            ctrl.get('tipoPercepcion').setValue(tipoPercepcion);
            this.percepcionService.getDetalle(tipoPercepcion).then((dato) => {
                this.allPerc[idx] = dato.percepcion.id;
                ctrl.get('concepto').setValue(dato.percepcion.descripcion);
                this.onRecibePercepcion(dato.percepcion.id);
            });
        } else {
            ctrl.get('tipoPercepcion').setValue(0);
        }
    }

    onRecibePercepcion(id: any) {
        if (id) {
            document.getElementById('concepto').style.display = 'block';
            document.getElementById('numPercepcion').style.display = 'block';
            this.removeValidators('tipoIncidencia', this.formInc);
            this.removeValidators('tipoIncapacidad', this.formInc);
            this.removeValidators('fechaIncidenciaInicio', this.formInc);
            this.removeValidators('fechaIncidenciaFin', this.formInc);
            this.removeValidators('tipoPercepcion', this.formInc);
            this.removeValidators('tipoDeduccion', this.formInc);
            this.removeValidators('conceptoA', this.formInc);
            this.removeValidators('montoA', this.formInc);
            this.removeValidators('numDeduccion', this.formInc);
            // document.getElementById('agregarPercepcionBtn').removeAttribute("disabled");
            // document.getElementById("agregarPercepcionBtn").classList.remove("btn-opcion");
            // document.getElementById("agregarPercepcionBtn").classList.add("btn-warning");
        }
        else {
            console.log("Cocha pacha");
        }
    }

    onDeduccionSelected(tipoDeduccion: any, ctrl: any) {
        if (tipoDeduccion !== undefined && tipoDeduccion != null && tipoDeduccion > 0) {
            ctrl.get('tipoDeduccion').setValue(tipoDeduccion);
            this.deduccionService.getDetalle(tipoDeduccion).then((dato) => {
                // this.deducciones[idx] = dato.deduccion.id;
                ctrl.get('conceptoA').setValue(dato.deduccion.descripcion);
                this.onRecibeDeduccion(dato.deduccion.id);
            });
        } else {
            ctrl.get('tipoDeduccion').setValue(0);
        }
    }

    onRecibeDeduccion(id: any) {
        if (id) {
            //Agregar Validadores
            document.getElementById('conceptoA').style.display = 'block';
            document.getElementById('montoA').style.display = 'block';
            document.getElementById('numDeduccion').style.display = 'block';
            this.removeValidators('tipoDeduccion', this.formInc);
            // document.getElementById('agregarDeduccionBtn').removeAttribute("disabled");

            // document.getElementById("agregarDeduccionBtn").classList.remove("btn-opcion");
            // document.getElementById("agregarDeduccionBtn").classList.add("btn-warning");
        }
        else {
            console.log("Cocha pacha");
        }
    }
    
    onSubmitIncidentes() {
        let submitData = new TrabajadorIncidencia;
        let percepciones = <FormArray>this.invoiceFormPer.get('itemRowsPer');
        let deducciones = <FormArray>this.invoiceFormDed.get('itemRowsDed');
        let incidencias = <FormArray>this.invoiceForm.get('itemRows');

        /*
        updateTrabajadorIncidencia(dataTIncidencia: TrabajadorIncidencia)
        createTrabajadorIncidencia(dataTIncidencia: TrabajadorIncidencia)
        removeTrabajadorIncidencia(id: number)
        
        this.idTrabajador.trabajador.trabajadorIncidenciaList
        */

        // Percepciones
        $.each(percepciones.controls, (i, e) => {
            if (/^[0-9]+$/.test(e.get('tipoPercepcion').value)) {
                submitData = new TrabajadorIncidencia;
                submitData.tipo = 0;
                submitData.trabajador = new Trabajador;
                submitData.trabajador.id = this.idTrabajador.trabajador.id;
                submitData.nominaPercepcion = new NominaPercepcion;

                submitData.nominaPercepcion.id = Number(e.get('tipoPercepcion').value);
                submitData.conceptoPercepcion = e.get('concepto').value;
                submitData.montoPercepcion = e.get('monto').value;
                submitData.diasPercepcion = e.get('dias').value;
                submitData.nNominasPercepcion = e.get('numPercepcion').value;

                if (i < this.percepciones.length) {
                    console.log('actualizar Percepcion:');
                    submitData.id = this.percepciones[i];
                    console.log(submitData);
                    this.nominaService.updateTrabajadorIncidencia(submitData).then((dato) => {
                        console.log(dato);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                else {
                    console.log('crear Percepcion:');
                    console.log(submitData);
                    this.nominaService.createTrabajadorIncidencia(submitData).then((dato) => {
                        console.log(dato);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        });

        // Deducciones
        $.each(deducciones.controls, (i, e) => {
            if (/^[0-9]+$/.test(e.get('tipoDeduccion').value)) {
                submitData = new TrabajadorIncidencia;
                submitData.tipo = 1;
                submitData.trabajador = new Trabajador;
                submitData.trabajador.id = this.idTrabajador.trabajador.id;
                submitData.nominaDeduccion = new NominaDeduccion;

                submitData.nominaDeduccion.id = Number(e.get('tipoDeduccion').value);
                submitData.conceptoDeduccion = e.get('conceptoA').value;
                submitData.montoDeduccion = e.get('montoA').value;
                submitData.nNominasDeduccion = e.get('numDeduccion').value;

                if (i < this.deducciones.length) {
                    console.log('actualizar Deduccion:');
                    submitData.id = this.deducciones[i];
                    console.log(submitData);
                    this.nominaService.updateTrabajadorIncidencia(submitData).then((dato) => {
                        console.log(dato);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                else {
                    console.log('crear Deduccion:');
                    console.log(submitData);
                    this.nominaService.createTrabajadorIncidencia(submitData).then((dato) => {
                        console.log(dato);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        });

        // Incidencias
        $.each(incidencias.controls, (i, e) => {
            if (/^[0-9]+$/.test(e.get('tipoIncidencia').value)) {
                submitData = new TrabajadorIncidencia;
                submitData.tipo = 2;
                submitData.trabajador = new Trabajador;
                submitData.trabajador.id = this.idTrabajador.trabajador.id;
                submitData.tipoIncidencia = new TipoIncidencia;
                submitData.tipoIncapacidad = new TipoIncapacidad;

                submitData.tipoIncidencia.id = Number(e.get('tipoIncidencia').value);
                submitData.tipoIncapacidad.id = Number(e.get('tipoIncapacidad').value);
                submitData.fechaInicio = new Date(e.get('fechaIncidenciaInicio').value).getTime();
                submitData.fechaFin = new Date(e.get('fechaIncidenciaFin').value).getTime();

                if (i < this.incidencias.length) {
                    console.log('actualizar Incidencia:');
                    submitData.id = this.incidencias[i];
                    console.log(submitData);
                    this.nominaService.updateTrabajadorIncidencia(submitData).then((dato) => {
                        console.log(dato);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                else {
                    console.log('crear Incidencia:');
                    console.log(submitData);
                    this.nominaService.createTrabajadorIncidencia(submitData).then((dato) => {
                        console.log(dato);
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        });

        // Eliminar
        let concat = this.percepciones.concat(this.deducciones, this.incidencias);
        console.log('incidencias Ini:');
        console.log(this.idTrabajador.trabajador.trabajadorIncidenciaList);
        console.log('concat:');
        console.log(concat);
        this.idTrabajador.trabajador.trabajadorIncidenciaList.forEach((e, i) => {
            if (concat.indexOf(e.id) == -1) {
                console.log('eliminar id: ' + e.id);
                this.nominaService.removeTrabajadorIncidencia(e.id).then((dato) => {
                    console.log(dato);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });

        setTimeout(() => {
            this.nominaService.listTrabajadorIncidencia(this.idTrabajador.trabajador.id).then((response) => {
                this.idTrabajador.trabajador.trabajadorIncidenciaList = response.data;
            }).catch((error) => {
                console.log(error);
            });
        }, 200);

        $("#Incidencia").modal("hide");
    }
    
    //Agregar incidencias
    addNewRow(item: any = undefined) {
        const control = <FormArray>this.invoiceForm.controls['itemRows'];
        let row = this.initItemRows();

        if (item !== undefined) {
            row.get('tipoIncidencia').setValue(item.tipoIncidencia.id);
            this.sstrInci.push(item.tipoIncidencia.descripcion);
            row.get('tipoIncapacidad').setValue(item.tipoIncapacidad.id);
            this.sstrInca.push(item.tipoIncapacidad.descripcion);
            let fI = new Date(item.fechaInicio);
            row.get('fechaIncidenciaInicio').setValue(fI.toISOString().slice(0, 10));
            let fF = new Date(item.fechaFin);
            row.get('fechaIncidenciaFin').setValue(fF.toISOString().slice(0, 10));
        }

        control.push(row);
    }
    
    addNewRowPer(item: any = undefined) {
        const controlPer = <FormArray>this.invoiceFormPer.controls['itemRowsPer'];
        let row = this.initItemRowsPer();
        if (item !== undefined) {
            row.get('tipoPercepcion').setValue(item.nominaPercepcion.id);
            this.sstrPerc.push(item.nominaPercepcion.nombre);
            row.get('concepto').setValue(item.nominaPercepcion.percepcion.descripcion);
            this.allPerc.push(item.nominaPercepcion.percepcion.id);
            row.get('monto').setValue(item.montoPercepcion);
            // row.get('dias').setValue(item.diasPercepcion);
            row.get('numPercepcion').setValue(item.nNominasPercepcion);
        }
        else{
            this.allPerc.push(-1);
        }
        controlPer.push(row);
    }

    addNewRowDed(item: any = undefined) {
        const controlDed = <FormArray>this.invoiceFormDed.controls['itemRowsDed'];
        let row = this.initItemRowsDed();
        if (item !== undefined) {
            row.get('tipoDeduccion').setValue(item.nominaDeduccion.id);
            this.sstrDedu.push(item.nominaDeduccion.nombre);
            row.get('conceptoA').setValue(item.nominaDeduccion.deduccion.descripcion);
            row.get('montoA').setValue(item.montoDeduccion);
            row.get('numDeduccion').setValue(item.nNominasDeduccion);
        }
        controlDed.push(row);
    }

    //Eliminar incidencias
    deleteRow(index: number) {
        const control = <FormArray>this.invoiceForm.controls['itemRows'];
        control.removeAt(index);
        if (index < this.incidencias.length)
            this.incidencias.splice(index, 1);
    }

    deleteRowPer(index: number) {
        const controlPer = <FormArray>this.invoiceFormPer.controls['itemRowsPer'];
        controlPer.removeAt(index);
        this.allPerc.splice(index, 1);
        if (index < this.percepciones.length)
            this.percepciones.splice(index, 1);
    }

    deleteRowDed(index: number) {
        const controlDed = <FormArray>this.invoiceFormDed.controls['itemRowsDed'];
        controlDed.removeAt(index);
        if (index < this.deducciones.length)
            this.deducciones.splice(index, 1);
    }

    //Otras funciones
    //funcion para limpiar formularios dinamicos de incidencias
    cleanForm() {

    }

    changeTimestampToDate(timestamp: number): string {
        let dateFormat: string;
        let dateFormatTimestamp: Date = new Date(timestamp);
        console.log(dateFormatTimestamp.toDateString());
        let mouth: string = (dateFormatTimestamp.getMonth() + 1) + "";
        let day: string = dateFormatTimestamp.getDate() + "";
        if (dateFormatTimestamp.getMonth() + 1 < 10) {
            mouth = "0" + (dateFormatTimestamp.getMonth() + 1);
        }
        if (dateFormatTimestamp.getDate() < 10) {
            day = "0" + dateFormatTimestamp.getDate();
        }
        dateFormat = dateFormatTimestamp.getFullYear() + "-" + mouth + "-" + day;
        return dateFormat;
    }

    changeDateToTimestamp(date: String): number {
        let changedDate: string[] = date.split("-");
        let datetimeStamp = new Date(Number(changedDate[0]), Number(changedDate[1]) - 1, Number(changedDate[2]), 0, 0, 0);
        return datetimeStamp.getTime();
    }

    daysInMonth(month, year) { // Use 1 for January, 2 for February, etc.
        let daysInMonth = new Date(year, month, 0).getDate();
        return daysInMonth;
    }

    addManual(){
        this.cfdiComponent.change(3)
    }

}

