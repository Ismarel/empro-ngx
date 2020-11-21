import { DeduccionesComponent } from "../deducciones/deducciones.component";
import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { NgaModule } from 'app/theme/nga.module';
import { Observable } from 'rxjs/Observable';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { NominaDeduccion } from '../../entidades/nomina-deduccion';
import { TipoDeduccion } from '../../entidades/tipo-deduccion';
import { DeduccionService } from '../../servicios-backend/deduccion.service';
import { Empresa } from 'app/entidades/empresa';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
// import { ConfiguracionNominaService } from "../../servicios-backend/configuracion-nomina.service";

@Component({
    selector: 'app-dednuevo',
    templateUrl: './deduccion-nuevo.component.html',
    styleUrls: ['./deduccion-nuevo.component.scss']
})
export class DeduccionNuevoComponent implements OnInit {
    form: any;
    FormControl: any;
    formcontrol: string;


    data: NominaDeduccion[];
    rowsOnPage: number = 10;
    sortBy: string = '';
    sortOrder: string = 'asc';
    page: number = 1;
    totalDeducciones: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    entidad_eliminar: NominaDeduccion;
    valor: number;

    /**
  * Variables para filtrar por query
  */
    queryDeducciones: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;


    @ViewChild('autocompleteTipoDeduccion') autocompleteTipoDeduccion: AutocompleteGenericComponent;

    public myGroupDeducciones: FormGroup;
    public nombre: AbstractControl;
    public tipoDeduccion: AbstractControl;

    public submitted: boolean = false;
    public mensajeError: string;

    constructor(private deduccionesComponent: DeduccionesComponent,
        fb: FormBuilder,
        private deduccionService: DeduccionService
    ) {

        this.myGroupDeducciones = fb.group({
            'nombre': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(210)
            ]],
            'tipoDeduccion': ['',
                Validators.required
            ],
        });

        this.nombre = this.myGroupDeducciones.controls['nombre'];
        this.tipoDeduccion = this.myGroupDeducciones.controls['tipoDeduccion'];
    }

    ngOnInit() {
        // this.initFormQuery();
        // this.deduccionService.getDeducciones("","","",10,1)
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
        this.deduccionesComponent.change(valor);
    }

    initFormQuery() {
        // this.formularioFilterQuery = this.fb.group({
        //   'queryDeducciones': ['',
        //     [Validators.minLength(1)]
        //   ]
        // });
        // let query$: Observable<any> = this.formularioFilterQuery
        //   .valueChanges.debounceTime(this.delayBeforeSearch);
        // this.querySubscription$ = query$.subscribe(
        //   (data) => {
        //     this.queryDeducciones = data.queryChequera;
        //     this.agregarDeduccion();
        //   });
    }

    agregarDeduccion() {
        this.mensajeError = undefined;
        this.submitted = true;

        if (this.myGroupDeducciones.valid) {
            let agregar_deduccion: NominaDeduccion = new NominaDeduccion();
            let tipoDeduccion: TipoDeduccion = new TipoDeduccion();

            agregar_deduccion.empresa = new Empresa();
            agregar_deduccion.empresa.id = 1;

            agregar_deduccion.nombre = this.myGroupDeducciones.get('nombre').value;

            tipoDeduccion.id = Number(this.myGroupDeducciones.get('tipoDeduccion').value);
            agregar_deduccion.deduccion = tipoDeduccion;

            this.deduccionService.create(agregar_deduccion).then((dato) => {
                console.log("Entró el deduccion");
                this.cambio('1');
            }).catch((error) => {
                this.mensajeError = error.json().error;
                console.log(error.json().error); //<-- Mensaje de error

            });
        }
    }

    onTipoDeduccionSelected(tipoDeduccion: any) {
        if (tipoDeduccion !== undefined && tipoDeduccion != null && tipoDeduccion > 0) {
            this.myGroupDeducciones.get('tipoDeduccion').setValue(tipoDeduccion);
            // this.onRecibeDeduccion(tipoDeduccion);
        } else {
            this.myGroupDeducciones.get('tipoDeduccion').setValue(0);
        }
    }

    onRecibeDeduccion(id: any) {
        if (id) {
            console.log("Cayó en el número 1... Incapacidad");
            document.getElementById('concepto').style.display = 'block';
            document.getElementById('monto').style.display = 'block';
            document.getElementById('numDeduccion').style.display = 'block';
            this.removeValidators('tipoIncidencia', this.myGroupDeducciones);
            this.removeValidators('tipoIncapacidad', this.myGroupDeducciones);
            this.removeValidators('fechaIncidenciaInicio', this.myGroupDeducciones);
            this.removeValidators('fechaIncidenciaFin', this.myGroupDeducciones);
            this.removeValidators('tipoDeduccion', this.myGroupDeducciones);
            this.removeValidators('tipoDeduccion', this.myGroupDeducciones);
            this.removeValidators('conceptoA', this.myGroupDeducciones);
            this.removeValidators('montoA', this.myGroupDeducciones);
            this.removeValidators('numDeduccion', this.myGroupDeducciones);
            document.getElementById('agregarDeduccionBtn').removeAttribute("disabled");
            document.getElementById("agregarDeduccionBtn").classList.remove("btn-opcion");
            document.getElementById("agregarDeduccionBtn").classList.add("btn-warning");
        }
        else {
            console.log("Cocha pacha");
        }
    }
}
