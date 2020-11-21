import { Component, OnInit, ViewChild } from '@angular/core';
import { AutocompleteGenericComponent } from '../../comun/components/autocomplete-generic';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PeriodicidadPago } from '../../entidades/periodicidad-pago';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { NominaService } from '../../servicios-backend/nomina.service';
import { TrabajadorService } from '../../servicios-backend/trabajador.service';
import { Nomina } from '../../entidades/nomina';
import { GlobalState } from '../../global.state';
import { DeduccionService } from '../../servicios-backend/deduccion.service';
import { PercepcionService } from '../../servicios-backend/percepcion.service';
import { Trabajador } from '../../entidades/trabajador';
import { ConfiguracionNomina } from '../../entidades/configuracion-nomina';
import { ConfiguracionNominaService } from '../../servicios-backend/configuracion-nomina.service';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { Empresa } from '../../entidades/empresa';
import { isNumeric } from 'jquery';

@Component({
    selector: 'app-nomina-nueva',
    templateUrl: './nomina-nueva.component.html',
    styleUrls: ['./nomina-nueva.component.scss'],
})
export class NominaNuevaComponent implements OnInit {
    
    rowsOnPage: number = 10;
    sortBy: string = '';
    sortOrder: string = 'asc';
    page: number = 1;
    idPeriodicidad: number;

    formAddNomina: FormGroup;
    incaForm: FormGroup;
    conceptoForm: FormGroup;
    percepcionForm: FormGroup;
    deduccionForm: FormGroup;
    pagosForm: FormGroup;    
    deducciones = [];
    percepciones = [];

    public changeOption: number;
    public isMenuCollapsed: boolean = false;
    @ViewChild('autocompleteTrabajador') autocompleteTrabajador: AutocompleteGenericComponent;
    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;
    @ViewChild('autocompleteUnidadService') autocompleteUnidadService: AutocompleteGenericComponent;

    constructor(private _fb: FormBuilder, 
        private nominaService: NominaService, 
        private trabajadorService: TrabajadorService, 
        private deduccionService: DeduccionService, 
        private percepcionService: PercepcionService,
        private configuracionNominaService: ConfiguracionNominaService,
        private empresaService: EmpresaService,) {
        this.nominaService = nominaService;
    }

    ngOnInit() {
        this.changeOption = 1;
        this.initFormulario();
        /*this.incaForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        })
        this.conceptoForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        })
        this.percepcionForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        })
        this.deduccionForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        })
        this.pagosForm = this._fb.group({
            itemRows: this._fb.array([this.initItemRows()])
        })
        this.buscarDeduccion();
        this.buscarPercepcion();*/
    }

    change(valor) {
        this.changeOption = valor;
    }

    initFormulario(){
        this.formAddNomina = new FormGroup({
            trabajador: new FormControl(),
            fecha: new FormControl(),
            periodoMesQuincena: new FormControl(),
            periodoQuincenal: new FormControl(),
            periodoDiario: new FormControl(),
            periodoMensual: new FormControl(),
            /*/Datos extra
            codigopostal: new FormControl(),
            moneda: new FormControl(),
            fechaPago: new FormControl(),
            fechaInicialPago: new FormControl(),
            fechaFinalPago: new FormControl(),
            tipoNomina: new FormControl(),
            diasPagados: new FormControl(),
            claveEF: new FormControl(),
            //Deducciones
            unidad: new FormControl(),
            descuentos: new FormControl(),
            motivo: new FormControl(),
            subtotal: new FormControl(),
            montoISR: new FormControl(),
            total: new FormControl(),
            frecuenciaPago: new FormControl(),
            condicionPago: new FormControl(),
            metodoPago: new FormControl(),
            numCuenta: new FormControl(),
            observaciones: new FormControl(),*/
        });
    }

