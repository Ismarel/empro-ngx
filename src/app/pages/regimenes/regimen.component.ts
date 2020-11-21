import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ConceptoService } from '../../servicios-backend/concepto.service';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { RegimenFiscal } from 'app/entidades/regimen-fiscal';

import { RegimenFiscalService } from 'app/servicios-backend/regimen-fiscal.service';
import { TipoRegimen } from 'app/entidades/tipo-regimen';
import { Empresa } from "app/entidades/empresa";
import { AutocompleteGenericComponent } from "app/comun/components/autocomplete-generic";

@Component({
    selector: 'app-regimenes',
    templateUrl: './regimen.component.html',
    styleUrls: ['./regimen.component.scss']
})
export class RegimenComponent implements OnInit {
    //VARIABLES METODO BUSCAR
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    total: number = 0;
    data: RegimenFiscal[];
    defaultRegimen: boolean = false;
    idRegimenDefault: number;

    @ViewChild('autocompleteRegimenes') autocompleteRegimen: AutocompleteGenericComponent;

    //Varibles metodo fillData
    formularioRegimen: FormGroup;

    //varibaleGetRegimen
    regimenFiscal: RegimenFiscal = new RegimenFiscal();
    datosRegimenFiscal: RegimenFiscal;
    entitySelected: RegimenFiscal;
    valor: number;
    tipoRegimen: number;


    query: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;
    isEdit: boolean = false;


    constructor(private regimenFiscalService: RegimenFiscalService, private _fb: FormBuilder, private router: Router) {
        this.regimenFiscalService = regimenFiscalService;
    }
    ngOnInit() {
        this.formularioRegimen = this._fb.group({
            'tipoRegimen': ['', Validators.required,],

        });
        this.initFormQuery();
        this.buscar();
    }

    ngOnDestroy() {
        if (this.querySubscription$ && !this.querySubscription$.closed) {
            this.querySubscription$.unsubscribe();
        }
    }

    buscar() {
        this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.total = dataxyz.total;
                this.data = dataxyz.data;
            }, (errorxyz) => {
            }
        );
    }

    fillDataFormulario(regimenFiscal: RegimenFiscal) {
        // console.log("Tengo dato", this.formRegimen.get('RegimenInicial'));
        this.formularioRegimen.get('tipoRegimen').setValue(regimenFiscal.tipoRegimen.nombre);
    }

    getRegimenId(idRegimen: Number) {
        this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.data = dataxyz.data;
                let length = this.data.length - 1;
                let idTipoRegimen = idRegimen;
                for (var index = 0; length >= index; index += 1) {
                    var id = this.data[index].tipoRegimen.id;
                    if (id == idTipoRegimen) {
                        this.idRegimenDefault = this.data[index].id;
                        localStorage.setItem('idRegimenDefault', String(this.idRegimenDefault));
                    }
                }
            }, (errorxyz) => {
            }
        );
        this.buscar();
    }

    prepareEdit(item: any) {
        this.isEdit = true;
        //console.log("clic en editar", this.autocompleteRegimen);

        this.onClick_edit(item);

        if (item.id) {
            //console.log("CODIGO POSTAL "+item.cp);
            this.autocompleteRegimen.getDetalle(item.id);
            this.formularioRegimen.get('tipoRegimen').setValue(item.id);
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioRegimen.reset();
        this.formularioRegimen.get('tipoRegimen').setValue(entity_edit.tipoRegimen);
        this.valor = entity_edit.id;
    }


    onChangeSize() {
        this.page = 1;
        this.buscar();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscar();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscar();
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'query': ['',
                [Validators.minLength(1)]
            ]
        });


        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.query = data.query;
                this.buscar();
            });
    }

    eliminarRegimen(entity: any) {
        //this.myGroup.reset();
        this.entitySelected = entity;
    }

    removeRegimen(id: number) {
        this.regimenFiscalService.remove(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            console.log(error);

        });
        $('#eliminarRegimen').modal('hide');
    }

    regimenDefault(isDefault: any) {
        if (isDefault.target.checked == true) {
            this.defaultRegimen = true
        } else {
            this.defaultRegimen = false
        }
    }

    agregarRegimen() {
        let datosRegimenFiscal: RegimenFiscal = new RegimenFiscal();
        datosRegimenFiscal.tipoRegimen = new TipoRegimen();
        datosRegimenFiscal.empresa = new Empresa();
        datosRegimenFiscal.tipoRegimen.id = this.formularioRegimen.get('tipoRegimen').value;
        this.regimenFiscalService.create(datosRegimenFiscal).then((x) => {
            this.buscar();
            if (this.defaultRegimen == true) {
                this.getRegimenId(datosRegimenFiscal.tipoRegimen.id);
            }
            $('#Regimenes').modal('hide');
        }).catch((y) => {

        });

    }

    onSubmitEditRegimen() {
        let dataRegimenFiscal: RegimenFiscal = new RegimenFiscal();
        dataRegimenFiscal.tipoRegimen = new TipoRegimen();
        dataRegimenFiscal.empresa = new Empresa();
        dataRegimenFiscal.tipoRegimen.id = this.formularioRegimen.get('tipoRegimen').value;
        dataRegimenFiscal.id = this.valor;

        this.regimenFiscalService.update(dataRegimenFiscal).then((data: any) => {
            this.buscar();
            if (this.defaultRegimen == true) {
                this.idRegimenDefault = dataRegimenFiscal.id;
                localStorage.setItem('idRegimenDefault', String(this.idRegimenDefault));
            }
        }).catch((error) => {
            // console.log(error);
            this.buscar();
        });
        $('#Regimenes').modal('hide');
    }

    prepareAdd() {
        //console.log("clic en agregar");
        this.formularioRegimen.reset();
        this.isEdit = false;
    }

    onIdRegimenesSelected(tipoRegimen: any) {
        if (tipoRegimen !== undefined && tipoRegimen != null && tipoRegimen > 0) {
            this.formularioRegimen.get('tipoRegimen').setValue(tipoRegimen);
        } else {
            this.formularioRegimen.get('tipoRegimen').setValue(0);
        }
    }

    onSubmitRegimenes() {
        if (this.isEdit) {
            this.onSubmitEditRegimen();
        } else {
            this.agregarRegimen()
        }
    }
}