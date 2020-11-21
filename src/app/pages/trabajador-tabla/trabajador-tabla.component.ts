import { Component, OnInit } from '@angular/core';
import { TrabajadoresComponent } from '../trabajadores/trabajadores.component';
import { Trabajador } from '../../entidades/trabajador';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { Router, RouterModule } from '@angular/router';
import { TrabajadorDetalleComponent } from 'app/pages/trabajador-detalle/trabajador-detalle.component';

@Component({
    selector: 'app-trtabla',
    templateUrl: './trabajador-tabla.component.html',
    styleUrls: ['./trabajador-tabla.component.scss']
})
export class TrabajadorTablaComponent implements OnInit {

    form: any;
    FormControl: any;
    formControl: string;
    myGroupTrabajadorAgregar: FormGroup;
    myGroupTrabajadorEditar: FormGroup;

    data: Trabajador[];
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalTrabajadores: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    entidad_elimar: Trabajador;
    valor: number;
    valor_id: number;
    /**
     * Variables para filtrar por query
     */
    queryTrabajadores: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    constructor(private trabajadoresComponent: TrabajadoresComponent, private _fb: FormBuilder, private trabajadorService: TrabajadorService) { }

    ngOnInit() {

        this.myGroupTrabajadorAgregar = new FormGroup({
            nombre: new FormControl(),
            correo: new FormControl(),
            rfc: new FormControl(),
            calle: new FormControl(),
            numeroInterior: new FormControl(),
            numeroExterior: new FormControl(),
            cp: new FormControl(),
            colonia: new FormControl(),
            localidad: new FormControl(),
            municipio: new FormControl(),
            estado: new FormControl(),
            pais: new FormControl(),
            referencia: new FormControl(),
            correosExtras: new FormControl(),
            registroPatronal: new FormControl(),
            numeroEmpleado: new FormControl(),
            curp: new FormControl(),
            tipoRegimen: new FormControl(),
            nss: new FormControl(),
            area: new FormControl(),
            claveInterbancaria: new FormControl(),
            banco: new FormControl(),
            fechaInicioLaboral: new FormControl(),
            puesto: new FormControl(),
            tipoContrato: new FormControl(),
            jornada: new FormControl(),
            periodicidad: new FormControl(),
            salarioBase: new FormControl(),
            salarioDiario: new FormControl(),
            sucursal: new FormControl(),
            tipoTrabajador: new FormControl(),
        });

        this.initFormQuery();
        this.buscarTrabajador();
    }

    ngOnDestroy() {
        if (this.querySubscription$ && !this.querySubscription$.closed) {
            this.querySubscription$.unsubscribe();
        }
    }

    initFormQuery() {

        this.formularioFilterQuery = this._fb.group({
            'queryTrabajadores': ['',
                [Validators.minLength(1)]
            ]
        });

        // console.log(this.formularioFilterQuery);

        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryTrabajadores = data.queryTrabajadores;
                console.log(data);

                console.log(this.queryTrabajadores);
                this.buscarTrabajador();
            });

    }

    buscarTrabajador() {
        console.log(this.sortBy);

        this.trabajadorService.getTrabajadores(this.queryTrabajadores, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataTrabajadores) => {
                console.log("*******BUCAR trabajadores", dataTrabajadores.total);
                this.totalTrabajadores = dataTrabajadores.total;
                this.data = dataTrabajadores.data;
                console.log(this.data);
                console.log(this.totalTrabajadores);


            },
            (error) => {
            }
        )
    }

    // buscar() {
    //   this.trabajadorService.getTrabajadores(this.queryTrabajadores, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
    //     (dataxyz) => {
    //       console.log("------------------BUCAR trabajadores",dataxyz.total);
    //       this.totalTrabajadores = dataxyz.total;
    //       this.data = dataxyz.data;
    //     }, (error) => {
    //     }
    //   );
    // }

    numero_id(valor) {
        this.valor_id = valor;

    }

    cambio(valor) {
        this.trabajadoresComponent.change(valor);
        this.trabajadoresComponent.valor_dos(this.valor_id);
    }

    onSort(event: { order: string, by: string }) {
        console.log(event);

        this.sortBy = event.by;
        console.log(this.sortBy);

        this.sortOrder = event.order;
        this.buscarTrabajador();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarTrabajador();
    }


    onChangeSize() {
        this.page = 1;
        this.buscarTrabajador();
    }
    onClick_elim(entity: any) {
        this.myGroupTrabajadorAgregar.reset();
        this.entidad_elimar = entity;
    }

    remove_trabajador(id: number) {
        this.trabajadorService.remove(id).then((dato) => {
            this.buscarTrabajador();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.myGroupTrabajadorAgregar.reset();
        $('#eliminar').modal('hide');
    }

    exportarExcel() {
        this.trabajadorService.getCSVInfoTrabajador();
    }

}