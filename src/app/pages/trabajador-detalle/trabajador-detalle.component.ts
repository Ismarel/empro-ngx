import { TrabajadoresComponent } from 'app/pages/trabajadores';
import { Component, OnInit } from '@angular/core';
import { Trabajador } from '../../entidades/trabajador';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { TrabajadorService } from '../../servicios-backend/trabajador.service';
import { NgaModule } from 'app/theme/nga.module';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ViewChild, Input, Output, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { TrabajadorTablaComponent } from '../trabajador-tabla/trabajador-tabla.component';
import { ActivatedRoute } from '@angular/router';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { CpService } from '../../servicios-backend/cp.service';
import { EmailValidator } from '../../theme/validators/email.validator';
import { TipoContrato } from '../../entidades/tipo-contrato';
import { TipoRegimen } from 'app/entidades/tipo-regimen';
import { TipoComprobante } from '../../entidades/tipo-comprobante';
import { Banco } from 'app/entidades/banco';
import { TipoJornada } from '../../entidades/tipo-jornada';
import { TipoPercepcion } from '../../entidades/tipo-percepcion';
import { PeriodicidadPago } from '../../entidades/periodicidad-pago';
import { TrabajadorIncidencia } from '../../entidades/trabajador-incidencia';
import { DeduccionService } from '../../servicios-backend/deduccion.service';
import { PercepcionService } from '../../servicios-backend/percepcion.service';

@Component({
    selector: 'app-trabajador-detalle',
    templateUrl: './trabajador-detalle.component.html',
    styleUrls: ['./trabajador-detalle.component.scss']
})
export class TrabajadorDetalleComponent implements OnInit {
    trabajador: Trabajador = new Trabajador;
    incidencias = [];
    deducciones = [];
    percepciones = [];
    percepcionesT = [];
    deduccionesT = [];
    jornadas = [];
    movimiento: any;
    myGroupDatosGeneralesEditar: FormGroup;
    myGroupDatosEmpleadoEditar: FormGroup;
    valor: number;

    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;
    @ViewChild('autocompleteTipoRegimen') autocompleteTipoR: AutocompleteGenericComponent;
    @ViewChild('autocompleteBanco') autocompleteB: AutocompleteGenericComponent;
    @ViewChild('autocompleteTipoContrato') autocompleteTipoC: AutocompleteGenericComponent;
    @ViewChild('autocompleteJornada') autocompleteJornada: AutocompleteGenericComponent;
    @ViewChild('autocompletePeriodicidad') autocompletePeriodicidad: AutocompleteGenericComponent;
    @ViewChild('autocompleteSucursalService') autocompleteSucursalService: AutocompleteGenericComponent;

    colonias = [];

    public submitted: boolean = false;
    public mensajeError: string;
    public deduccion: AbstractControl;
    public percepcion: AbstractControl;

    constructor(private trabajadorService: TrabajadorService, private trabajadoresComponent: TrabajadoresComponent, private route: ActivatedRoute, private cpService: CpService,
        private fb: FormBuilder, private deduccionService: DeduccionService, private percepcionService: PercepcionService) { }

