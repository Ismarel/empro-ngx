import { PercepcionesComponent } from "../percepciones/percepciones.component";
import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { NgaModule } from 'app/theme/nga.module';
import { Observable } from 'rxjs/Observable';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { NominaPercepcion } from '../../entidades/nomina-percepcion';
import { TipoPercepcion } from '../../entidades/tipo-percepcion';
import { PercepcionService } from '../../servicios-backend/percepcion.service';
import { Empresa } from 'app/entidades/empresa';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { EmpresaService } from '../../servicios-backend/empresa.service';
// import { ConfiguracionNominaService } from "../../servicios-backend/configuracion-nomina.service";

@Component({
    selector: 'app-pernuevo',
    templateUrl: './percepcion-nuevo.component.html',
    styleUrls: ['./percepcion-nuevo.component.scss']
})
export class PercepcionNuevoComponent implements OnInit {
    form: any;
    FormControl: any;
    formcontrol: string;


    data: NominaPercepcion[];
    rowsOnPage: number = 10;
    sortBy: string = '';
    sortOrder: string = 'asc';
    page: number = 1;
    totalPercepciones: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    entidad_eliminar: NominaPercepcion;
    valor: number;

    idEmpresa: number;
    empresaas: Empresa = new Empresa();
    empresaService: EmpresaService;
    /**
  * Variables para filtrar por query
  */
    queryPercepciones: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;


    @ViewChild('autocompleteTipoPercepcion') autocompleteTipoPercepcion: AutocompleteGenericComponent;

    public myGroupPercepciones: FormGroup;
    public nombre: AbstractControl;
    public tipoPercepcion: AbstractControl;

    public submitted: boolean = false;
    public mensajeError: string;

    constructor(private percepcionesComponent: PercepcionesComponent,
        fb: FormBuilder,
        private percepcionService: PercepcionService, empresaService: EmpresaService
    ) {

        this.myGroupPercepciones = fb.group({
            'nombre': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(210)
            ]],
            'tipoPercepcion': ['',
                Validators.required
            ],
        });

        this.nombre = this.myGroupPercepciones.controls['nombre'];
        this.tipoPercepcion = this.myGroupPercepciones.controls['tipoPercepcion'];
        this.empresaService = empresaService;
    }

    ngOnInit() {
        // this.initFormQuery();
        // this.percepcionService.getPercepciones("","","",10,1)
        //   .subscribe((response) => {
        //     console.log(response);
        //     if(response.total!=undefined && response.total>0){
        //       this.sucursales=true;
        //     }else{
        //       this.sucursales=false;
        //     }

        //   });
    }

    registroK() {

    }

    // Remueve las validaciones para el campo recibido el formulario,formularioIngresoEgreso 
    removeValidators(campo: string, form: FormGroup) {
        form.controls[campo].clearValidators();
        form.controls[campo].updateValueAndValidity();
        //console.log('Quitando validator');
    }

    cambio(valor) {
        this.percepcionesComponent.change(valor);
    }

    initFormQuery() {
        // this.formularioFilterQuery = this.fb.group({
        //   'queryPercepciones': ['',
        //     [Validators.minLength(1)]
        //   ]
        // });
        // let query$: Observable<any> = this.formularioFilterQuery
        //   .valueChanges.debounceTime(this.delayBeforeSearch);
        // this.querySubscription$ = query$.subscribe(
        //   (data) => {
        //     this.queryPercepciones = data.queryChequera;
        //     this.agregarPercepcion();
        //   });
    }

    agregarPercepcion() {
        this.mensajeError = undefined;
        this.submitted = true;
        //funcion agregada para anexar el id de la empresa antes de crear la percepcion
        this.empresaService.getDetalle().then((data: any) => {
            this.empresaas = data;
            this.idEmpresa = this.empresaas.id;
            if (this.myGroupPercepciones.valid) {
                let agregar_percepcion: NominaPercepcion = new NominaPercepcion();
                let tipoPercepcion: TipoPercepcion = new TipoPercepcion();

                agregar_percepcion.empresa = new Empresa();
                agregar_percepcion.empresa.id = this.idEmpresa;//1;

                agregar_percepcion.nombre = this.myGroupPercepciones.get('nombre').value;

                tipoPercepcion.id = Number(this.myGroupPercepciones.get('tipoPercepcion').value);
                agregar_percepcion.percepcion = tipoPercepcion;

                this.percepcionService.create(agregar_percepcion).then((dato) => {
                    console.log("Entró el percepcion");
                    this.cambio('1');
                }).catch((error) => {
                    this.mensajeError = error.json().error;
                    console.log(error.json().error); //<-- Mensaje de error

                });
            }

        }).catch((error) => {
            console.log("-------error", error);
        });

    }

    onTipoPercepcionSelected(tipoPercepcion: any) {
        if (tipoPercepcion !== undefined && tipoPercepcion != null && tipoPercepcion > 0) {
            this.myGroupPercepciones.get('tipoPercepcion').setValue(tipoPercepcion);
            // this.onRecibePercepcion(tipoPercepcion);
        } else {
            this.myGroupPercepciones.get('tipoPercepcion').setValue(0);
        }
    }

    onRecibePercepcion(id: any) {
        if (id) {
            console.log("Cayó en el número 1... Incapacidad");
            document.getElementById('concepto').style.display = 'block';
            document.getElementById('monto').style.display = 'block';
            document.getElementById('numPercepcion').style.display = 'block';
            this.removeValidators('tipoIncidencia', this.myGroupPercepciones);
            this.removeValidators('tipoIncapacidad', this.myGroupPercepciones);
            this.removeValidators('fechaIncidenciaInicio', this.myGroupPercepciones);
            this.removeValidators('fechaIncidenciaFin', this.myGroupPercepciones);
            this.removeValidators('tipoPercepcion', this.myGroupPercepciones);
            this.removeValidators('tipoDeduccion', this.myGroupPercepciones);
            this.removeValidators('conceptoA', this.myGroupPercepciones);
            this.removeValidators('montoA', this.myGroupPercepciones);
            this.removeValidators('numDeduccion', this.myGroupPercepciones);
            document.getElementById('agregarPercepcionBtn').removeAttribute("disabled");
            document.getElementById("agregarPercepcionBtn").classList.remove("btn-opcion");
            document.getElementById("agregarPercepcionBtn").classList.add("btn-warning");
        }
        else {
            console.log("Cocha pacha");
        }
    }
}
