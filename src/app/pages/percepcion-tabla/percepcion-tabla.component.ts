import { Component, OnInit } from '@angular/core';
import { PercepcionesComponent } from '../percepciones/percepciones.component';
import { NominaPercepcion } from '../../entidades/nomina-percepcion';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { PercepcionService } from '../../servicios-backend/percepcion.service';
import { NgaModule } from 'app/theme/nga.module';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ViewChild, Input, Output, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Router, RouterModule } from '@angular/router';
import { TipoPercepcion } from '../../entidades/tipo-percepcion';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';

@Component({
    selector: 'app-pertabla',
    templateUrl: './percepcion-tabla.component.html',
    styleUrls: ['./percepcion-tabla.component.scss']
})
export class PercepcionTablaComponent implements OnInit {

    form: any;
    FormControl: any;
    formControl: string;
    myGroupPercepcionAgregar: FormGroup;
    myGroupPercepcionEditar: FormGroup;

    data: NominaPercepcion[];
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalPercepciones: number = 0;

    filterIdPercepcion: number = 0;
    loadingFirstTime: boolean = false;

    entidad_eliminar: NominaPercepcion;
    valor: number;
    valor_id: number;
    /**
     * Variables para filtrar por query
     */
    queryPercepciones: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteTipoPercepcion') autocompleteTipoPercepcion: AutocompleteGenericComponent;

    public tipoPercepcion: AbstractControl;

    constructor(private percepcionesComponent: PercepcionesComponent, private _fb: FormBuilder, private percepcionService: PercepcionService) {
        this.myGroupPercepcionEditar = _fb.group({
            'nombre': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(210)
            ]],
            'tipoPercepcion': ['',
                Validators.required
            ],
        });

        this.tipoPercepcion = this.myGroupPercepcionEditar.controls['tipoPercepcion'];
    }

    ngOnInit() {

        this.myGroupPercepcionAgregar = new FormGroup({
            nombre: new FormControl(),
            percepcion: new FormControl(),
            // id: number;
            // empresa: Empresa;
            // fechaCreacion: string;
        });

        this.initFormQuery();
        this.buscarPercepcion();
    }

    ngOnDestroy() {
        if (this.querySubscription$ && !this.querySubscription$.closed) {
            this.querySubscription$.unsubscribe();
        }
    }

    initFormQuery() {

        this.formularioFilterQuery = this._fb.group({
            'queryPercepciones': ['',
                [Validators.minLength(1)]
            ]
        });

        // console.log(this.formularioFilterQuery);

        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryPercepciones = data.queryPercepciones;
                console.log(data);

                console.log(this.queryPercepciones);
                this.buscarPercepcion();
            });

    }

    buscarPercepcion() {
        console.log(this.sortBy);

        this.percepcionService.getPercepciones(this.queryPercepciones, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataPercepciones) => {
                console.log("*******BUCAR percepciones", dataPercepciones.total);
                this.totalPercepciones = dataPercepciones.total;
                this.data = dataPercepciones.data;

                console.log(this.data);
                console.log(this.totalPercepciones);
            },
            (error) => {
            }
        )
    }

    // buscar() {
    //   this.percepcionService.getPercepciones(this.queryPercepciones, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
    //     (dataxyz) => {
    //       console.log("------------------BUCAR percepciones",dataxyz.total);
    //       this.totalPercepciones = dataxyz.total;
    //       this.data = dataxyz.data;
    //     }, (error) => {
    //     }
    //   );
    // }

    numero_id(valor) {
        this.valor_id = valor;

    }

    cambio(valor) {
        this.percepcionesComponent.change(valor);
        this.percepcionesComponent.valor_dos(this.valor_id);
    }

    onSort(event: { order: string, by: string }) {
        console.log(event);

        this.sortBy = event.by;
        console.log(this.sortBy);

        this.sortOrder = event.order;
        this.buscarPercepcion();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarPercepcion();
    }


    onChangeSize() {
        this.page = 1;
        this.buscarPercepcion();
    }

    onTipoPercepcionSelected(tipoPercepcion: any) {
        if (tipoPercepcion !== undefined && tipoPercepcion != null && tipoPercepcion > 0) {
            this.myGroupPercepcionEditar.get('tipoPercepcion').setValue(tipoPercepcion);
        } else {
            this.myGroupPercepcionEditar.get('tipoPercepcion').setValue(0);
        }
    }

    onClick_edit($event, item) {
        let e = $event.currentTarget || $event.srcElement;
        let tdNom = $(e).parent().siblings('td.nombre');
        let tdDes = $(e).parent().siblings('td.descripcion');

        $(e).hide().siblings('.perElim').hide()
            .siblings('.perSave, .perCanc').show();

        tdNom.children('span').hide()
            .siblings('.nombrePer').show()
            .children('input').val(item.nombre);
        tdDes.children('span').hide()
            .siblings('.descPer').show()
            .find('input').val(item.percepcion.descripcion);
        this.myGroupPercepcionEditar.get('tipoPercepcion').setValue(item.percepcion.id);
        $('div.descPer input.completer-input').attr('style', 'margin-top: 0.25rem; padding: 0.25rem 0.5rem')
            .keydown(function() {
                $('div.completer-dropdown-holder').attr('style', 'line-height: 16px;');
            });
    }

    onClick_save($event, item) {
        let e = $event.currentTarget || $event.srcElement;
        let tdNom = $(e).parent().siblings('td.nombre');
        let tdDes = $(e).parent().siblings('td.descripcion');

        $(e).hide().siblings('.perCanc').hide()
            .siblings('.perEdit, .perElim').show();

        tdNom.children('span').show();
        let nombre = tdNom.children('.nombrePer').hide()
            .children('input').val();
        tdDes.children('span').show();
        tdDes.children('.descPer').hide();
        let idPer = Number(this.myGroupPercepcionEditar.get('tipoPercepcion').value);

        let newPer = Object.assign({}, item);
        newPer.nombre = nombre;
        newPer.percepcion = new TipoPercepcion();
        newPer.percepcion.id = idPer;

        this.percepcionService.update(newPer).then((dato) => {
            if (dato['ok'] === 'ok') {
                this.buscarPercepcion();
            }
            else
                console.log(dato);
        }).catch((error) => {
            console.log(error.json().error); //<-- Mensaje de error
        });
    }

    onClick_canc($event) {
        let e = $event.currentTarget || $event.srcElement;
        let tdNom = $(e).parent().siblings('td.nombre');
        let tdDes = $(e).parent().siblings('td.descripcion');

        $(e).hide().siblings('.perSave').hide()
            .siblings('.perEdit, .perElim').show();

        tdNom.children('span').show();
        tdNom.children('.nombrePer').hide()
            .children('input').val('');
        tdDes.children('span').show();
        tdDes.children('.descPer').hide()
            .children('input').val('');
    }

    onClick_elim(entity: any) {
        this.myGroupPercepcionAgregar.reset();
        this.entidad_eliminar = entity;
    }

    remove_percepcion(id: number) {
        this.percepcionService.remove(id).then((dato) => {
            this.buscarPercepcion();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.myGroupPercepcionAgregar.reset();
        $('#eliminar').modal('hide');
    }
}