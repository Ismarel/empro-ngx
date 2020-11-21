import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Cuenta } from '../../../../entidades/cuenta';
import { CuentaService } from '../../../../servicios-backend/cuenta.service';
import { Observable } from 'rxjs/Observable';
import { NgaModule } from "app/theme/nga.module";
import { CuentasModule } from '../cuentas.module';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Sucursal } from '../../../../entidades/sucursal';
import { Banco } from '../../../../entidades/banco';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { GlobalState } from '../../../../global.state';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SucursalService } from '../../../../servicios-backend/sucursal.servicio';

@Component({
    selector: 'app-gestioncuentas',
    templateUrl: './gestioncuentas.component.html',
    styleUrls: ['./gestioncuentas.component.scss']
})
export class GestioncuentasComponent implements OnInit {
    numCuentaModal: any;
    form: any;
    FormControl: any;
    formcontrol: string;
    myGroupCuenta: FormGroup;

    data: Cuenta[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalCuenta: number = 0;
    public isMenuCollapsed: boolean = false;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    public entidad_elimar: Cuenta;
    public valor: number;

    isEdit: boolean = false;

    model: NgbDateStruct;
    date: { year: number, month: number };

    bancoModal: string;
    cuentaModal: number;
    statusCuentaModal: number;
    itemChangeStatusModal: Cuenta;

    /**
   * Variables para filtrar por query
   */
    queryCuenta: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteBanco') autocompleteB: AutocompleteGenericComponent;
    @ViewChild('autocompleteSucursalService') autocompleteSucursalService: AutocompleteGenericComponent;
    sucursales: boolean = false;

    constructor(private cuentaService: CuentaService, private _fb: FormBuilder, private sucursalService: SucursalService, private _state: GlobalState) {
    }

    ngOnInit(): void {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.sucursalService.getSucursales("", "", "", 10, 1).subscribe((response) => {
            console.log(response);
            if (response.total != undefined && response.total > 0) {
                this.sucursales = true;
            } else {
                this.sucursales = false;
            }
        });
        this.myGroupCuenta = new FormGroup({
            banco: new FormControl(),
            nombre: new FormControl(),
            t_banco: new FormControl(),
            num_cuenta: new FormControl(),
            saldo: new FormControl(),
            fecha: new FormControl(),
            observaciones: new FormControl(),
            estatus: new FormControl(),
            sucursal: new FormControl(),
        });

        this.initFormQuery();
        this.buscarCuenta();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryCuenta': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryCuenta = data.queryCuenta;
                this.buscarCuenta();
            });
    }

    buscarCuenta() {
        this.cuentaService.getCuentas(this.queryCuenta, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataCuenta) => {
                this.totalCuenta = dataCuenta.total;
                this.data = dataCuenta.data;
            }, (errorCuenta) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarCuenta();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarCuenta();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarCuenta();
    }

    buscar() {
        this.cuentaService.getCuentas(this.queryCuenta, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.totalCuenta = dataxyz.total;
                this.data = dataxyz.data;
            }, (errorxyz) => {
            }
        );
    }

    changeDateToTimestamp(date: String): number {
        let changedDate: string[] = date.split("-");
        let datetimeStamp = new Date(Number(changedDate[0]), Number(changedDate[1]) - 1, Number(changedDate[2]), 0, 0, 0);

        return datetimeStamp.getTime();
    }

    onSubmitAgregar() {
        let agregar_cuenta: Cuenta = new Cuenta();
        let fechaAlta: number = this.changeDateToTimestamp(String(this.myGroupCuenta.get("fecha").value));
        // console.log(fechaAlta);

        agregar_cuenta.banco = new Banco();

        if (this.sucursales) {
            agregar_cuenta.sucursal = new Sucursal();
            agregar_cuenta.sucursal.id = Number(this.myGroupCuenta.get('sucursal').value);
        }

        agregar_cuenta.banco.id = Number(this.myGroupCuenta.get('banco').value);
        agregar_cuenta.nombre = this.myGroupCuenta.get('nombre').value;
        agregar_cuenta.tipoBanco = this.myGroupCuenta.get('t_banco').value;
        agregar_cuenta.numeroCuenta = this.myGroupCuenta.get('num_cuenta').value;
        agregar_cuenta.saldo = this.myGroupCuenta.get('saldo').value;

        agregar_cuenta.fechaAlta = fechaAlta;
        agregar_cuenta.observaciones = this.myGroupCuenta.get('observaciones').value;
        agregar_cuenta.estatus = this.myGroupCuenta.get('estatus').value;

        this.cuentaService.create(agregar_cuenta).then((dato) => {
            this.buscarCuenta();
        }).catch((error) => {
            alert("Error");
        });
        $('#Cuentas').modal('hide');

        this.myGroupCuenta.reset();
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

    onClick_edit(entity_edit: any) {

        let fecha: string = this.changeTimestampToDate(entity_edit.fechaAlta);

        console.log(fecha);


        this.myGroupCuenta.reset();
        this.autocompleteB.enabled = false;
        this.myGroupCuenta.get('banco').setValue(entity_edit.banco.id);
        this.myGroupCuenta.get('nombre').setValue(entity_edit.nombre);
        this.myGroupCuenta.get('t_banco').setValue(entity_edit.tipoBanco);
        this.myGroupCuenta.get('num_cuenta').setValue(entity_edit.numeroCuenta);
        this.myGroupCuenta.get('saldo').setValue(entity_edit.saldo);
        // this.myGroupCuenta.get('fecha').setValue(entity_edit.fecgaAlta);
        this.myGroupCuenta.get("fecha").setValue(fecha);
        this.myGroupCuenta.get('observaciones').setValue(entity_edit.observaciones);
        this.myGroupCuenta.get('estatus').setValue(entity_edit.estatus);
        this.myGroupCuenta.get('sucursal').setValue(entity_edit.sucursal.id);

        this.valor = entity_edit.id;
    }

    onSubmitEditar() {
        let editar_cuenta: Cuenta = new Cuenta();
        editar_cuenta.banco = new Banco();
        let fechaAlta = this.changeDateToTimestamp(String(this.myGroupCuenta.get('fecha').value));
        editar_cuenta.id = this.valor;
        editar_cuenta.banco.id = this.myGroupCuenta.get('banco').value;
        // console.log(this.myGroupCuenta.get('banco').value);
        if (this.sucursales) {
            editar_cuenta.sucursal = new Sucursal();
            editar_cuenta.sucursal.id = this.myGroupCuenta.get('sucursal').value;
        }

        editar_cuenta.nombre = this.myGroupCuenta.get('nombre').value;
        editar_cuenta.tipoBanco = this.myGroupCuenta.get('t_banco').value;
        editar_cuenta.numeroCuenta = this.myGroupCuenta.get('num_cuenta').value;
        editar_cuenta.saldo = this.myGroupCuenta.get('saldo').value;
        editar_cuenta.fechaAlta = fechaAlta;
        editar_cuenta.observaciones = this.myGroupCuenta.get('observaciones').value;
        editar_cuenta.estatus = this.myGroupCuenta.get('estatus').value;

        this.cuentaService.update(editar_cuenta).then((dato) => {
            this.buscarCuenta();
        }).catch((error) => {
            alert("Error");
        });
        this.myGroupCuenta.reset();
        $('#Cuentas').modal('hide');
    }

    onClick_elim(entity: any) {
        this.myGroupCuenta.reset();
        this.entidad_elimar = entity;
    }

    remove_cuenta(id: number) {
        this.cuentaService.remove(id).then((dato) => {
            this.buscarCuenta();
        }).catch((error) => {
            alert("Error");
        });

        this.myGroupCuenta.reset();
        $('#eliminar').modal('hide');
    }

    prepareAdd() {

        this.isEdit = false;
        this.myGroupCuenta.reset();
        this.autocompleteB.prepareAdd();
        this.autocompleteB.enabled = true;
        this.myGroupCuenta.get('banco').setValue(null);
        setTimeout(() => {
            this.autocompleteSucursalService.prepareAdd();
        }, 100);

        this.myGroupCuenta.get('estatus').setValue(null);
    }

    prepareEdit(entity_edit: Cuenta) {
        this.isEdit = true;

        if (entity_edit.banco.id && entity_edit.banco.id > 0) {
            this.autocompleteB.getDetalle(entity_edit.banco.id);
            this.myGroupCuenta.get('banco').setValue(entity_edit.banco.id);

        }
        if (entity_edit.sucursal.id && entity_edit.sucursal.id > 0) {
            this.autocompleteSucursalService.getDetalle(entity_edit.sucursal.id);
            this.myGroupCuenta.get('sucursal').setValue(entity_edit.sucursal.id);
        }
        // console.log(entity_edit);

        this.onClick_edit(entity_edit);

    }

    onBancoSelected(banco: any) {
        // console.log("Obtengo el banco " + banco);
        if (banco !== undefined && banco != null && banco > 0) {
            this.myGroupCuenta.get('banco').setValue(banco);
            // console.log("Obtengo el banco " + banco, this.myGroupCuenta.get("banco").value);
        } else {
            this.myGroupCuenta.get('banco').setValue(0);
            // console.log("Obtengo el banco " + banco, this.myGroupCuenta.get("banco").value);

        }
    }

    onIdSucursalSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.myGroupCuenta.get('sucursal').setValue(id);

        } else {
            this.myGroupCuenta.get('sucursal').setValue(0);
        }
    }

    onSubmitGestionCuenta() {
        if (this.isEdit) {
            this.onSubmitEditar();
        }
        else {
            this.onSubmitAgregar();
        }
    }
    exportarExcel() {
        this.cuentaService.getCSVInfo();
    }

    changeStatusCuenta(item: any) {
        console.log(item);
        this.itemChangeStatusModal = item;
        // console.log(this.itemChangeStatusModal);
        this.numCuentaModal = item.numeroCuenta;
        this.bancoModal = item.banco.nombre;
        this.statusCuentaModal = item.estatus;
        this.cuentaModal = item.nombre;
    }

    updateStatusCuenta() {
        // console.log(cuenta);
        let estatusCuenta: number = 0;
        if (this.itemChangeStatusModal.estatus == 0) {
            estatusCuenta = 1;
        } else {
            estatusCuenta = 0;
        }

        this.cuentaService.updateStatus(this.itemChangeStatusModal.id, estatusCuenta).then((dato) => {
            console.log(dato);
            this.buscarCuenta();
        }).catch((error) => {
            alert("Error al actualizar cuenta");
        });
        this.myGroupCuenta.reset();
        $('#exampleModal').modal('hide');
    }


}