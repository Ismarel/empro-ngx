import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Folios } from 'app/entidades/folios';
import { FoliosService } from 'app/servicios-backend/folios.service';

@Component({
    selector: 'app-folios',
    templateUrl: './folios.component.html',
    styleUrls: ['./folios.scss']
})
export class FoliosComponent implements OnInit {
    form: any;
    FormControl: any;
    formcontrol: string;
    formularioFolio: FormGroup;

    data: Folios[];
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalFolios: number = 0;

    loadingFirstTime: boolean = false;

    entidad_elimar: Folios;
    valor: number;

    isEdit: boolean = false;
    /**
     * Variables para filtrar por query
     */
    query: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;
    public signo: boolean;

    constructor(private foliosService: FoliosService, private _fb: FormBuilder, private router: Router) {
        this.foliosService = foliosService;
    }
    ngOnInit() {
        this.initFormularioFolios();
        this.initFormQuery();
        this.buscar();
    }

    initFormularioFolios() {
        this.formularioFolio = new FormGroup({
            folioInicial: new FormControl(),
            folioActual: new FormControl(),
            estatus: new FormControl(),
            serie: new FormControl(),
        });
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

    buscar() {
        this.foliosService.getFolios(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.totalFolios = dataxyz.total;
                this.data = dataxyz.data;
            }, (errorxyz) => {
                console.log('error', errorxyz);
            }
        );
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

    onSubmitAgregar() {
        let datosFolios = new Folios();
        //this.datosFolios.empresa.id = new Empresa();
        datosFolios.folioInicial = this.formularioFolio.get('folioInicial').value;
        datosFolios.folioActual = this.formularioFolio.get('folioInicial').value;
        datosFolios.estatus = true;
        datosFolios.serie = this.formularioFolio.get('serie').value;
        this.foliosService.create(datosFolios).then((x) => {
            this.formularioFolio.reset();
            this.buscar();
            $('#Folios').modal('hide');
        }).catch((y) => {

        });
    }

    checkValidators(text: any, tipo: number) {
        var texto = text.target.value;
        if (tipo == 1) {
            if (texto != "") {
                var sign = Math.sign(texto);
                if (sign == -1 || sign == -0) {
                    this.signo = false
                } else {
                    this.signo = true;
                }
            }
        } else if (tipo == 2) {
            if (texto.replace(/(^\s+|\s+$)/g, "").length == 0) {
                this.formularioFolio.get('serie').setValue(null);
            }
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioFolio.get('folioInicial').setValue(entity_edit.folioInicial);
        this.formularioFolio.get('folioActual').setValue(entity_edit.folioActual);
        this.formularioFolio.get('estatus').setValue(entity_edit.estatus);
        this.formularioFolio.get('serie').setValue(entity_edit.serie);
        this.valor = entity_edit.id;
        //dataCertificados.empresa.id = 1;
    }

    prepareEdit(item: any) {
        this.isEdit = true;
        this.onClick_edit(item);
    }

    fillDataFormulario(folios: Folios) {
        this.formularioFolio.get('folioInicial').setValue(folios.folioInicial);
        this.formularioFolio.get('folioActual').setValue(folios.folioActual);
        this.formularioFolio.get('estatus').setValue(folios.estatus);
        this.formularioFolio.get('serie').setValue(folios.serie);
    }

    prepareAdd() {
        this.formularioFolio.reset();
        this.isEdit = false;
    }

    onSubmitEditar() {
        let dataFolios: Folios = new Folios();
        dataFolios.folioInicial = this.formularioFolio.get('folioInicial').value;
        dataFolios.folioActual = this.formularioFolio.get('folioActual').value;
        dataFolios.estatus = this.formularioFolio.get('estatus').value;
        dataFolios.serie = this.formularioFolio.get('serie').value;
        dataFolios.folio_ind = "";
        dataFolios.id = this.valor;

        this.foliosService.update(dataFolios).then((data: any) => {
            this.buscar();
            $('#Folios').modal('hide');
        }).catch((error) => {
            console.log(error);
            this.buscar();
            $('#Folios').modal('hide');
        });
    }

    onClick_elim(entity: any) {
        //this.myGroup.reset();
        this.formularioFolio.reset();
        this.entidad_elimar = entity;
    }

    removeFolio(id: number) {
        this.foliosService.remove(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            console.log(error);

        });
        $('#eliminarFolio').modal('hide');
    }

    onSubmitFolios() {
        if (this.isEdit) {
            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }

}