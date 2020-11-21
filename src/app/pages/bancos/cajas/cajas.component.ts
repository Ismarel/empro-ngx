import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Caja } from 'app/entidades/caja';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { CajaService } from 'app/servicios-backend/caja.service';
import { NgaModule } from 'app/theme/nga.module';
import { GlobalState } from '../../../global.state';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-cajas',
    templateUrl: './cajas.component.html',
    styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements OnInit {
    form: any;
    FormControl: any;
    formularioCaja: FormGroup;

    data: Caja[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalCaja: number = 0;
    public isMenuCollapsed: boolean = false;

    valor: number;

    entidad_elimar: Caja;

    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryCaja: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;
    itemChangeStatusModal: Caja;
    nombreModal: any;
    // numCuentaModal: any;
    statusModal: any;
    // cuentaModal: any;

    constructor(private cajaService: CajaService, private _fb: FormBuilder, private _state: GlobalState) { }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormularioCaja();
        this.initFormQuery();
        this.buscarCaja();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioCaja() {
        this.formularioCaja = new FormGroup({
            fechaAlta: new FormControl(),
            estatus: new FormControl(),
            saldo: new FormControl(),
            observaciones: new FormControl(),
            nombre: new FormControl(),


        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryCaja': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {

                this.queryCaja = data.queryCaja;
                this.buscarCaja();
            });
    }

    buscarCaja() {
        this.cajaService.getCajas(this.queryCaja, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataCaja) => {
                // console.log(dataCaja);

                this.totalCaja = dataCaja.total;
                this.data = dataCaja.data;


            }, (errorCaja) => {
            }
        )
    }
    onChangeSize() {
        this.page = 1;
        this.buscarCaja();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarCaja();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarCaja();
    }

    prepareAdd() {
        this.formularioCaja.reset();
        this.isEdit = false;
        this.formularioCaja.get('estatus').setValue(null);
    }

    onSubmitCajas() {
        if (this.isEdit) {

            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }

    onSubmitAgregar() {
        let agregar_caja: Caja = new Caja();
        let fechaAlta: number = this.changeDateToTimestamp(String(this.formularioCaja.get("fechaAlta").value));

        agregar_caja.nombre = this.formularioCaja.get('nombre').value;
        agregar_caja.fechaAlta = fechaAlta;
        agregar_caja.saldo = this.formularioCaja.get('saldo').value;
        agregar_caja.observaciones = this.formularioCaja.get('observaciones').value;
        agregar_caja.estatus = this.formularioCaja.get('estatus').value;



        this.cajaService.create(agregar_caja).then((dato) => {
            this.buscarCaja();
        }).catch((error) => {
            alert("Error");
        });
        $('#Cajas').modal('hide');
    }

    prepareEdit(item: any) {
        this.isEdit = true;
        this.onClick_edit(item);

    }

    onClick_edit(entity_edit: any) {
        this.formularioCaja.reset();
        let fechaAlta = this.changeTimestampToDate(entity_edit.fechaAlta);
        this.formularioCaja.get('nombre').setValue(entity_edit.nombre);
        this.formularioCaja.get('fechaAlta').setValue(fechaAlta);
        this.formularioCaja.get('saldo').setValue(entity_edit.saldo);
        this.formularioCaja.get('observaciones').setValue(entity_edit.observaciones);
        this.formularioCaja.get('estatus').setValue(entity_edit.estatus);
        this.valor = entity_edit.id;
    }

    onSubmitEditar() {
        let editar_caja: Caja = new Caja();
        let fechaAlta = this.changeDateToTimestamp(String(this.formularioCaja.get('fechaAlta').value));

        editar_caja.id = this.valor;
        editar_caja.nombre = this.formularioCaja.get('nombre').value;
        editar_caja.fechaAlta = fechaAlta;
        editar_caja.saldo = this.formularioCaja.get('saldo').value;
        editar_caja.observaciones = this.formularioCaja.get('observaciones').value;
        editar_caja.estatus = this.formularioCaja.get('estatus').value;



        this.cajaService.update(editar_caja).then((dato) => {
            this.buscarCaja();
        }).catch((error) => {
            alert("Error");
        });
        $('#Cajas').modal('hide');
    }

    onClick_elim(entity: any) {
        this.formularioCaja.reset();
        this.entidad_elimar = entity;
    }

    remove_caja(id: number) {
        console.log(id);

        this.cajaService.remove(id).then((dato) => {

            this.buscarCaja();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.formularioCaja.reset();
        $('#eliminar').modal('hide');
    }

    exportarExcel() {
        this.cajaService.getCSVInfo();
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

        this.cajaService.updateStatus(this.itemChangeStatusModal.id, estatus).then((dato) => {
            console.log(dato);
            this.buscarCaja();
        }).catch((error) => {
            alert("Error al actualizar cuenta");
        });
        this.formularioCaja.reset();
        $('#stattusCaja').modal('hide');
    }

}
