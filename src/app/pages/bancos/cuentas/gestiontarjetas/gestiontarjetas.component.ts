import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, MaxLengthValidator } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { NgaModule } from 'app/theme/nga.module';
import { Observable } from 'rxjs/Observable';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CuentasModule } from '../cuentas.module';
import { GlobalState } from '../../../../global.state';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { TarjetaService } from '../../../../servicios-backend/tarjeta.service';
import { Tarjeta } from '../../../../entidades/tarjeta';
import { Cuenta } from '../../../../entidades/cuenta';
import { Banco } from '../../../../entidades/banco';
import { TipoTarjeta } from '../../../../entidades/tipo-tarjeta';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';

@Component({
    selector: 'app-gestiontarjetas',
    templateUrl: './gestiontarjetas.component.html',
    styleUrls: ['./gestiontarjetas.component.scss']
})
export class GestiontarjetasComponent implements OnInit {
    form: any;
    FormControl: any;
    myGroupTarjeta: FormGroup;
    public isMenuCollapsed: boolean = false;

    data: Tarjeta[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalTarjeta: number = 0;

    entidad_elimar: Tarjeta;
    valor: number;

    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryTarjeta: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;


    @ViewChild('autocompleteCuenta') autocompleteCuenta: AutocompleteGenericComponent;
    itemChangeStatusModal: Tarjeta;
    nombreModal: any;
    statusModal: any;

    constructor(private tarjetaService: TarjetaService, private _fb: FormBuilder, private _state: GlobalState) {
    }

    ngOnInit(): void {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormularioTarjetas();
        this.initFormQuery();
        this.buscarTarjeta();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }
    
    initFormularioTarjetas() {
        this.myGroupTarjeta = new FormGroup({
            nombre: new FormControl('', [Validators.minLength(4), Validators.maxLength(50)]),
            numeroTarjeta: new FormControl('', [Validators.maxLength(16), Validators.minLength(16)]),
            tipoTarjeta: new FormControl(),
            saldo: new FormControl(),
            estatus: new FormControl(),
            fechaAlta: new FormControl(),
            cuenta: new FormControl('', [Validators.minLength(20), Validators.maxLength(20)]),
            sucursal: new FormControl(),
        });
    }
    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryTarjeta': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryTarjeta = data.queryTarjeta;
                this.buscarTarjeta();
            });
    }

    buscarTarjeta() {
        this.tarjetaService.getTarjetas(this.queryTarjeta, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataCuenta) => {
                this.totalTarjeta = dataCuenta.total;
                this.data = dataCuenta.data;

            }, (errorCuenta) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarTarjeta();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarTarjeta();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarTarjeta();
    }

    prepareAdd() {

        this.isEdit = false;
        this.myGroupTarjeta.get('tipoTarjeta').setValue(null);
        this.myGroupTarjeta.get('estatus').setValue(null);
        this.autocompleteCuenta.enabled = true;
        this.autocompleteCuenta.prepareAdd();
        this.myGroupTarjeta.reset();
    }

    prepareEdit(entity_edit: any) {
        this.isEdit = true;

        this.onClick_edit(entity_edit);
        // console.log(entity_edit.cuenta.id);

        if (entity_edit.cuenta.id && entity_edit.cuenta.id > 0) {
            this.autocompleteCuenta.getDetalle(entity_edit.cuenta.id);
            this.myGroupTarjeta.get('cuenta').setValue(entity_edit.cuenta.id);
        }

    }

    onSubmitAgregar() {
        let agregar_Tarjeta: Tarjeta = new Tarjeta();
        let fecha: number[] = this.myGroupTarjeta.get("fechaAlta").value.split("-");;
        let fechaAlta: Date = new Date(fecha[0], fecha[1] - 1, fecha[2], 0, 0, 0);
        // console.log(fechaAlta);
        agregar_Tarjeta.cuenta = new Cuenta();
        agregar_Tarjeta.tipoTarjeta = new TipoTarjeta();

        agregar_Tarjeta.cuenta.id = this.myGroupTarjeta.get('cuenta').value;
        agregar_Tarjeta.nombre = this.myGroupTarjeta.get('nombre').value;
        agregar_Tarjeta.numeroTarjeta = this.myGroupTarjeta.get('numeroTarjeta').value;
        agregar_Tarjeta.tipoTarjeta.id = this.myGroupTarjeta.get('tipoTarjeta').value;
        agregar_Tarjeta.saldo = this.myGroupTarjeta.get('saldo').value;

        agregar_Tarjeta.fechaAlta = fechaAlta.getTime();
        agregar_Tarjeta.estatus = this.myGroupTarjeta.get('estatus').value;
        agregar_Tarjeta.sucursal = this.myGroupTarjeta.get('sucursal').value;

        // console.log( JSON.stringify(agregar_Tarjeta) );

        this.tarjetaService.create(agregar_Tarjeta).then((dato) => {
            this.buscarTarjeta();
        }).catch((error) => {
            alert("Error");
        });
        $('#Tarjeta').modal('hide');
    }

    onClick_edit(entity_edit: any) {
        // console.log("Datos de editar...",entity_edit);    
        let fechaAlta: string = this.changeTimestampToDate(entity_edit.fechaAlta);
        this.myGroupTarjeta.reset();

        this.myGroupTarjeta.get('cuenta').setValue(entity_edit.cuenta.id);
        this.autocompleteCuenta.enabled = false;
        this.myGroupTarjeta.get('nombre').setValue(entity_edit.nombre);
        this.myGroupTarjeta.get('numeroTarjeta').setValue(entity_edit.numeroTarjeta);
        this.myGroupTarjeta.get('tipoTarjeta').setValue(entity_edit.tipoTarjeta.id);
        this.myGroupTarjeta.get('saldo').setValue(entity_edit.saldo);
        this.myGroupTarjeta.get('fechaAlta').setValue(fechaAlta);
        this.myGroupTarjeta.get('estatus').setValue(entity_edit.estatus);
        this.myGroupTarjeta.get('sucursal').setValue(entity_edit.sucursal.id);

        this.valor = entity_edit.id;
    }

    onSubmitEditar() {
        let fecha: number = this.changeDateToTimestamp(this.myGroupTarjeta.get('fechaAlta').value);
        let editar_tarjeta: Tarjeta = new Tarjeta();
        editar_tarjeta.cuenta = new Cuenta();
        editar_tarjeta.tipoTarjeta = new TipoTarjeta();

        editar_tarjeta.id = this.valor;

        editar_tarjeta.cuenta.id = this.myGroupTarjeta.get('cuenta').value;
        editar_tarjeta.nombre = this.myGroupTarjeta.get('nombre').value;
        editar_tarjeta.numeroTarjeta = this.myGroupTarjeta.get('numeroTarjeta').value;
        editar_tarjeta.tipoTarjeta.id = this.myGroupTarjeta.get('tipoTarjeta').value;
        editar_tarjeta.saldo = this.myGroupTarjeta.get('saldo').value;
        editar_tarjeta.fechaAlta = fecha;
        editar_tarjeta.estatus = this.myGroupTarjeta.get('estatus').value;
        editar_tarjeta.sucursal = this.myGroupTarjeta.get('sucursal').value;


        this.tarjetaService.update(editar_tarjeta).then((dato) => {
            this.buscarTarjeta();
        }).catch((error) => {
            alert("Error");
        });
        $('#Tarjeta').modal('hide');
    }

    onClick_elim(entity: any) {
        this.myGroupTarjeta.reset();
        this.entidad_elimar = entity;
    }

    remove_tarjeta(id: number) {
        this.tarjetaService.remove(id).then((dato) => {
            this.buscarTarjeta();
        }).catch((error) => {
            alert("Error");
        });
        $('#eliminar').modal('hide');
    }


    onCuentaSelected(cuenta: any) {
        if (cuenta !== undefined && cuenta != null && cuenta > 0) {
            this.myGroupTarjeta.get('cuenta').setValue(cuenta);
        } else {
            this.myGroupTarjeta.get('cuenta').setValue(0);
        }
    }

    onSubmitGestionTarjeta() {
        if (this.isEdit) {
            this.onSubmitEditar();
        }
        else {
            this.onSubmitAgregar();
        }
    }

    exportarExcel() {
        this.tarjetaService.getCSVInfo();
    }

    changeDateToTimestamp(date: String): number {
        let changedDate: string[] = date.split("-");
        let datetimeStamp = new Date(Number(changedDate[0]), Number(changedDate[1]) - 1, Number(changedDate[2]), 0, 0, 0);

        return datetimeStamp.getTime();
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

    changeStatus(item: any) {
        console.log(item);
        this.itemChangeStatusModal = item;
        // console.log(this.itemChangeStatusModal);
        this.nombreModal = item.nombre;
        this.statusModal = item.estatus;
    }

    updateStatusCuenta() {
        // console.log(cuenta);
        let estatus: number = 0;
        if (this.itemChangeStatusModal.estatus == 0) {
            estatus = 1;
        } else {
            estatus = 0;
        }

        this.tarjetaService.updateStatus(this.itemChangeStatusModal.id, estatus).then((dato) => {
            console.log(dato);
            this.buscarTarjeta();
        }).catch((error) => {
            alert("Error al actualizar cuenta");
        });
        this.myGroupTarjeta.reset();
        $('#stattusCaja').modal('hide');
    }

}