    /*buscarDeduccion() {
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

    addRow(tipo: number){
        if (tipo == 1){
            const control = <FormArray>this.conceptoForm.controls['itemRows'];
            control.push(this.initItemRows());
        }
        if (tipo == 2){
            const control = <FormArray>this.percepcionForm.controls['itemRows'];
            control.push(this.initItemRows());
        }
        if (tipo == 3){
            const control = <FormArray>this.deduccionForm.controls['itemRows'];
            control.push(this.initItemRows());
        }
        if (tipo == 4){
            const control = <FormArray>this.pagosForm.controls['itemRows'];
            control.push(this.initItemRows());
        }
        if (tipo == 5){
            const control = <FormArray>this.incaForm.controls['itemRows'];
            control.push(this.initItemRows());
        }
    }

    deleteRow(tipo: number, index: number){
        if (tipo == 1){
            const control = <FormArray>this.conceptoForm.controls['itemRows'];
            control.removeAt(index);
        }
        if (tipo == 2){
            const control = <FormArray>this.percepcionForm.controls['itemRows'];
            control.removeAt(index);
        }
        if (tipo == 3){
            const control = <FormArray>this.deduccionForm.controls['itemRows'];
            control.removeAt(index);
        }
        if (tipo == 4){
            const control = <FormArray>this.pagosForm.controls['itemRows'];
            control.removeAt(index);
        }
        if (tipo == 5){
            const control = <FormArray>this.incaForm.controls['itemRows'];
            control.removeAt(index);
        }
    }

    initItemRows(){
        return this._fb.group({
            //conceptos
            cantidad: [''],
            unidad: [''],
            precioUnitario: [''],
            importeConcepto: [''],
            descripcion: [''],
            //percepciones
            tipoPercepcion: [''],
            clavePercepcion: [''],
            conceptoPercepcion: [''],
            gravadoPercepcion: [''],
            exentoPercepcion: [''],
            //deducciones
            tipoDeduccion: [''],
            claveDeduccion: [''],
            conceptoDeduccion: [''],
            gravadoDeduccion: [''],
            exentoDeduccion: [''],
            //otros pagos
            tipoPago: [''],
            clavePago: [''],
            conceptoPago: [''],
            importePago: [''],
            //incapacidades
            tipoIncapacidad: [''],
            diasIncapacidad: [''],
            importeIncapacidad: [''],
        });
    }

    onIdUnidadSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.formAddNomina.get('unidad').setValue(id);
        } else {
            this.formAddNomina.get('unidad').setValue(0);
        }
    }

    onCodigoPostalSelected(lugarExpedicion: any) {
        if (lugarExpedicion !== undefined && lugarExpedicion != null && lugarExpedicion > 0) {
            this.formAddNomina.get('codigopostal').setValue(lugarExpedicion);
        } else {
            this.formAddNomina.get('codigopostal').setValue(0);
        }
    }*/

    checkPeriodo(){
        if (this.idPeriodicidad == 3){
            let mes = this.formAddNomina.get("periodoMesQuincena").value;
            let periodo = this.formAddNomina.get('periodoQuincenal').value;
            if (mes != null && periodo != null){
                $( "#btnGenerate" ).prop( "disabled", false);
            }
        } else {
            $( "#btnGenerate" ).prop( "disabled", false);
        }
    }

    onSelectedTrabajador(trabajador: any){
        if (trabajador !== undefined && trabajador != null && trabajador > 0) {
            this.formAddNomina.get('trabajador').setValue(trabajador);
            this.trabajadorService.getDetalle(trabajador).then((data) => {
                this.onPrepareGeneracion(data.periodicidad.id);
            });
        } else {
            this.formAddNomina.get('trabajador').setValue(0);
            $( "#btnGenerate" ).prop( "disabled", true);
        }
    }
    
    onPrepareGeneracion(id: Number) {
        this.idPeriodicidad = Number(id);
        if (id) {
            switch (id) {
                //Diario
                case 1: {
                    this.resetPeriodicidad();
                    document.getElementById('periodoDiario').style.display = 'block';
                    document.getElementById('periodoDiarioLabel').style.display = 'block';
                    break;
                }
                //Semanal
                case 2: {
                    this.resetPeriodicidad();
                    document.getElementById('primerDiaPeriodo').style.display = 'block';
                    document.getElementById('primerDiaPeriodoInput').style.display = 'block';
                    break;
                }
                //Quincenal
                case 3: {
                    this.resetPeriodicidad();
                    document.getElementById('quincenalPeriodo').style.display = 'block';
                    document.getElementById('monthsOfyear').style.display = 'block';
                    document.getElementById('periodoLabelTwo').style.display = 'block';
                    document.getElementById('periodoSelect').style.display = 'block';
                    break;
                }
                //Mensual
                case 4: {
                    this.resetPeriodicidad();
                    document.getElementById('quincenalPeriodo').style.display = 'block';
                    document.getElementById('monthsOfyear').style.display = 'block';
                    break;
                }
            }
        }
    }

    resetPeriodicidad() {
        document.getElementById('periodoLabelTwo').style.display = 'none';
        document.getElementById('periodoSelect').style.display = 'none';
        document.getElementById('primerDiaPeriodo').style.display = 'none';
        document.getElementById('primerDiaPeriodoInput').style.display = 'none';
        document.getElementById('quincenalPeriodo').style.display = 'none';
        document.getElementById('monthsOfyear').style.display = 'none';
        document.getElementById('periodoDiario').style.display = 'none';
        document.getElementById('periodoDiarioLabel').style.display = 'none';
        this.formAddNomina.get("periodoDiario").setValue(null)
        this.formAddNomina.get("fecha").setValue(null)
        this.formAddNomina.get("periodoQuincenal").setValue(null)
        this.formAddNomina.get("periodoMesQuincena").setValue(null)
    }
    
