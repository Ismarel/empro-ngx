import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Empresa } from '../../entidades/empresa';
import { Sucursal } from '../../entidades/sucursal';
import { Certificado } from '../../entidades/certificado';
import { Observable } from 'rxjs/Observable';
import { CpService } from '../../servicios-backend/cp.service';
import { Cp } from '../../entidades/cp';
import { SucursalService } from '../../servicios-backend/sucursal.servicio';
import { Usuario } from 'app/entidades/usuario';
import { AutocompleteGenericComponent } from "app/comun/components/autocomplete-generic";
import { EmpresaService } from '../../servicios-backend/empresa.service';
import { GlobalState } from '../../global.state';

@Component({
    selector: 'app-sucursales',
    templateUrl: './sucursales.component.html',
    styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit {

    form: any;
    FormControl: any;
    formcontrol: string;
    formularioSucursal: FormGroup;
    public isMenuCollapsed: boolean = false;

    public cpSucursal: boolean;
    data: Sucursal[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalSucursales: number = 0;

    loadingFirstTime: boolean = false;

    entidad_eliminar: Sucursal;
    valor: number;
    colonias = [];

    isEdit: boolean = false;

    idEmpresa: number;
    empresaas: Empresa = new Empresa();
    empresaService: EmpresaService;
    /**
   * Variables para filtrar por query
   */
    querySucursales: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;



    constructor(private sucursalService: SucursalService, private cpService: CpService, private _fb: FormBuilder, empresaService: EmpresaService, private _state: GlobalState) {
        this.empresaService = empresaService;
    }

    ngOnInit() {
        
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormularioSucursal();
        this.initFormQuery();
        this.buscarSucursales()
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioSucursal() {
        this.formularioSucursal = new FormGroup({
            nombre: new FormControl(),
            calle: new FormControl(),
            n_exterior: new FormControl(),
            n_interior: new FormControl(),
            cp: new FormControl(),
            colonia: new FormControl(),
            localidad: new FormControl(),
            municipio: new FormControl(),
            estado: new FormControl(),
            pais: new FormControl(),
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'querySucursales': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.querySucursales = data.querySucursales;
                this.buscarSucursales();
            });
    }

    buscarSucursales() {
        this.sucursalService.getSucursales(this.querySucursales, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataSucursales) => {
                this.totalSucursales = dataSucursales.total;
                this.data = dataSucursales.data;
            }, (errorSucursales) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarSucursales();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarSucursales();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarSucursales();
    }

    onSubmitAgregar() {
        let agregar_sucursal: Sucursal = new Sucursal();
        agregar_sucursal.empresa = new Empresa();
        agregar_sucursal.responsable = new Usuario();
        agregar_sucursal.nombre = this.formularioSucursal.get('nombre').value;
        agregar_sucursal.calle = this.formularioSucursal.get('calle').value;
        agregar_sucursal.numeroExterior = this.formularioSucursal.get('n_exterior').value;
        agregar_sucursal.numeroInterior = this.formularioSucursal.get('n_interior').value;
        agregar_sucursal.cp = this.formularioSucursal.get('cp').value;
        agregar_sucursal.colonia = this.formularioSucursal.get('colonia').value;
        agregar_sucursal.localidad = this.formularioSucursal.get('localidad').value;
        agregar_sucursal.municipio = this.formularioSucursal.get('municipio').value;
        agregar_sucursal.estado = this.formularioSucursal.get('estado').value;
        agregar_sucursal.pais = this.formularioSucursal.get('pais').value;
        //usuario empresa
        // agregar_sucursal.empresa.id = 1;
        // agregar_sucursal.responsable.id = 1;
        this.sucursalService.create(agregar_sucursal).then((dato) => {
            this.buscarSucursales();
        }).catch((error) => {
            alert("Error");
        });
        $('#Sucursales').modal('hide');
    }

    checkValidators(text: any, tipo: number) {
        var texto = text.target.value;
        if (texto.replace(/(^\s+|\s+$)/g, "").length == 0) {
            if (tipo == 1) { this.formularioSucursal.get('nombre').setValue(null); }
            if (tipo == 2) { this.formularioSucursal.get('calle').setValue(null); }
            if (tipo == 3) { this.formularioSucursal.get('n_exterior').setValue(null); }
            if (tipo == 4) { this.formularioSucursal.get('pais').setValue(null); }
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioSucursal.reset();
        this.formularioSucursal.get('nombre').setValue(entity_edit.nombre);
        this.formularioSucursal.get('calle').setValue(entity_edit.calle);
        this.formularioSucursal.get('n_exterior').setValue(entity_edit.numeroExterior);
        this.formularioSucursal.get('n_interior').setValue(entity_edit.numeroInterior);
        this.formularioSucursal.get('cp').setValue(entity_edit.cp);
        this.formularioSucursal.get('colonia').setValue(entity_edit.colonia);
        this.formularioSucursal.get('localidad').setValue(entity_edit.localidad);
        this.formularioSucursal.get('municipio').setValue(entity_edit.municipio);
        this.formularioSucursal.get('estado').setValue(entity_edit.estado);
        this.formularioSucursal.get('pais').setValue(entity_edit.pais);
        this.valor = entity_edit.id;
    }

    prepareEdit(item: any) {
        this.isEdit = true;
        this.onClick_edit(item);
        if (item.cp) {
            //console.log("CODIGO POSTAL "+item.cp);
            this.autocompleteCodigoP.getLugarExpedicion(item.cp);
            this.formularioSucursal.get('cp').setValue(item.cp);
            console.log(this.formularioSucursal);
        }
    }

    prepareAdd() {
        this.formularioSucursal.reset();
        this.isEdit = false;
    }

    onSubmitEditar() {
        let editar_sucursal: Sucursal = new Sucursal();
        editar_sucursal.empresa = new Empresa();
        editar_sucursal.responsable = new Usuario();

        editar_sucursal.id = this.valor;
        editar_sucursal.nombre = this.formularioSucursal.get('nombre').value;
        editar_sucursal.calle = this.formularioSucursal.get('calle').value;
        editar_sucursal.numeroExterior = this.formularioSucursal.get('n_exterior').value;
        editar_sucursal.numeroInterior = this.formularioSucursal.get('n_interior').value;
        editar_sucursal.cp = this.formularioSucursal.get('cp').value;
        editar_sucursal.colonia = this.formularioSucursal.get('colonia').value;
        editar_sucursal.localidad = this.formularioSucursal.get('localidad').value;
        editar_sucursal.municipio = this.formularioSucursal.get('municipio').value;
        editar_sucursal.estado = this.formularioSucursal.get('estado').value;
        editar_sucursal.pais = this.formularioSucursal.get('pais').value;
        //usuario empresa
        //------->FUNCIÓN AGREGADA PARA EL ID DE EMPRESA
        this.empresaService.getDetalle().then((data: any) => {
            this.empresaas = data;
            this.idEmpresa = this.empresaas.id;

            editar_sucursal.empresa.id = this.idEmpresa;//1;
            editar_sucursal.responsable.id = 1;

            this.sucursalService.update(editar_sucursal).then((dato) => {
                this.buscarSucursales();
            }).catch((error) => {
                alert("Error");
            });

        }).catch((error) => {
            console.log("-------error", error);
        });

        $('#Sucursales').modal('hide');
    }

    onClick_elim(entity: any) {
        this.formularioSucursal.reset();
        this.entidad_eliminar = entity;
    }

    remove_sucursal(id: number) {
        console.log(id);
        this.sucursalService.remove(id).then((dato) => {
            this.buscarSucursales();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.formularioSucursal.reset();
        $('#eliminar').modal('hide');
    }

    onCodigoPostalSelected(cp: any) {
        if (cp != null) {
            this.cpSucursal = true;
        } else {
            this.cpSucursal = false;
            this.formularioSucursal.get('colonia').setValue(null);
        }
        this.colonias = [];
        if (cp !== undefined && cp != null && cp > 0) {
            this.cpService.consultarLocalizacion(cp).then((data) => {
                this.formularioSucursal.get('cp').setValue(cp);
                this.formularioSucursal.get('municipio').setValue(data.data.municipio);
                this.formularioSucursal.get('estado').setValue(data.data.estado);
                for (let colonia of data.data.colonia) {
                    this.colonias.push(colonia);
                }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.formularioSucursal.get('cp').setValue(0);
        }
    }

    onSubmitSucursales() {
        if (this.isEdit) {
            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }

    exportarExcel() {
        this.sucursalService.getCSVInfoSucursal();
    }
}
