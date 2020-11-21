import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Usuario } from 'app/entidades/usuario';
import { UsuarioService } from 'app/servicios-backend/usuario.service';
import { Empresa } from "app/entidades/empresa";
import { GlobalState } from '../../global.state';

@Component({
    selector: ' usuarios ',
    templateUrl: './usuarios.html',
    styleUrls: ['./usuarios.scss'],
})
export class UsuariosComponent implements OnInit {
    form: any;
    FormControl: any;
    formularioUsuarios: FormGroup;

    data: Usuario[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalUsuario: number = 0;
    public isMenuCollapsed: boolean = false;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;

    entidad_elimar: Usuario;
    valor: number;

    colonias = [];
    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryUsuarios: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    constructor(private usuarioService: UsuarioService, private _fb: FormBuilder, private _state: GlobalState) {
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormularioUsuarios();
        this.initFormQuery();
        this.buscarUsuarios();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioUsuarios() {
        this.formularioUsuarios = new FormGroup({
            nombre: new FormControl(),
            correo: new FormControl(),
            password: new FormControl(),
            estatus: new FormControl(),
            dashboard: new FormControl(),
            empresas: new FormControl(),
            bancos: new FormControl(),
            facturas: new FormControl(),
            nominas: new FormControl(),
            ingresos: new FormControl(),
            egresos: new FormControl(),
            reportes: new FormControl(),
            fechaRegistro: new FormControl(),
            apellidoPaterno: new FormControl(),
            apellidoMaterno: new FormControl(),
            // empresa: new FormControl(),
            // nombreEmpresa: new FormControl(),
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryUsuarios': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryUsuarios = data.queryUsuarios;
                this.buscarUsuarios();
            });
    }

    buscarUsuarios() {
        this.usuarioService.getUsuarios(this.queryUsuarios, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataUsuarios) => {
                this.totalUsuario = dataUsuarios.total;
                this.data = dataUsuarios.data;
            }, (errorUsuarios) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarUsuarios();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarUsuarios();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarUsuarios();
    }

    prepareAdd() {
        this.formularioUsuarios.reset();

        this.isEdit = false;
        this.formularioUsuarios.get('estatus').setValue(null);
        this.formularioUsuarios.get('dashboard').setValue(null);
        this.formularioUsuarios.get('empresas').setValue(null);
        this.formularioUsuarios.get('bancos').setValue(null);
        this.formularioUsuarios.get('facturas').setValue(null);
        this.formularioUsuarios.get('nominas').setValue(null);
        this.formularioUsuarios.get('ingresos').setValue(null);
        this.formularioUsuarios.get('egresos').setValue(null);
        this.formularioUsuarios.get('reportes').setValue(null);


    }

    onSubmitAgregar() {
        let agregar_usuario: Usuario = new Usuario();
        agregar_usuario.empresa = new Empresa();

        let status = this.formularioUsuarios.get('estatus').value;
        if (status == 2) {
            status = 0;
        }
        agregar_usuario.nombre = this.formularioUsuarios.get('nombre').value;
        agregar_usuario.correo = this.formularioUsuarios.get('correo').value;
        agregar_usuario.password = this.formularioUsuarios.get('password').value;
        agregar_usuario.estatus = status;//this.formularioUsuarios.get('estatus').value;
        agregar_usuario.dashboard = this.formularioUsuarios.get('dashboard').value;
        agregar_usuario.empresas = this.formularioUsuarios.get('empresas').value;
        agregar_usuario.bancos = this.formularioUsuarios.get('bancos').value;
        agregar_usuario.facturas = this.formularioUsuarios.get('facturas').value;
        agregar_usuario.nominas = this.formularioUsuarios.get('nominas').value;
        agregar_usuario.ingresos = this.formularioUsuarios.get('ingresos').value;
        agregar_usuario.egresos = this.formularioUsuarios.get('egresos').value;
        agregar_usuario.reportes = this.formularioUsuarios.get('reportes').value;
        agregar_usuario.apellidoPaterno = this.formularioUsuarios.get('apellidoPaterno').value;
        agregar_usuario.apellidoMaterno = this.formularioUsuarios.get('apellidoMaterno').value;
        agregar_usuario.empresa.id = 1;

        //agregar_usuario.empresa = this.formularioUsuarios.get('empresa').value;
        //agregar_usuario.nombreEmpresa = this.formularioUsuarios.get('nombreEmpresa').value;

        console.log(agregar_usuario);

        this.usuarioService.create(agregar_usuario).then((dato) => {
            this.buscarUsuarios();
            $('#Usuarios').modal('hide');
        }).catch((error) => {
            alert("Intente de Nuevo");
            $('#Usuarios').modal('hide');
        });

    }
    onSubmitUsuarios() {
        if (this.isEdit) {

            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }

    prepareEdit(entity_edit: any) {
        this.isEdit = true;
        this.onClick_edit(entity_edit);
    }

    onClick_edit(entity_edit: any) {
        this.formularioUsuarios.reset();

        this.formularioUsuarios.get('nombre').setValue(entity_edit.nombre);
        this.formularioUsuarios.get('correo').setValue(entity_edit.correo);
        this.formularioUsuarios.get('password').setValue(entity_edit.password);
        this.formularioUsuarios.get('estatus').setValue(entity_edit.estatus);
        this.formularioUsuarios.get('dashboard').setValue(entity_edit.dashboard);
        this.formularioUsuarios.get('empresas').setValue(entity_edit.empresas);
        this.formularioUsuarios.get('bancos').setValue(entity_edit.bancos);
        this.formularioUsuarios.get('facturas').setValue(entity_edit.facturas);
        this.formularioUsuarios.get('nominas').setValue(entity_edit.nominas);
        this.formularioUsuarios.get('ingresos').setValue(entity_edit.ingresos);
        this.formularioUsuarios.get('egresos').setValue(entity_edit.egresos);
        this.formularioUsuarios.get('reportes').setValue(entity_edit.reportes);
        this.formularioUsuarios.get('apellidoPaterno').setValue(entity_edit.apellidoPaterno);
        this.formularioUsuarios.get('apellidoMaterno').setValue(entity_edit.apellidoMaterno);

        // this.formularioUsuarios.get('empresa').setValue(entity_edit.empresa);
        // this.formularioUsuarios.get('nombreEmpresa').setValue(entity_edit.nombreEmpresa);

        console.log(this.formularioUsuarios);

    }

    onSubmitEditar() {
        let editar_usuario: Usuario = new Usuario();

        let status = this.formularioUsuarios.get('estatus').value;
        if (status == 2) {
            status = 0;
        }
        editar_usuario.id = this.valor;
        editar_usuario.nombre = this.formularioUsuarios.get('nombre').value;
        editar_usuario.correo = this.formularioUsuarios.get('correo').value;
        editar_usuario.password = this.formularioUsuarios.get('password').value;
        editar_usuario.estatus = status;//this.formularioUsuarios.get('estatus').value;
        editar_usuario.dashboard = this.formularioUsuarios.get('dashboard').value;
        editar_usuario.empresas = this.formularioUsuarios.get('empresas').value;
        editar_usuario.bancos = this.formularioUsuarios.get('bancos').value;
        editar_usuario.facturas = this.formularioUsuarios.get('facturas').value;
        editar_usuario.nominas = this.formularioUsuarios.get('nominas').value;
        editar_usuario.ingresos = this.formularioUsuarios.get('ingresos').value;
        editar_usuario.egresos = this.formularioUsuarios.get('egresos').value;
        editar_usuario.reportes = this.formularioUsuarios.get('reportes').value;
        editar_usuario.apellidoPaterno = this.formularioUsuarios.get('apellidoPaterno').value;
        editar_usuario.apellidoMaterno = this.formularioUsuarios.get('apellidoMaterno').value;

        // editar_usuario.empresa = this.formularioUsuarios.get('empresa').value;
        // editar_usuario.nombreEmpresa = this.formularioUsuarios.get('nombreEmpresa').value;

        console.log(editar_usuario);

        this.usuarioService.update(editar_usuario).then((dato) => {
            this.buscarUsuarios();
        }).catch((error) => {
            alert("Error");
        });
        this.formularioUsuarios.reset();
        $('#editarUsuarios').modal('hide');
    }

    onClick_elim(entity: any) {
        this.formularioUsuarios.reset();
        this.entidad_elimar = entity;
    }

    remove_usuario(id: number) {
        console.log(id);
        this.usuarioService.remove(id).then((dato) => {
            this.buscarUsuarios();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.formularioUsuarios.reset();
        $('#eliminar').modal('hide');
    }
    exportarExcel() {
        this.usuarioService.getCSVInfo();
    }
}