    /* Metodo para crear una configuracion de nomina para la empresa con la periodicidad indicada */
    crearConfiguracionNomina() {
        let configuracion = new ConfiguracionNomina();
        configuracion.periodicidad = new PeriodicidadPago;

        this.empresaService.getDetalle().then((response) => {
            configuracion.empresa = new Empresa();
            configuracion.empresa.id = Number(response.id);
        });

        configuracion.periodicidad.id = this.idPeriodicidad;

        console.log("QUE LLEVA..." , this.idPeriodicidad, configuracion.periodicidad.id)

        switch (this.idPeriodicidad) {
            //Diario
            case 1: {
                configuracion.periodo = new Date(this.formAddNomina.get("periodoDiario").value).getTime();
                console.log("confNomina ", configuracion);
                this.configuracionNominaService.create(configuracion).then((response) => {
                    console.log("configuracion creada", response);
                    this.newNomina(response.id);
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
            //Semanal
            case 2: {
                configuracion.periodo = new Date(this.formAddNomina.get("fecha").value).getTime();
                console.log("confNomina ", configuracion);
                this.configuracionNominaService.create(configuracion).then((response) => {
                    console.log("configuracion creada", response);
                    this.newNomina(response.id);
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
            //Quincenal
            case 3: {
                configuracion.mes = Number(this.formAddNomina.get("periodoMesQuincena").value);
                console.log("confNomina ", configuracion);
                if (Number(this.formAddNomina.get('periodoQuincenal').value) == 0) {
                    configuracion.periodo = 1;
                } else {
                    configuracion.periodo = 16
                }
                this.configuracionNominaService.create(configuracion).then((response) => {
                    console.log("configuracion creada", response);
                    this.newNomina(response.id);
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
            //Mensual
            case 4: {
                configuracion.periodo = 1;
                configuracion.mes = Number(this.formAddNomina.get("periodoMesQuincena").value);
                console.log("confNomina ", configuracion);
                this.configuracionNominaService.create(configuracion).then((response) => {
                    console.log("configuracion creada", response);
                    this.newNomina(response.id);
                }).catch((error) => {
                    console.log("error con la configuracion.", error);
                });
                break;
            }
        }
    }
    
    newNomina(idConfig: number){
        /*console.log("VALOR: ", this.formAddNomina.get('trabajador').value);
        console.log("VALOR: ", this.formAddNomina.get('codigopostal').value);
        console.log("VALOR: ", this.formAddNomina.get('moneda').value);
        console.log("VALOR: ", this.formAddNomina.get('fechaPago').value);
        console.log("VALOR: ", this.formAddNomina.get('fechaInicialPago').value);
        console.log("VALOR: ", this.formAddNomina.get('fechaFinalPago').value);
        console.log("VALOR: ", this.formAddNomina.get('tipoNomina').value);
        console.log("VALOR: ", this.formAddNomina.get('diasPagados').value);
        console.log("VALOR: ", this.formAddNomina.get('claveEF').value);
        console.log("VALOR: ", this.formAddNomina.get('descuentos').value);
        console.log("VALOR: ", this.formAddNomina.get('motivo').value);
        console.log("VALOR: ", this.formAddNomina.get('subtotal').value);
        console.log("VALOR: ", this.formAddNomina.get('montoISR').value);
        console.log("VALOR: ", this.formAddNomina.get('total').value);
        console.log("VALOR: ", this.formAddNomina.get('frecuenciaPago').value);
        console.log("VALOR: ", this.formAddNomina.get('condicionPago').value);
        console.log("VALOR: ", this.formAddNomina.get('metodoPago').value);
        console.log("VALOR: ", this.formAddNomina.get('observaciones').value);
        console.log("VALOR: ", this.formAddNomina.get('claveEF').value);*/

        let nomina = new Nomina;
        nomina.trabajador = new Trabajador;
        nomina.configuracion = new ConfiguracionNomina;

        nomina.trabajador.id = this.formAddNomina.get('trabajador').value;
        nomina.estatus = 0;
        nomina.configuracion.id = idConfig;
        console.log("NOMINA: ", nomina);

        this.nominaService.create(nomina).then((data) => {
            console.log("Nomina creada");
            this.change(2);
        }).catch((error) => {
            console.log("Error en crear la nomina", error);
        });
    }
}
