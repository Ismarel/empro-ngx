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
import { ChequesService } from '../../servicios-backend/cheques.service';
import { Cheques } from '../../entidades/cheques';
import { ClienteProveedor } from '../../entidades/cliente-proveedor';
import { Cuenta } from '../../entidades/cuenta';
import { Banco } from '../../entidades/banco';
import { Chequera } from '../../entidades/chequera';
import { ChequeraService } from '../../servicios-backend/chequera.service';

@Component({
    selector: 'app-cheques',
    templateUrl: './cheques.component.html',
    styleUrls: ['./cheques.component.scss']
})
export class ChequesComponent implements OnInit {
    form: any;
    FormControl: any;
    formcontrol: string;
    myGroupCheque: FormGroup;

    data: Cheques[];
    rowsOnPage: number = 10;
    sortBy: string = 'beneficiario';
    sortOrder: string = 'asc';
    page: number = 1;
    totalCheque: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;
    isEdit: boolean = false;

    entidad_elimar: Cheques;
    valor: number;

    cheques: Cheques = new Cheques();

    /**
    * Variables para filtrar por query
    */
    queryCheque: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    constructor(private gestionchequerasComponent: GestionchequerasComponent, private chequesService: ChequesService, private _fb: FormBuilder) { }

    ngOnInit() {
        this.myGroupCheque = new FormGroup({
            folio: new FormControl(),
            monto: new FormControl(),
            estatus: new FormControl(),
            chequera: new FormControl(),
            beneficiario: new FormControl(),
        });


        this.initFormQuery();
        this.buscarCheque();
    }

    cambio(valor) {
        this.gestionchequerasComponent.change(valor);
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryCheque': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryCheque = data.queryCheque;
                this.buscarCheque();
            });
    }

    buscarCheque() {
        this.chequesService.getCheques(this.queryCheque, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataCheque) => {
                this.totalCheque = dataCheque.total;
                this.data = dataCheque.data;
            }, (error) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarCheque();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarCheque();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarCheque();
    }

    buscar() {
        this.chequesService.getCheques(this.queryCheque, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.totalCheque = dataxyz.total;
                this.data = dataxyz.data;
            }, (error) => {
            }
        );
    }

    prepareEdit(entity_edit: any) {
        this.isEdit = true;

        this.onClick_edit(entity_edit);
        console.log(entity_edit);

    }

    onClick_edit(entity_edit: any) {
        this.myGroupCheque.reset();
        this.cheques = entity_edit;
        this.myGroupCheque.get('estatus').setValue(entity_edit.estatus);

        this.valor = entity_edit.id;
    }

    onSubmitGestionCheques() {
        let dataCheques: Cheques = new Cheques();
        dataCheques.chequera = new Chequera();
        dataCheques.beneficiario = new ClienteProveedor();
        dataCheques.id = this.cheques.id;
        dataCheques.chequera.id = this.cheques.chequera.id;
        dataCheques.folio = this.cheques.folio;
        dataCheques.estatus = this.myGroupCheque.get('estatus').value;
        dataCheques.monto = this.cheques.monto;
        dataCheques.fechaCreacion = this.cheques.fechaCreacion;
        dataCheques.fechaModificacion = this.cheques.fechaModificacion;
        dataCheques.beneficiario.id = this.cheques.beneficiario.id;


        console.log(this.cheques);
        this.chequesService.update(dataCheques).then((data => {
            this.buscar();
            $('#Cheque').modal('hide');
            // this.buscar();
        })).catch((error) => {
            console.log(error);

        });

    }

}
