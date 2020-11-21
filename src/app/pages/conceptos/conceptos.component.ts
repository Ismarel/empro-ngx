import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { isNumeric } from 'rxjs/util/isNumeric';

import { ConceptoService } from '../../servicios-backend/concepto.service';
import { CertificadoService } from '../../servicios-backend/certificado.service';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { Concepto } from '../../entidades/concepto';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Unidad } from '../../entidades/unidad';
import { Producto } from '../../entidades/producto';
import { Empresa } from '../../entidades/empresa';
import { DataFilterPipe } from '../tables/components/dataTables/data-filter.pipe';
import { Sucursal } from '../../entidades/sucursal';
import { AutocompleteGenericComponent } from '../../comun/components/autocomplete-generic/autocomplete-generic.component';
import { SucursalService } from '../../servicios-backend/sucursal.servicio';
import { GlobalState } from '../../global.state';

@Component({
    selector: 'app-conceptos',
    templateUrl: './conceptos.component.html',
    styleUrls: ['./conceptos.component.scss']
})

export class ConceptosComponent implements OnInit {

    form: any;
    FormControl: any;
    formcontrol: string;
    formularioConcepto: FormGroup;

    data: Concepto[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalConcepto: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;
    isClave: boolean = false;
    isUnidad: boolean = false;
    isStatus: boolean = false;
    isInventario: boolean = false;
    public isMenuCollapsed: boolean = false;

    entidad_elimar: Concepto;
    valor: number;

    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryConceptos: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteProductService') autocompleteProductService: AutocompleteGenericComponent;
    @ViewChild('autocompleteUnidadService') autocompleteUnidadService: AutocompleteGenericComponent;
    @ViewChild('autocompleteSucursalService') autocompleteSucursalService: AutocompleteGenericComponent;
    sucursales: boolean = false;

    constructor(private conceptoService: ConceptoService, private _fb: FormBuilder, private router: Router, private sucursalService: SucursalService, private _state: GlobalState) {
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.sucursalService.getSucursales("", "", "", 10, 1)
            .subscribe((response) => {
                console.log(response);
                if (response.total != undefined && response.total > 0) {
                    this.sucursales = true;
                } else {
                    this.sucursales = false;
                }
            });
        this.initFormularioConcepto();
        this.initFormQuery();
        this.buscarConcepto();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioConcepto() {
        this.formularioConcepto = new FormGroup({
            nombre: new FormControl(),
            SAT: new FormControl(),
            unidad: new FormControl(),
            inventario: new FormControl(),
            sucursal: new FormControl(),
            estatus: new FormControl(),
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryConceptos': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryConceptos = data.queryConceptos;
                this.buscarConcepto();
            });
    }

    buscarConcepto() {
        this.conceptoService.getList(this.queryConceptos, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataConcepto) => {
                this.totalConcepto = dataConcepto.total;
                this.data = dataConcepto.data;
            }, (errorClconcepto) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarConcepto();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarConcepto();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarConcepto();
    }

    buscar() {
        this.conceptoService.getList(this.queryConceptos, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.totalConcepto = dataxyz.total;
                this.data = dataxyz.data;
            }, (errorxyz) => {
            }
        );
    }

    checkValidators(text: any, tipo: number) {
        var texto = text.target.value;
        if (texto.replace(/(^\s+|\s+$)/g, "").length == 0) {
            if (tipo == 1) { this.formularioConcepto.get('nombre').setValue(null); }
            if (tipo == 2) { this.formularioConcepto.get('calle').setValue(null); }
            if (tipo == 3) { this.formularioConcepto.get('n_exterior').setValue(null); }
            if (tipo == 4) { this.formularioConcepto.get('pais').setValue(null); }
        }
        this.checkValuesRequired();
    }

    onSubmitAgregar() {
        let agregar_conceptos: Concepto = new Concepto();
        agregar_conceptos.producto = new Producto();
        agregar_conceptos.unidad = new Unidad();
        if (this.sucursales) {
            agregar_conceptos.sucursal = new Sucursal();
            agregar_conceptos.sucursal.id = this.formularioConcepto.get('sucursal').value;
        }
        agregar_conceptos.nombre = this.formularioConcepto.get('nombre').value;
        agregar_conceptos.producto.id = this.formularioConcepto.get('SAT').value;
        agregar_conceptos.unidad.id = this.formularioConcepto.get('unidad').value;
        agregar_conceptos.inventario = this.formularioConcepto.get('inventario').value;
        agregar_conceptos.estatus = this.formularioConcepto.get('estatus').value;
        this.conceptoService.create(agregar_conceptos).then((dato) => {
            this.autocompleteProductService.cleanCampo();
            this.autocompleteUnidadService.cleanCampo();
            this.buscarConcepto();
            this.formularioConcepto.reset();
            console.log("hola");
        }).catch((error) => {
            this.autocompleteProductService.cleanCampo();
            this.autocompleteUnidadService.cleanCampo();
            alert("Error");
        });
        this.formularioConcepto.reset();
        $('#Conceptos').modal('hide');
    }

    prepareEdit(entity_edit: any) {
        this.isEdit = true;
        this.onClick_edit(entity_edit);
        if (entity_edit.producto.id && entity_edit.producto.id > 0) {
            this.autocompleteProductService.getDetalle(entity_edit.producto.id);
            this.formularioConcepto.get('SAT').setValue(entity_edit.producto.id);
        }
        if (entity_edit.unidad.id && entity_edit.unidad.id > 0) {
            this.autocompleteUnidadService.getDetalle(entity_edit.unidad.id);
            this.formularioConcepto.get('unidad').setValue(entity_edit.unidad.id);
        }
        if (entity_edit.sucursal.id && entity_edit.sucursal.id > 0) {
            this.autocompleteSucursalService.getDetalle(entity_edit.sucursal.id);
            this.formularioConcepto.get('sucursal').setValue(entity_edit.sucursal.id);
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioConcepto.reset();
        this.formularioConcepto.get('nombre').setValue(entity_edit.nombre);
        this.formularioConcepto.get('SAT').setValue(entity_edit.producto.id);
        this.formularioConcepto.get('unidad').setValue(entity_edit.unidad.id);
        this.formularioConcepto.get('sucursal').setValue(entity_edit.sucursal.id);
        this.formularioConcepto.get('inventario').setValue(entity_edit.inventario);
        this.formularioConcepto.get('estatus').setValue(entity_edit.estatus);
        this.valor = entity_edit.id;
    }

    prepareAdd() {
        this.formularioConcepto.reset();
        this.isEdit = false;
        this.formularioConcepto.get('estatus').setValue(null);

    }

    onSubmitEditar() {
        let editar_concepto: Concepto = new Concepto();
        editar_concepto.producto = new Producto();
        editar_concepto.unidad = new Unidad();
        editar_concepto.empresa = new Empresa();
        editar_concepto.sucursal = new Sucursal();
        editar_concepto.sucursal.id = this.formularioConcepto.get('sucursal').value;
        editar_concepto.id = this.valor;
        editar_concepto.nombre = this.formularioConcepto.get('nombre').value.toUpperCase();
        editar_concepto.producto.id = this.formularioConcepto.get('SAT').value;
        editar_concepto.estatus = this.formularioConcepto.get('estatus').value;
        editar_concepto.unidad.id = this.formularioConcepto.get('unidad').value;
        editar_concepto.inventario = this.formularioConcepto.get('inventario').value;
        editar_concepto.empresa.id = 1;
        this.conceptoService.update(editar_concepto).then((dato) => {
            this.buscarConcepto();
            this.formularioConcepto.reset();
        }).catch((error) => {
            alert("Error");
            this.formularioConcepto.reset();
        });
        this.formularioConcepto.reset();
        $('#Conceptos').modal('hide');
    }
    
    onClick_elim(entity: any) {
        this.formularioConcepto.reset();
        this.entidad_elimar = entity;
    }

    remove_concepto(id: number) {
        this.conceptoService.remove(id).then((dato) => {
            this.buscarConcepto();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.formularioConcepto.reset();
        $('#eliminar').modal('hide');
    }

    onIdClaveServSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.isClave = true;
            this.formularioConcepto.get('SAT').setValue(id);
        } else {
            this.isClave = false;
            this.formularioConcepto.get('SAT').setValue(0);
        }
        this.checkValuesRequired();
    }
    checkValuesRequired() {
        if (this.isUnidad == true && this.isClave == true && this.isStatus == true && this.isInventario == true) {
            var that = $("#btnAddCon");
            console.log("pasa")
            that.prop("disabled", false);
        } else {
            var that = $("#btnAddCon");
            that.prop("disabled", true);
            console.log("no pasa")
        }
    }
    onSelectStatus() {
        this.isStatus = true;
        this.checkValuesRequired();
    }

    onIdUnidadSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.isUnidad = true;
            this.formularioConcepto.get('unidad').setValue(id);
        } else {
            this.isUnidad = false;
            this.formularioConcepto.get('unidad').setValue(0);
        }
        this.checkValuesRequired();
    }

    onIdSucursalSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.formularioConcepto.get('sucursal').setValue(id);
        } else {
            this.formularioConcepto.get('sucursal').setValue(0);
        }
        this.checkValuesRequired();
    }

    onSubmitConcepto() {
        if (this.isEdit) {
            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }

    validateNumber() {
        var valor = this.formularioConcepto.get('inventario').value;
        this.isInventario = isNumeric(valor);
        this.checkValuesRequired();
    };
    
    
    cancelarAddConcepto() {
        this.autocompleteProductService.cleanCampo();
        this.autocompleteUnidadService.cleanCampo();
    }
    exportarExcel() {
        this.conceptoService.getCSVInfo();
    }
}
