import { TrabajadoresComponent } from "app/pages/trabajadores";
import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { NgaModule } from 'app/theme/nga.module';
import { Observable } from 'rxjs/Observable';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Trabajador } from '../../entidades/trabajador';
import { TrabajadorService } from '../../servicios-backend/trabajador.service';
import { Empresa } from 'app/entidades/empresa';
import { Sucursal } from "app/entidades/sucursal";
import { TipoRegimen } from "app/entidades/tipo-regimen";
import { Banco } from "app/entidades/banco";
import { TipoContrato } from '../../entidades/tipo-contrato';
import { PeriodicidadPago } from '../../entidades/periodicidad-pago';
import { TipoJornada } from '../../entidades/tipo-jornada';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { CpService } from 'app/servicios-backend/cp.service';
import { EmailValidator } from '../../theme/validators/email.validator';
import { SucursalService } from "../../servicios-backend/sucursal.servicio";
import { ConfiguracionNominaService } from "../../servicios-backend/configuracion-nomina.service";
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { DeduccionService } from '../../servicios-backend/deduccion.service';
import { PercepcionService } from '../../servicios-backend/percepcion.service';

@Component({
    selector: 'app-trnuevo',
    templateUrl: './trabajador-nuevo.component.html',
    styleUrls: ['./trabajador-nuevo.component.scss']
})
export class TrabajadorNuevoComponent implements OnInit {
    empresaService: EmpresaService;
    form: any;
    FormControl: any;
    formcontrol: string;
    perForm: FormGroup;
    dedForm: FormGroup;


    data: Trabajador[];
    rowsOnPage: number = 10;
    sortBy: string = '';
    sortOrder: string = 'asc';
    page: number = 1;
    totalTrabajadores: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    entidad_elimar: Trabajador;
    valor: number;

    /**
  * Variables para filtrar por query
  */
    queryTrabajadores: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;


    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;
    @ViewChild('autocompleteTipoRegimen') autocompleteTipoR: AutocompleteGenericComponent;
    @ViewChild('autocompleteBanco') autocompleteB: AutocompleteGenericComponent;
    @ViewChild('autocompleteTipoContrato') autocompleteTipoC: AutocompleteGenericComponent;
    @ViewChild('autocompleteJornada') autocompleteJornada: AutocompleteGenericComponent;
    @ViewChild('autocompletePeriodicidad') autocompletePeriodicidad: AutocompleteGenericComponent;
    @ViewChild('autocompleteSucursalService') autocompleteSucursalService: AutocompleteGenericComponent;


    colonias = [];
    deducciones = [];
    percepciones = [];
    jornadas = [];
    tipoContratos = [];
    periodicidades = [];
    sucursales: boolean = false;
    bancos = [];
    tipoRegimenes = [];

    public myGroupTrabajadores: FormGroup;
    public nombre: AbstractControl;
    public correo: AbstractControl;
    public rfc: AbstractControl;
    public calle: AbstractControl;
    public numeroInterior: AbstractControl;
    public numeroExterior: AbstractControl;
    public cp: AbstractControl;
    public colonia: AbstractControl;
    public deduccion: AbstractControl;
    public percepcion: AbstractControl;
    public localidad: AbstractControl;
    public municipio: AbstractControl;
    public estado: AbstractControl;
    public pais: AbstractControl;
    public referencia: AbstractControl;
    public correosExtras: AbstractControl;
    public registroPatronal: AbstractControl;
    public numeroEmpleado: AbstractControl;
    public curp: AbstractControl;
    public tipoRegimen: AbstractControl;
    public nss: AbstractControl;
    public departamento: AbstractControl;
    public claveInterbancaria: AbstractControl;
    public banco: AbstractControl;
    public fechaInicioLaboral: AbstractControl;
    public puesto: AbstractControl;
    public tipoContrato: AbstractControl;
    public jornada: AbstractControl;
    public horasDia: AbstractControl;
    public periodicidad: AbstractControl;
    public salarioBase: AbstractControl;
    public salarioDiario: AbstractControl;
    public sucursal: AbstractControl;
    public tipoTrabajador: AbstractControl;

    public submitted: boolean = false;
    public mensajeError: string;

