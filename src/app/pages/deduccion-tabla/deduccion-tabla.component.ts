import { Component, OnInit } from '@angular/core';
import { DeduccionesComponent } from '../deducciones/deducciones.component';
import { NominaDeduccion } from '../../entidades/nomina-deduccion';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { DeduccionService } from '../../servicios-backend/deduccion.service';
import { NgaModule } from 'app/theme/nga.module';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { ViewChild, Input, Output, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Router, RouterModule } from '@angular/router';
import { TipoDeduccion } from '../../entidades/tipo-deduccion';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';

@Component({
    selector: 'app-dedtabla',
    templateUrl: './deduccion-tabla.component.html',
    styleUrls: ['./deduccion-tabla.component.scss']
})
export class DeduccionTablaComponent implements OnInit {

    form: any;
    FormControl: any;
    formControl: string;
    myGroupDeduccionAgregar: FormGroup;
    myGroupDeduccionEditar: FormGroup;

    data: NominaDeduccion[];
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalDeducciones: number = 0;

    filterIdDeduccion: number = 0;
    loadingFirstTime: boolean = false;

    entidad_eliminar: NominaDeduccion;
    valor: number;
    valor_id: number;
    /**
     * Variables para filtrar por query
     */
    queryDeducciones: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteTipoDeduccion') autocompleteTipoDeduccion: AutocompleteGenericComponent;

    public tipoDeduccion: AbstractControl;

    constructor(private deduccionesComponent: DeduccionesComponent, private _fb: FormBuilder, private deduccionService: DeduccionService) {
        this.myGroupDeduccionEditar = _fb.group({
            'nombre': ['', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(210)
            ]],
            'tipoDeduccion': ['',
                Validators.required
            ],
        });

        this.tipoDeduccion = this.myGroupDeduccionEditar.controls['tipoDeduccion'];
    }

    ngOnInit() {

        this.myGroupDeduccionAgregar = new FormGroup({
            nombre: new FormControl(),
            deduccion: new FormControl(),
            // id: number;
            // empresa: Empresa;
            // fechaCreacion: string;
        });

        this.initFormQuery();
        this.buscarDeduccion();
    }

    ngOnDestroy() {
        if (this.querySubscription$ && !this.querySubscription$.closed) {
            this.querySubscription$.unsubscribe();
        }
    }

    initFormQuery() {

        this.formularioFilterQuery = this._fb.group({
            'queryDeducciones': ['',
                [Validators.minLength(1)]
            ]
        });

        // console.log(this.formularioFilterQuery);

        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryDeducciones = data.queryDeducciones;
                console.log(data);

                console.log(this.queryDeducciones);
                this.buscarDeduccion();
            });

    }

    buscarDeduccion() {
        console.log(this.sortBy);

        this.deduccionService.getDeducciones(this.queryDeducciones, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataDeducciones) => {
                this.totalDeducciones = dataDeducciones.total;
                this.data = dataDeducciones.data;

                console.log(this.data);
                console.log(this.totalDeducciones);
            },
            (error) => {
            }
        )
    }

    // buscar() {
    //   this.deduccionService.getDeducciones(this.queryDeducciones, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
    //     (dataxyz) => {
    //       console.log("------------------BUCAR deducciones",dataxyz.total);
    //       this.totalDeducciones = dataxyz.total;
    //       this.data = dataxyz.data;
    //     }, (error) => {
    //     }
    //   );
    // }

    numero_id(valor) {
        this.valor_id = valor;

    }

    cambio(valor) {
        this.deduccionesComponent.change(valor);
        this.deduccionesComponent.valor_dos(this.valor_id);
    }

    onSort(event: { order: string, by: string }) {
        console.log(event);

        this.sortBy = event.by;
        console.log(this.sortBy);

        this.sortOrder = event.order;
        this.buscarDeduccion();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarDeduccion();
    }


    onChangeSize() {
        this.page = 1;
        this.buscarDeduccion();
    }

    onTipoDeduccionSelected(tipoDeduccion: any) {
        if (tipoDeduccion !== undefined && tipoDeduccion != null && tipoDeduccion > 0) {
            this.myGroupDeduccionEditar.get('tipoDeduccion').setValue(tipoDeduccion);
        } else {
            this.myGroupDeduccionEditar.get('tipoDeduccion').setValue(0);
        }
    }

    onClick_edit($event, item) {
        let e = $event.currentTarget || $event.srcElement;
        let tdNom = $(e).parent().siblings('td.nombre');
        let tdDes = $(e).parent().siblings('td.descripcion');

        $(e).hide().siblings('.dedElim').hide()
            .siblings('.dedSave, .dedCanc').show();

        tdNom.children('span').hide()
            .siblings('.nombreDed').show()
            .children('input').val(item.nombre);
        tdDes.children('span').hide()
            .siblings('.descDed').show()
            .find('input').val(item.deduccion.descripcion);
        this.myGroupDeduccionEditar.get('tipoDeduccion').setValue(item.deduccion.id);
        $('div.descDed input.completer-input').attr('style', 'margin-top: 0.25rem; padding: 0.25rem 0.5rem')
            .keydown(function() {
                $('div.completer-dropdown-holder').attr('style', 'line-height: 16px;');
            });
    }

    onClick_save($event, item) {
        let e = $event.currentTarget || $event.srcElement;
        let tdNom = $(e).parent().siblings('td.nombre');
        let tdDes = $(e).parent().siblings('td.descripcion');

        $(e).hide().siblings('.dedCanc').hide()
            .siblings('.dedEdit, .dedElim').show();

        tdNom.children('span').show();
        let nombre = tdNom.children('.nombreDed').hide()
            .children('input').val();
        tdDes.children('span').show();
        tdDes.children('.descDed').hide();
        let idPer = Number(this.myGroupDeduccionEditar.get('tipoDeduccion').value);

        let newPer = Object.assign({}, item);
        newPer.nombre = nombre;
        newPer.deduccion = new TipoDeduccion();
        newPer.deduccion.id = idPer;

        this.deduccionService.update(newPer).then((dato) => {
            if (dato['ok'] === 'ok') {
                this.buscarDeduccion();
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

        $(e).hide().siblings('.dedSave').hide()
            .siblings('.dedEdit, .dedElim').show();

        tdNom.children('span').show();
        tdNom.children('.nombreDed').hide()
            .children('input').val('');
        tdDes.children('span').show();
        tdDes.children('.descDed').hide()
            .children('input').val('');
    }

    onClick_elim(entity: any) {
        this.myGroupDeduccionAgregar.reset();
        this.entidad_eliminar = entity;
    }

    remove_deduccion(id: number) {
        this.deduccionService.remove(id).then((dato) => {
            this.buscarDeduccion();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.myGroupDeduccionAgregar.reset();
        $('#eliminar').modal('hide');
    }
}