import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { NgaModule } from 'app/theme/nga.module';
import { Observable } from 'rxjs/Observable';
import { NgIf, NgFor, NgForOf, CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CuentasModule } from '../bancos/cuentas/cuentas.module';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { GestionchequerasComponent } from '../bancos/cuentas/gestionchequeras/gestionchequeras.component';
import { ChequeraService } from '../../servicios-backend/chequera.service';
import { Chequera } from '../../entidades/chequera';
import { Cuenta } from '../../entidades/cuenta';
import { Banco } from '../../entidades/banco';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';

@Component({
    selector: 'app-chequeras',
    templateUrl: './chequeras.component.html',
    styleUrls: ['./chequeras.component.scss']
})
export class ChequerasComponent implements OnInit {
    form: any;
    FormControl: any;
    formcontrol: string;
    myGroupChequera: FormGroup;

    data: Chequera[];
    rowsOnPage: number = 10;
    sortBy: string = 'cuenta.banco.nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalChequera: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    public entidad_elimar: Chequera;
    public valor: number;
    errorFolio: boolean = false;
    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryChequera: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteCuenta') autocompleteCuenta: AutocompleteGenericComponent;
    itemChangeStatusModal: Chequera;
    nombreModal: any;
    statusModal: any;

    constructor(private gestionchequerasComponent: GestionchequerasComponent, private chequeraService: ChequeraService, private _fb: FormBuilder) { }

    ngOnInit() {
        this.myGroupChequera = new FormGroup({
            num_cuenta: new FormControl(),
            folioInicial: new FormControl(),
            folioFinal: new FormControl(),
            estatus: new FormControl(),
        });

        this.initFormQuery();
        this.buscarChequera();
    }

    cambio(valor) {
        this.gestionchequerasComponent.change(valor);
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryChequera': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryChequera = data.queryChequera;
                this.buscarChequera();
            });
    }

    buscarChequera() {
        this.chequeraService.getChequeras(this.queryChequera, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataCuenta) => {
                this.totalChequera = dataCuenta.total;
                this.data = dataCuenta.data;
            }, (errorCuenta) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarChequera();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarChequera();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarChequera();
    }

    buscar() {
        this.chequeraService.getChequeras(this.queryChequera, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.totalChequera = dataxyz.total;
                this.data = dataxyz.data;
            }, (errorxyz) => {
            }
        );
    }


    onSubmitAgregar() {
        this.errorFolio = false;
        let agregar_chequera: Chequera = new Chequera();
        let folios: boolean = this.validarFolios();
        agregar_chequera.cuenta = new Cuenta();
        agregar_chequera.cuenta.banco = new Banco();
        if (folios) {
            agregar_chequera.folioInicial = this.myGroupChequera.get('folioInicial').value;
            agregar_chequera.folioFinal = this.myGroupChequera.get('folioFinal').value;
            agregar_chequera.cuenta.id = this.myGroupChequera.get('num_cuenta').value;
            agregar_chequera.estatus = this.myGroupChequera.get('estatus').value;

            this.chequeraService.create(agregar_chequera).then((dato) => {
                this.buscarChequera();
            }).catch((error) => {
                alert("Error");
            });
            $('#Chequera').modal('hide');
        } else {
            this.errorFolio = true;
        }
    }

    onClick_edit(entity_edit: any) {
        this.myGroupChequera.reset();
        this.autocompleteCuenta.enabled = false;
        this.myGroupChequera.get('num_cuenta').setValue(entity_edit.cuenta.id);
        this.myGroupChequera.get('folioInicial').setValue(entity_edit.folioInicial);
        this.myGroupChequera.get('folioFinal').setValue(entity_edit.folioFinal);
        this.myGroupChequera.get('estatus').setValue(entity_edit.estatus);

        this.valor = entity_edit.id;
    }

    onSubmitEditar() {
        let editar_chequera: Chequera = new Chequera();
        editar_chequera.cuenta = new Cuenta;
        editar_chequera.cuenta.banco = new Banco();

        editar_chequera.id = this.valor;

        editar_chequera.cuenta.id = this.myGroupChequera.get('num_cuenta').value;
        editar_chequera.folioInicial = this.myGroupChequera.get('folioInicial').value;
        editar_chequera.folioFinal = this.myGroupChequera.get('folioFinal').value;
        editar_chequera.estatus = this.myGroupChequera.get('estatus').value;

        this.chequeraService.update(editar_chequera).then((dato) => {
            this.buscarChequera();
        }).catch((error) => {
            alert("Error");
        });
        $('#Chequera').modal('hide');
    }

    onClick_elim(entity: any) {
        this.myGroupChequera.reset();
        this.entidad_elimar = entity;
    }

    remove_chequera(id: number) {
        this.chequeraService.remove(id).then((dato) => {
            this.buscarChequera();
        }).catch((error) => {
            alert("Error");
        });
        $('#eliminar').modal('hide');
    }


    prepareAdd() {

        this.autocompleteCuenta.prepareAdd();
        this.autocompleteCuenta.enabled = true;
        this.isEdit = false;
        this.myGroupChequera.get('num_cuenta').setValue(null);
        this.myGroupChequera.get('estatus').setValue(null);
        this.myGroupChequera.reset();
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
        this.chequeraService.getCSVInfo();
    }

    prepareEdit(entity_edit: any) {
        this.isEdit = true;

        this.onClick_edit(entity_edit);
        console.log(entity_edit.cuenta.id);

        if (entity_edit.cuenta.id && entity_edit.cuenta.id > 0) {
            this.autocompleteCuenta.getDetalle(entity_edit.cuenta.id);
            this.myGroupChequera.get('num_cuenta').setValue(entity_edit.cuenta.id);
        }

    }


    onCuentaSelected(cuenta: any) {
        if (cuenta !== undefined && cuenta != null && cuenta > 0) {
            this.myGroupChequera.get('num_cuenta').setValue(cuenta);
        } else {
            this.myGroupChequera.get('num_cuenta').setValue(0);
        }
    }
    validarFolios(): boolean {
        let isValid: boolean = false;
        let folioInferior: number = Number(this.myGroupChequera.get('folioInicial').value);
        let folioSuperior: number = Number(this.myGroupChequera.get('folioFinal').value);
        if (folioInferior < folioSuperior) {
            isValid = true;
        }
        // console.log(isValid, folioInferior, folioSuperior);
        return isValid;
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

        this.chequeraService.updateStatus(this.itemChangeStatusModal.id, estatus).then((dato) => {
            console.log(dato);
            this.buscarChequera();
        }).catch((error) => {
            alert("Error al actualizar cuenta");
        });
        this.myGroupChequera.reset();
        $('#stattusCaja').modal('hide');
    }

}