    constructor(empresaService: EmpresaService, private trabajadoresComponent: TrabajadoresComponent, private _fb: FormBuilder, private cpService: CpService, fb: FormBuilder, private trabajadorService: TrabajadorService, private sucursalService: SucursalService, private configuracionNominaService: ConfiguracionNominaService, private deduccionService: DeduccionService, private percepcionService: PercepcionService) {

        this.empresaService = empresaService;
        this.myGroupTrabajadores = fb.group({
            'nombre': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(210)
            ]],
            'correo': ['', [
                Validators.required,
                EmailValidator.validate,
                Validators.minLength(4),
                Validators.maxLength(60)
            ]],
            'rfc': ['', [
                Validators.required,
                Validators.minLength(12),
                Validators.maxLength(13),
                //Validators.pattern(/^[A-Z]{3,4}\d{6}(?:[A-Z\d]{3})?$/)
            ]],
            'calle': ['',
                Validators.maxLength(180)
            ],
            'numeroInterior': ['',
                Validators.maxLength(10)
            ],
            'numeroExterior': ['',
                Validators.maxLength(10)
            ],
            'cp': ['', [
                Validators.required
            ]],
            'colonia': ['',
                Validators.maxLength(80)
            ],
            'localidad': ['',
                Validators.maxLength(100)
            ],
            'municipio': ['',
                Validators.maxLength(70)
            ],
            'estado': ['', [
                Validators.required, Validators.minLength(4)
            ]],
            'pais': ['',
                Validators.maxLength(100)
            ],
            'referencia': ['',
                Validators.maxLength(180)
            ],
            'correosExtras': ['',
                Validators.maxLength(250)
            ],
            'registroPatronal': ['',
                Validators.maxLength(15)
            ],
            'numeroEmpleado': ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(11),
                Validators.pattern('^[0-9]+$')
            ]],
            'curp': ['', [
                Validators.required,
                Validators.minLength(18),
                Validators.maxLength(18)
            ]],
            'tipoRegimen': ['', [
                Validators.required,
                // Validators.minLength(4),
                // Validators.maxLength(10)
            ]],
            'nss': ['', [
                Validators.required,
                Validators.minLength(11),
                Validators.maxLength(11)
            ]],
            'departamento': ['', [
                Validators.required
            ]],
            'claveInterbancaria': ['',
                Validators.maxLength(17)
            ],
            'banco': ['',
                // Validators.maxLength(10)
            ],
            'fechaInicioLaboral': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(20)
            ]],
            'puesto': ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ]],
            'tipoContrato': ['', [
                Validators.required,
                // Validators.minLength(4),
                // Validators.maxLength(10)
            ]],
            'jornada': ['', [
                Validators.required,
                // Validators.minLength(4),
                // Validators.maxLength(10)
            ]],
            'horasDia': ['', [
                Validators.pattern('^[0-9]+$')
            ]],
            'periodicidad': ['', [
                // Validators.required,
                // Validators.minLength(4),
                // Validators.maxLength(10)
            ]],
            'salarioBase': ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')

            ]],
            'salarioDiario': ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')
            ]],
            'sucursal': ['', [
                Validators.required,
                // Validators.minLength(4), 
                // Validators.maxLength(10)
            ]],
            'tipoTrabajador': ['',
            ],
            'deduccion': ['',
            ],
            'percepcion': ['',
            ],
        });

        this.nombre = this.myGroupTrabajadores.controls['nombre'];
        this.correo = this.myGroupTrabajadores.controls['correo'];
        this.rfc = this.myGroupTrabajadores.controls['rfc'];
        this.calle = this.myGroupTrabajadores.controls['calle'];
        this.numeroInterior = this.myGroupTrabajadores.controls['numeroInterior'];
        this.numeroExterior = this.myGroupTrabajadores.controls['numeroExterior'];
        this.cp = this.myGroupTrabajadores.controls['cp'];
        this.colonia = this.myGroupTrabajadores.controls['colonia'];
        this.localidad = this.myGroupTrabajadores.controls['localidad'];
        this.municipio = this.myGroupTrabajadores.controls['municipio'];
        this.estado = this.myGroupTrabajadores.controls['estado'];
        this.pais = this.myGroupTrabajadores.controls['pais'];
        this.referencia = this.myGroupTrabajadores.controls['referencia'];
        this.correosExtras = this.myGroupTrabajadores.controls['correosExtras'];
        this.registroPatronal = this.myGroupTrabajadores.controls['registroPatronal'];
        this.numeroEmpleado = this.myGroupTrabajadores.controls['numeroEmpleado'];
        this.curp = this.myGroupTrabajadores.controls['curp'];
        this.tipoRegimen = this.myGroupTrabajadores.controls['tipoRegimen'];
        this.nss = this.myGroupTrabajadores.controls['nss'];
        this.departamento = this.myGroupTrabajadores.controls['departamento'];
        this.claveInterbancaria = this.myGroupTrabajadores.controls['claveInterbancaria'];
        this.banco = this.myGroupTrabajadores.controls['banco'];
        this.fechaInicioLaboral = this.myGroupTrabajadores.controls['fechaInicioLaboral'];
        this.puesto = this.myGroupTrabajadores.controls['puesto'];
        this.tipoContrato = this.myGroupTrabajadores.controls['tipoContrato'];
        this.jornada = this.myGroupTrabajadores.controls['jornada'];
        this.horasDia = this.myGroupTrabajadores.controls['horasDia'];
        this.periodicidad = this.myGroupTrabajadores.controls['periodicidad'];
        this.salarioBase = this.myGroupTrabajadores.controls['salarioBase'];
        this.salarioDiario = this.myGroupTrabajadores.controls['salarioDiario'];
        this.sucursal = this.myGroupTrabajadores.controls['sucursal'];
        this.tipoTrabajador = this.myGroupTrabajadores.controls['tipoTrabajador'];
        this.deduccion = this.myGroupTrabajadores.controls['deduccion'];
        this.percepcion = this.myGroupTrabajadores.controls['deduccion'];
    }

    ngOnInit() {

        this.initFormQuery();
        this.setValor();
        this.buscarDeduccion();
        this.buscarPercepcion();

        this.perForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        });
        this.dedForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        });

        this.sucursalService.getSucursales("", "", "", 10, 1)
            .subscribe((response) => {
                if (response.total != undefined && response.total > 0) {
                    this.sucursales = true;
                } else {
                    this.sucursales = false;
                    this.myGroupTrabajadores.get('sucursal').disable();
                }
            });
        this.trabajadorService.obtenerJornadas().subscribe((response) => {
            this.jornadas = response;
        });
    }

    buscarDeduccion() {
        this.deduccionService.getDeducciones('', this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataDeducciones) => {
                for (let deduccion of dataDeducciones.data){
                    this.deducciones.push(deduccion.nombre);
                }
            },
            (error) => {
            }
        )
    }

    buscarPercepcion() {
        this.percepcionService.getPercepciones('', this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataPercepciones) => {
                for (let percepcion of dataPercepciones.data){
                    this.percepciones.push(percepcion.nombre);
                }
            },
            (error) => {
            }
        )
    }

    initItemRows() {
        return this._fb.group({
            percepcion: [''],
            deduccion: [''],
        });
    }
    
    addNewPercepcion() {
        const control = <FormArray>this.perForm.controls['itemRows'];
        control.push(this.initItemRows());
    }

    deletePercepcion(index: number) {
        const control = <FormArray>this.perForm.controls['itemRows'];
        control.removeAt(index);
    }

    addDeduccion() {
        const control = <FormArray>this.dedForm.controls['itemRows'];
        control.push(this.initItemRows());
    }
    deleteDeduccion(index: number) {
        const control = <FormArray>this.dedForm.controls['itemRows'];
        control.removeAt(index);
    }

    registroK() {

    }

    cambio(valor) {
        this.trabajadoresComponent.change(valor);
    }

    initFormQuery() {
        // this.formularioFilterQuery = this.fb.group({
        //   'queryTrabajadores': ['',
        //     [Validators.minLength(1)]
        //   ]
        // });
        // let query$: Observable<any> = this.formularioFilterQuery
        //   .valueChanges.debounceTime(this.delayBeforeSearch);
        // this.querySubscription$ = query$.subscribe(
        //   (data) => {
        //     this.queryTrabajadores = data.queryChequera;
        //     this.agregarTrabajador();
        //   });
    }

    setValor() {
        this.myGroupTrabajadores.get("banco").setValue(1);
        this.empresaService.getDetalle().then(
            (data) => {
                if (data != undefined && data.id != undefined) {
                    console.log("DATA TRAEEEE....", data.registroPatronal);
                    this.myGroupTrabajadores.get('registroPatronal').setValue(data.registroPatronal);
                }
            }
        )
        .catch();
    }

    rfcValido(rfc, aceptarGenerico = true) {
        const re = (/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/);
        var validado = rfc.match(re);

        if (!validado)  //Coincide con el formato general del regex?
            return false;

        //Separar el dígito verificador del resto del RFC
        const digitoVerificador = validado.pop(),
            rfcSinDigito = validado.slice(1).join(''),
            len = rfcSinDigito.length,

            //Obtener el digito esperado
            diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
            indice = len + 1;
        var suma,
            digitoEsperado;

        if (len == 12) suma = 0
        else suma = 481; //Ajuste para persona moral

        for (var i = 0; i < len; i++)
            suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
        digitoEsperado = 11 - suma % 11;
        if (digitoEsperado == 11) digitoEsperado = 0;
        else if (digitoEsperado == 10) digitoEsperado = "A";

        //El dígito verificador coincide con el esperado?
        // o es un RFC Genérico (ventas a público general)?
        if ((digitoVerificador != digitoEsperado)
            && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
            return false;
        else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
            return false;
        return rfcSinDigito + digitoVerificador;
    }

    onKey(event) {
        const inputValue = event.target.value;
        var rfc = inputValue, resultado = document.getElementById("rfc");

        var rfcCorrecto = this.rfcValido(rfc);   // ⬅️ Acá se comprueba
        if (rfcCorrecto) {
            resultado.classList.add("ok");
        } else {
            resultado.classList.remove("ok");
        }
    }

    agregarTrabajador() {
        this.mensajeError = undefined;
        this.submitted = true;

        if (this.myGroupTrabajadores.valid) {
            let fecha: number[] = this.myGroupTrabajadores.get('fechaInicioLaboral').value.split("-");
            let fechaInicioLaboral: Date = new Date(fecha[0], fecha[1] - 1, fecha[2], 0, 0, 0);
            let agregar_trabajador: Trabajador = new Trabajador();
            let tipoRegimen = new TipoRegimen();
            let banco = new Banco();
            let tipoContrato = new TipoContrato();
            let perioricidad = new PeriodicidadPago();
            let jornada = new TipoJornada();
            if (this.sucursales) {
                let sucursal = new Sucursal();
                sucursal.id = Number(this.myGroupTrabajadores.get('sucursal').value);
                agregar_trabajador.sucursal = sucursal;
            }


            agregar_trabajador.empresa = new Empresa();

            agregar_trabajador.nombre = this.myGroupTrabajadores.get('nombre').value;
            agregar_trabajador.correo = this.myGroupTrabajadores.get('correo').value;
            agregar_trabajador.rfc = this.myGroupTrabajadores.get('rfc').value;
            agregar_trabajador.calle = this.myGroupTrabajadores.get('calle').value;
            agregar_trabajador.numeroInterior = this.myGroupTrabajadores.get('numeroInterior').value;
            agregar_trabajador.numeroExterior = this.myGroupTrabajadores.get('numeroExterior').value;
            agregar_trabajador.cp = this.myGroupTrabajadores.get('cp').value;
            agregar_trabajador.colonia = this.myGroupTrabajadores.get('colonia').value;
            agregar_trabajador.localidad = this.myGroupTrabajadores.get('localidad').value;
            agregar_trabajador.municipio = this.myGroupTrabajadores.get('municipio').value;
            agregar_trabajador.estado = this.myGroupTrabajadores.get('estado').value;
            agregar_trabajador.pais = this.myGroupTrabajadores.get('pais').value;
            agregar_trabajador.referencia = this.myGroupTrabajadores.get('referencia').value;
            agregar_trabajador.correosExtras = this.myGroupTrabajadores.get('correosExtras').value;
            agregar_trabajador.registroPatronal = this.myGroupTrabajadores.get('registroPatronal').value;
            agregar_trabajador.numeroEmpleado = this.myGroupTrabajadores.get('numeroEmpleado').value;
            agregar_trabajador.curp = this.myGroupTrabajadores.get('curp').value;
            agregar_trabajador.nss = this.myGroupTrabajadores.get('nss').value;
            agregar_trabajador.area = this.myGroupTrabajadores.get('departamento').value;
            agregar_trabajador.claveInterbancaria = this.myGroupTrabajadores.get('claveInterbancaria').value;
            agregar_trabajador.fechaInicioLaboral = fechaInicioLaboral.getTime();
            agregar_trabajador.puesto = this.myGroupTrabajadores.get('puesto').value;
            agregar_trabajador.horasDia = Number(this.myGroupTrabajadores.get('horasDia').value);
            agregar_trabajador.salarioBase = this.myGroupTrabajadores.get('salarioBase').value;
            agregar_trabajador.salarioDiario = this.myGroupTrabajadores.get('salarioDiario').value;
            agregar_trabajador.tipoTrabajador = this.myGroupTrabajadores.get('tipoTrabajador').value;

            jornada.id = Number(this.myGroupTrabajadores.get('jornada').value);
            agregar_trabajador.jornada = jornada;
            // perioricidad.id = Number(this.myGroupTrabajadores.get('periodicidad').value);
            // console.log(this.myGroupTrabajadores.get('periodicidad').value);

            perioricidad.id = Number(this.myGroupTrabajadores.get('periodicidad').value);
            agregar_trabajador.periodicidad = perioricidad;

            tipoContrato.id = Number(this.myGroupTrabajadores.get('tipoContrato').value);
            agregar_trabajador.tipoContrato = tipoContrato;

            banco.id = Number(this.myGroupTrabajadores.get('banco').value);

            agregar_trabajador.banco = banco;

            //tipoRegimen.id = 6;
            tipoRegimen.id = Number(this.myGroupTrabajadores.get('tipoRegimen').value);
            agregar_trabajador.tipoRegimen = tipoRegimen;
            // console.log(agregar_trabajador);     

            if (agregar_trabajador.salarioDiario  < agregar_trabajador.salarioBase){
                this.trabajadorService.create(agregar_trabajador).then((dato) => {
                    console.log("Entró el trabajador");
                    this.cambio('1');
                }).catch((error) => {
                    this.mensajeError = error.json().error;
                    console.log(error.json().error); //<-- Mensaje de error
    
                });
            } else {
                this.mensajeError = "El salario diario no puede ser mayor al salario base"
            }
        }
    }

    onTipoRegimenChanged(tipoRegimen: any) {
        if (tipoRegimen === '0')
            this.myGroupTrabajadores.get('salarioBase').enable();
        else
            this.myGroupTrabajadores.get('salarioBase').disable();
    }

    /*onIdRegimenesSelected(tipoRegimen: any) {
  
      if (tipoRegimen !== undefined && tipoRegimen != null && tipoRegimen > 0) {
        this.myGroupTrabajadores.get('tipoRegimen').setValue(tipoRegimen);
        //console.log("Obtengo el CP "+ tipoRegimen);
      } else {
        this.myGroupTrabajadores.get('tipoRegimen').setValue(6);
      }
    }*/

    onCodigoPostalSelected(lugarExpedicion: any) {
        this.colonias = [];
        console.log(lugarExpedicion);

        if (lugarExpedicion !== undefined && lugarExpedicion != null && lugarExpedicion > 0) {
            // console.log("Obtengo el CP "+ lugarExpedicion);
            this.cpService.consultarLocalizacion(lugarExpedicion).then((data) => {
                console.log(data);
                this.myGroupTrabajadores.get('municipio').setValue(data.data.municipio);
                // this.formTrabajador.get('municipio').setValue(data.data.municipio);
                this.myGroupTrabajadores.get('estado').setValue(data.data.estado);

                this.myGroupTrabajadores.get('cp').setValue(lugarExpedicion);

                for (let colonia of data.data.colonia) {
                    this.colonias.push(colonia);
                }
                //this.colonias.push(data.data.colonia);
            }).catch((error) => {
                console.log("Error");
            });

        } else {
            // this.formTrabajador.get('lugarExpedicion').setValue(0);
        }

    }

    onBancoSelected(banco: any) {
        if (banco !== undefined && banco != null && banco > 0) {
            this.myGroupTrabajadores.get('banco').setValue(banco);
            //console.log("Obtengo el banco "+ banco);
        } else {
            this.myGroupTrabajadores.get('banco').setValue(0);
        }
    }

    onTipoContratoSelected(tipoContrato: any) {
        if (tipoContrato !== undefined && tipoContrato != null && tipoContrato > 0) {
            this.myGroupTrabajadores.get('tipoContrato').setValue(tipoContrato);
            //console.log("Obtengo el tipoContrato "+ tipoContrato);
        } else {
            this.myGroupTrabajadores.get('tipoContrato').setValue(0);
        }
    }

    onTipoJornadaSelected(jornada: any) {
        if (jornada !== undefined && jornada != null && jornada > 0) {
            this.myGroupTrabajadores.get('jornada').setValue(jornada);
            //console.log("Obtengo el jornada "+ jornada);
        } else {
            this.myGroupTrabajadores.get('jornada').setValue(0);
        }
    }

    // onPeriodicidadSelected(periodicidad: any) {
    //   if (periodicidad !== undefined && periodicidad != null && periodicidad > 0) {
    //     this.myGroupTrabajadores.get('periodicidad').setValue(periodicidad);
    //     //console.log("Obtengo el periodicidad "+ periodicidad);
    //   } else {
    //     this.myGroupTrabajadores.get('periodicidad').setValue(0);
    //   }
    // }
    onIdSucursalSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.myGroupTrabajadores.get('sucursal').setValue(id);

        } else {
            this.myGroupTrabajadores.get('sucursal').setValue(0);
        }

    }

}