    ngOnInit() {



        this.myGroupDatosGeneralesEditar = this.fb.group({
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
                Validators.maxLength(13)
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
            'cp': [
                '',
                Validators.required,
            ],
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
                Validators.required,
                Validators.minLength(4)
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
        });

        this.myGroupDatosEmpleadoEditar = this.fb.group({
            'registroPatronal': [
                '',
                Validators.maxLength(15)
            ],
            'numeroEmpleado': ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(11)
            ]],
            'curp': [
                '',
                [
                    Validators.required,
                    Validators.minLength(18),
                    Validators.maxLength(18)
                ]
            ],
            'tipoRegimen': [
                '',
                Validators.required
            ],
            'nss': ['', [
                Validators.required,
                Validators.minLength(11),
                Validators.maxLength(11)
            ]],
            'area': ['', [
                Validators.required
            ]],
            'claveInterbancaria': ['',
                Validators.maxLength(17)
            ],
            'banco': [
                ''
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
            'tipoContrato': ['',
                Validators.required
            ],
            'jornada': ['',
                Validators.required
            ],
            'periodicidad': ['',
                Validators.required
            ],
            'salarioBase': ['', [
                Validators.required,
                Validators.minLength(1)
            ]],
            'salarioDiario': ['', [
                Validators.required,
                Validators.minLength(1)
            ]],
            'sucursal': ['',
                Validators.required
            ],
            'tipoTrabajador': ['',
                Validators.required
            ],
        });
        this.getTrabajador();
        this.buscarPercepcion();
        this.buscarDeduccion();
    }
    cambio(valor) {
        this.trabajadoresComponent.change(valor);
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

        var rfcCorrecto = this.rfcValido(rfc);   //⬅Acá se comprueba
        if (rfcCorrecto) {
            resultado.classList.add("ok");
        } else {
            resultado.classList.remove("ok");
        }
    }
    buscarDeduccion() {
        this.deduccionService.getDeducciones('', '', 'asc', 10, 1).subscribe(
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
        this.percepcionService.getPercepciones('', '', 'asc', 10, 1).subscribe(
            (dataPercepciones) => {
                for (let percepcion of dataPercepciones.data){
                    this.percepciones.push(percepcion.nombre);
                }
            },
            (error) => {
            }
        )
    }

    getTrabajador() {
        let id = this.trabajadoresComponent.valorid;
        this.trabajadorService.getDetalle(id).then((data: any) => {
            this.trabajador = data;
            this.incidencias = [];
            this.percepcionesT = [];
            this.deduccionesT = [];

            data.trabajadorIncidenciaList.forEach((e, i) => {
                if (e.tipoIncidencia.id !== undefined) {
                    console.log(e.fechaInicio);
                    let d = new Date(e.fechaInicio);
                    console.log(d);
                    e.fechaInicio = d.getUTCDate() + '/'
                        + ('0' + (d.getUTCMonth() + 1)).substr(-2) + '/'
                        + d.getUTCFullYear();
                    console.log(e.fechaInicio);
                    this.incidencias.push(e);
                }
                else if (e.nominaPercepcion.id !== undefined){
                    this.percepcionesT.push(e);
                    if (e.nNominasPercepcion < 0){
                        $( "#curp" ).prop( "disabled", false);
                        $( "#rfc" ).prop( "disabled", false);
                    }
                }
                else if (e.nominaDeduccion.id !== undefined){
                    this.deduccionesT.push(e);
                }
            });
        }).catch((error) => {
            console.log(error);
        });
        
        this.trabajadorService.obtenerJornadas().subscribe((response) => {
            this.jornadas = response;
        });
    }

    onClick_editDG(entity_edit: any) {
        this.myGroupDatosGeneralesEditar.reset();

        this.myGroupDatosGeneralesEditar.get('nombre').setValue(entity_edit.nombre);
        this.myGroupDatosGeneralesEditar.get('correo').setValue(entity_edit.correo);
        this.myGroupDatosGeneralesEditar.get('rfc').setValue(entity_edit.rfc);
        this.myGroupDatosGeneralesEditar.get('calle').setValue(entity_edit.calle);
        this.myGroupDatosGeneralesEditar.get('numeroInterior').setValue(entity_edit.numeroInterior);
        this.myGroupDatosGeneralesEditar.get('numeroExterior').setValue(entity_edit.numeroExterior);
        this.myGroupDatosGeneralesEditar.get('cp').setValue(entity_edit.cp);
        this.myGroupDatosGeneralesEditar.get('colonia').setValue(entity_edit.colonia);
        this.myGroupDatosGeneralesEditar.get('localidad').setValue(entity_edit.localidad);
        this.myGroupDatosGeneralesEditar.get('municipio').setValue(entity_edit.municipio);
        this.myGroupDatosGeneralesEditar.get('estado').setValue(entity_edit.estado);
        this.myGroupDatosGeneralesEditar.get('pais').setValue(entity_edit.pais);
        this.myGroupDatosGeneralesEditar.get('referencia').setValue(entity_edit.referencia);
        this.myGroupDatosGeneralesEditar.get('correosExtras').setValue(entity_edit.correosExtras);

        this.myGroupDatosEmpleadoEditar.get('registroPatronal').setValue(entity_edit.registroPatronal);
        this.myGroupDatosEmpleadoEditar.get('numeroEmpleado').setValue(entity_edit.numeroEmpleado);
        this.myGroupDatosEmpleadoEditar.get('curp').setValue(entity_edit.curp);
        this.myGroupDatosEmpleadoEditar.get('tipoRegimen').setValue(entity_edit.tipoRegimen);
        this.myGroupDatosEmpleadoEditar.get('nss').setValue(entity_edit.nss);
        this.myGroupDatosEmpleadoEditar.get('area').setValue(entity_edit.area);
        this.myGroupDatosEmpleadoEditar.get('claveInterbancaria').setValue(entity_edit.claveInterbancaria);
        this.myGroupDatosEmpleadoEditar.get('banco').setValue(entity_edit.banco);
        this.myGroupDatosEmpleadoEditar.get('fechaInicioLaboral').setValue(entity_edit.fechaInicioLaboral);
        this.myGroupDatosEmpleadoEditar.get('puesto').setValue(entity_edit.puesto);
        this.myGroupDatosEmpleadoEditar.get('tipoContrato').setValue(entity_edit.tipoContrato);
        this.myGroupDatosEmpleadoEditar.get('jornada').setValue(entity_edit.jornada);
        this.myGroupDatosEmpleadoEditar.get('periodicidad').setValue(entity_edit.periodicidad);
        this.myGroupDatosEmpleadoEditar.get('salarioBase').setValue(entity_edit.salarioBase);
        this.myGroupDatosEmpleadoEditar.get('salarioDiario').setValue(entity_edit.salarioDiario);

        this.valor = entity_edit.id;
    }

    prepareEditDG(item: any) {
        this.myGroupDatosGeneralesEditar.reset();
        this.onClick_editDG(item);

        if (item.cp) {
            this.autocompleteCodigoP.getLugarExpedicion(item.cp);
            this.myGroupDatosGeneralesEditar.get('cp').setValue(item.cp);
        }

    }

    onSubmitEditarDG() {
        this.mensajeError = undefined;
        this.submitted = true;

        let editar_trabajadorDG: Trabajador = new Trabajador();

        editar_trabajadorDG.id = this.valor;
        editar_trabajadorDG.nombre = this.myGroupDatosGeneralesEditar.get('nombre').value;
        editar_trabajadorDG.correo = this.myGroupDatosGeneralesEditar.get('correo').value;
        editar_trabajadorDG.rfc = this.myGroupDatosGeneralesEditar.get('rfc').value;
        editar_trabajadorDG.calle = this.myGroupDatosGeneralesEditar.get('calle').value;
        editar_trabajadorDG.numeroExterior = this.myGroupDatosGeneralesEditar.get('numeroExterior').value;
        editar_trabajadorDG.numeroInterior = this.myGroupDatosGeneralesEditar.get('numeroInterior').value;
        editar_trabajadorDG.cp = this.myGroupDatosGeneralesEditar.get('cp').value;
        editar_trabajadorDG.colonia = this.myGroupDatosGeneralesEditar.get('colonia').value;
        editar_trabajadorDG.localidad = this.myGroupDatosGeneralesEditar.get('localidad').value;
        editar_trabajadorDG.municipio = this.myGroupDatosGeneralesEditar.get('municipio').value;
        editar_trabajadorDG.estado = this.myGroupDatosGeneralesEditar.get('estado').value;
        editar_trabajadorDG.pais = this.myGroupDatosGeneralesEditar.get('pais').value;
        editar_trabajadorDG.referencia = this.myGroupDatosGeneralesEditar.get('referencia').value;
        editar_trabajadorDG.correosExtras = this.myGroupDatosGeneralesEditar.get('correosExtras').value;

        editar_trabajadorDG.registroPatronal = this.myGroupDatosEmpleadoEditar.get('registroPatronal').value;
        editar_trabajadorDG.numeroEmpleado = this.myGroupDatosEmpleadoEditar.get('numeroEmpleado').value;
        editar_trabajadorDG.curp = this.myGroupDatosEmpleadoEditar.get('curp').value;
        editar_trabajadorDG.tipoRegimen = this.myGroupDatosEmpleadoEditar.get('tipoRegimen').value;
        editar_trabajadorDG.nss = this.myGroupDatosEmpleadoEditar.get('nss').value;
        editar_trabajadorDG.area = this.myGroupDatosEmpleadoEditar.get('area').value;
        editar_trabajadorDG.claveInterbancaria = this.myGroupDatosEmpleadoEditar.get('claveInterbancaria').value;
        editar_trabajadorDG.banco = this.myGroupDatosEmpleadoEditar.get('banco').value;
        editar_trabajadorDG.fechaInicioLaboral = this.myGroupDatosEmpleadoEditar.get('fechaInicioLaboral').value;
        editar_trabajadorDG.puesto = this.myGroupDatosEmpleadoEditar.get('puesto').value;
        editar_trabajadorDG.tipoContrato = this.myGroupDatosEmpleadoEditar.get('tipoContrato').value;
        editar_trabajadorDG.jornada = this.myGroupDatosEmpleadoEditar.get('jornada').value;
        editar_trabajadorDG.periodicidad = this.myGroupDatosEmpleadoEditar.get('periodicidad').value;
        editar_trabajadorDG.salarioBase = this.myGroupDatosEmpleadoEditar.get('salarioBase').value;
        editar_trabajadorDG.salarioDiario = this.myGroupDatosEmpleadoEditar.get('salarioDiario').value;

        this.trabajadorService.update(editar_trabajadorDG).then((dato) => {
            // this.buscarSucursales();
            this.getTrabajador();
        }).catch((error) => {
            this.mensajeError = error.json().error;
            console.log(error.json().error); //<-- Mensaje de error
        });
        $('#editarDatosGenerales').modal('hide');
    }

    onClick_editDE(entity_edit: any) {
        let fechaInicioRelacion = this.changeTimestampToDate(entity_edit.fechaInicioLaboral);
        console.log(entity_edit.fechaInicioLaboral);

        console.log(fechaInicioRelacion);

        this.myGroupDatosEmpleadoEditar.reset();

        this.myGroupDatosGeneralesEditar.get('nombre').setValue(entity_edit.nombre);
        this.myGroupDatosGeneralesEditar.get('correo').setValue(entity_edit.correo);
        this.myGroupDatosGeneralesEditar.get('rfc').setValue(entity_edit.rfc);
        this.myGroupDatosGeneralesEditar.get('calle').setValue(entity_edit.calle);
        this.myGroupDatosGeneralesEditar.get('numeroInterior').setValue(entity_edit.numeroInterior);
        this.myGroupDatosGeneralesEditar.get('numeroExterior').setValue(entity_edit.numeroExterior);
        this.myGroupDatosGeneralesEditar.get('cp').setValue(entity_edit.cp);
        this.myGroupDatosGeneralesEditar.get('colonia').setValue(entity_edit.colonia);
        this.myGroupDatosGeneralesEditar.get('localidad').setValue(entity_edit.localidad);
        this.myGroupDatosGeneralesEditar.get('municipio').setValue(entity_edit.municipio);
        this.myGroupDatosGeneralesEditar.get('estado').setValue(entity_edit.estado);
        this.myGroupDatosGeneralesEditar.get('pais').setValue(entity_edit.pais);
        this.myGroupDatosGeneralesEditar.get('referencia').setValue(entity_edit.referencia);
        this.myGroupDatosGeneralesEditar.get('correosExtras').setValue(entity_edit.correosExtras);

        this.myGroupDatosEmpleadoEditar.get('registroPatronal').setValue(entity_edit.registroPatronal);
        this.myGroupDatosEmpleadoEditar.get('numeroEmpleado').setValue(entity_edit.numeroEmpleado);
        this.myGroupDatosEmpleadoEditar.get('curp').setValue(entity_edit.curp);
        this.myGroupDatosEmpleadoEditar.get('tipoRegimen').setValue(entity_edit.tipoRegimen.id);
        this.myGroupDatosEmpleadoEditar.get('nss').setValue(entity_edit.nss);
        this.myGroupDatosEmpleadoEditar.get('area').setValue(entity_edit.area);
        this.myGroupDatosEmpleadoEditar.get('claveInterbancaria').setValue(entity_edit.claveInterbancaria);
        this.myGroupDatosEmpleadoEditar.get('banco').setValue(entity_edit.banco.id);
        this.myGroupDatosEmpleadoEditar.get('fechaInicioLaboral').setValue(fechaInicioRelacion);
        this.myGroupDatosEmpleadoEditar.get('puesto').setValue(entity_edit.puesto);
        this.myGroupDatosEmpleadoEditar.get('tipoContrato').setValue(entity_edit.tipoContrato.id);
        this.myGroupDatosEmpleadoEditar.get('jornada').setValue(entity_edit.jornada.id);
        this.myGroupDatosEmpleadoEditar.get('periodicidad').setValue(entity_edit.periodicidad.id);
        this.myGroupDatosEmpleadoEditar.get('salarioBase').setValue(entity_edit.salarioBase);
        this.myGroupDatosEmpleadoEditar.get('salarioDiario').setValue(entity_edit.salarioDiario);

        this.valor = entity_edit.id;
    }

    prepareEditDE(item: any) {
        this.myGroupDatosEmpleadoEditar.reset();
        if (item) {
            this.autocompleteTipoC.getTipoContrato(item.tipoContrato.descripcion);
            this.myGroupDatosEmpleadoEditar.get('tipoContrato').setValue(item.tipoContrato.descripcion);
            this.autocompleteB.getBanco(item.banco.nombre);
            this.myGroupDatosEmpleadoEditar.get('banco').setValue(item.banco.nombre);
            //this.autocompleteJornada.getTipoJornada(item.jornada.id);
            this.myGroupDatosEmpleadoEditar.get('jornada').setValue(item.jornada.id);
            // this.autocompletePeriodicidad.getPeriodicidad(item.periodicidad.descripcion);
            this.myGroupDatosEmpleadoEditar.get('periodicidad').setValue(item.periodicidad.id);
            this.autocompleteTipoR.getTipoRegimen(item.tipoRegimen.nombre);
            this.myGroupDatosEmpleadoEditar.get('tipoRegimen').setValue(item.tipoRegimen.nombre);
        }
        this.onClick_editDE(item);

    }

    onSubmitEditarDE() {

        let fechaInicioLaboral: number = this.changeDateToTimestamp(String(this.myGroupDatosEmpleadoEditar.get('fechaInicioLaboral').value));

        console.log(this.myGroupDatosEmpleadoEditar.get('fechaInicioLaboral').value);
        console.log(fechaInicioLaboral);


        this.mensajeError = undefined;
        // this.submitted = true;

        let editar_trabajadorDE: Trabajador = new Trabajador();

        editar_trabajadorDE.banco = new Banco();
        editar_trabajadorDE.tipoContrato = new TipoContrato();
        editar_trabajadorDE.jornada = new TipoJornada();
        editar_trabajadorDE.periodicidad = new PeriodicidadPago();
        editar_trabajadorDE.tipoRegimen = new TipoRegimen();

        editar_trabajadorDE.id = this.valor;
        editar_trabajadorDE.nombre = this.myGroupDatosGeneralesEditar.get('nombre').value;
        editar_trabajadorDE.correo = this.myGroupDatosGeneralesEditar.get('correo').value;
        editar_trabajadorDE.rfc = this.myGroupDatosGeneralesEditar.get('rfc').value;
        editar_trabajadorDE.calle = this.myGroupDatosGeneralesEditar.get('calle').value;
        editar_trabajadorDE.numeroExterior = this.myGroupDatosGeneralesEditar.get('numeroInterior').value;
        editar_trabajadorDE.numeroInterior = this.myGroupDatosGeneralesEditar.get('numeroExterior').value;
        editar_trabajadorDE.cp = this.myGroupDatosGeneralesEditar.get('cp').value;
        editar_trabajadorDE.colonia = this.myGroupDatosGeneralesEditar.get('colonia').value;
        editar_trabajadorDE.localidad = this.myGroupDatosGeneralesEditar.get('localidad').value;
        editar_trabajadorDE.municipio = this.myGroupDatosGeneralesEditar.get('municipio').value;
        editar_trabajadorDE.estado = this.myGroupDatosGeneralesEditar.get('estado').value;
        editar_trabajadorDE.pais = this.myGroupDatosGeneralesEditar.get('pais').value;
        editar_trabajadorDE.referencia = this.myGroupDatosGeneralesEditar.get('referencia').value;
        editar_trabajadorDE.correosExtras = this.myGroupDatosGeneralesEditar.get('correosExtras').value;

        editar_trabajadorDE.registroPatronal = this.myGroupDatosEmpleadoEditar.get('registroPatronal').value;
        editar_trabajadorDE.numeroEmpleado = this.myGroupDatosEmpleadoEditar.get('numeroEmpleado').value;
        editar_trabajadorDE.curp = this.myGroupDatosEmpleadoEditar.get('curp').value;
        editar_trabajadorDE.tipoRegimen.id = Number(this.myGroupDatosEmpleadoEditar.get('tipoRegimen').value);
        editar_trabajadorDE.nss = this.myGroupDatosEmpleadoEditar.get('nss').value;
        editar_trabajadorDE.area = this.myGroupDatosEmpleadoEditar.get('area').value;
        editar_trabajadorDE.claveInterbancaria = this.myGroupDatosEmpleadoEditar.get('claveInterbancaria').value;
        editar_trabajadorDE.banco.id = Number(this.myGroupDatosEmpleadoEditar.get('banco').value);
        editar_trabajadorDE.fechaInicioLaboral = fechaInicioLaboral;
        editar_trabajadorDE.puesto = this.myGroupDatosEmpleadoEditar.get('puesto').value;
        editar_trabajadorDE.tipoContrato.id = Number(this.myGroupDatosEmpleadoEditar.get('tipoContrato').value);
        editar_trabajadorDE.jornada.id = Number(this.myGroupDatosEmpleadoEditar.get('jornada').value);
        editar_trabajadorDE.periodicidad.id = Number(this.myGroupDatosEmpleadoEditar.get('periodicidad').value);
        editar_trabajadorDE.salarioBase = this.myGroupDatosEmpleadoEditar.get('salarioBase').value;
        editar_trabajadorDE.salarioDiario = this.myGroupDatosEmpleadoEditar.get('salarioDiario').value;
        if (editar_trabajadorDE.salarioDiario  < editar_trabajadorDE.salarioBase) {
            this.trabajadorService.update(editar_trabajadorDE).then((dato) => {
                // this.buscarSucursales();
                this.getTrabajador();
            }).catch((error) => {
                this.mensajeError = error.json().error;
                console.log(error.json().error); //<-- Mensaje de error
            });
            $('#editarDatosEmpleado').modal('hide');
        } else {
            this.mensajeError = "El salario diario no puede ser mayor al salario base"
        }
    }

    onCodigoPostalSelected(lugarExpedicion: any) {
        this.colonias = [];

        if (lugarExpedicion !== undefined && lugarExpedicion != null && lugarExpedicion > 0) {
            this.cpService.consultarLocalizacion(lugarExpedicion).then((data) => {
                console.log(data);
                this.myGroupDatosGeneralesEditar.get('municipio').setValue(data.data.municipio);
                // this.formTrabajador.get('municipio').setValue(data.data.municipio);
                this.myGroupDatosGeneralesEditar.get('estado').setValue(data.data.estado);

                this.myGroupDatosGeneralesEditar.get('cp').setValue(lugarExpedicion);

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

    onIdRegimenesSelected(tipoRegimen: any) {
        if (tipoRegimen !== undefined && tipoRegimen != null && tipoRegimen > 0) {
            this.myGroupDatosEmpleadoEditar.get('tipoRegimen').setValue(tipoRegimen);
        } else {
            this.myGroupDatosEmpleadoEditar.get('tipoRegimen').setValue(0);
        }
    }
    onBancoSelected(banco: any) {
        if (banco !== undefined && banco != null && banco > 0) {
            this.myGroupDatosEmpleadoEditar.get('banco').setValue(banco);
        } else {
            this.myGroupDatosEmpleadoEditar.get('banco').setValue(0);
        }
    }

    onTipoContratoSelected(tipoContrato: any) {
        if (tipoContrato !== undefined && tipoContrato != null && tipoContrato > 0) {
            this.myGroupDatosEmpleadoEditar.get('tipoContrato').setValue(tipoContrato);
        } else {
            this.myGroupDatosEmpleadoEditar.get('tipoContrato').setValue(0);
        }
    }

    /*onTipoJornadaSelected(jornada: any) {
        if (jornada !== undefined && jornada != null && jornada > 0) {
            this.myGroupDatosEmpleadoEditar.get('jornada').setValue(jornada);
        } else {
            this.myGroupDatosEmpleadoEditar.get('jornada').setValue(0);
        }
    }

    onPeriodicidadSelected(periodicidad: any) {
       if (periodicidad !== undefined && periodicidad != null && periodicidad > 0) {
         this.myGroupDatosEmpleadoEditar.get('periodicidad').setValue(periodicidad);
       } else {
         this.myGroupDatosEmpleadoEditar.get('periodicidad').setValue(0);
       }
    }*/

    onIdSucursalSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.myGroupDatosEmpleadoEditar.get('sucursal').setValue(id);
        } else {
            this.myGroupDatosEmpleadoEditar.get('sucursal').setValue(0);
        }
    }

    changeTimestampToDate(timestamp: number): string {
        let dateFormat: string;
        let dateFormatTimestamp: Date = new Date(timestamp);
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
    updateDeduccion(){
        console.log("AGREGAR DEDUCCIÓN")
    }
    updatePercepcion(){
        console.log("AGREGAR PERCEPCIÓN")
    }

}