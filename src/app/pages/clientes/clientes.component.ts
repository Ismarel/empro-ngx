import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { NgaModule } from 'app/theme/nga.module';
import { Observable } from 'rxjs/Observable';

import { Empresa } from '../../entidades/empresa';
import { Sucursal } from '../../entidades/sucursal';
import { Certificado } from '../../entidades/certificado';
import { ClienteProveedorService } from '../../servicios-backend/cliente-proveedor.service';
import { } from '../../servicios-backend/cliente-proveedor.service';
import { CpService } from '../../servicios-backend/cp.service';
import { Cp } from '../../entidades/cp';
import { ClienteProveedor } from '../../entidades/cliente-proveedor';
import { AutocompleteGenericComponent } from "app/comun/components/autocomplete-generic";
import { GlobalState } from '../../global.state';


@Component({
    selector: ' clientes ',
    templateUrl: './clientes.html',
    styleUrls: ['./clientes.scss'],
})

export class ClientesComponent implements OnInit {
    form: any;
    FormControl: any;
    formularioClientes: FormGroup;

    data: ClienteProveedor[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalCliente: number = 0;
    public isMenuCollapsed: boolean = false;


    entidad_elimar: ClienteProveedor;
    valor: number;
    colonias = [];

    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryCliente: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;
    @ViewChild('autocompleteSucursalService') autocompleteSucursalService: AutocompleteGenericComponent;


    constructor(private clienteProveedorService: ClienteProveedorService, private _fb: FormBuilder, private cpService: CpService, private _state: GlobalState) {
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormularioClientes();
        this.initFormQuery();
        this.buscarCliente();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioClientes() {
        this.formularioClientes = new FormGroup({
            nombre: new FormControl(),
            correo: new FormControl(),
            t_cliente: new FormControl(),
            rfc: new FormControl(),
            sucursal: new FormControl(),
            calle: new FormControl(),
            n_exterior: new FormControl(),
            n_interior: new FormControl(),
            cp: new FormControl(),
            colonia: new FormControl(),
            localidad: new FormControl(),
            municipio: new FormControl(),
            estado: new FormControl(),
            pais: new FormControl(),
            mails_ccp: new FormControl(),
            comentarios: new FormControl(),
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryCliente': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryCliente = data.queryCliente;
                this.buscarCliente();
            });
    }

    buscarCliente() {
        this.clienteProveedorService.getClienteProveedor(this.queryCliente, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, 1).subscribe(
            (dataCliente) => {
                this.totalCliente = dataCliente.total;
                this.data = dataCliente.data;
            }, (errorCliente) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarCliente();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarCliente();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarCliente();
    }


    prepareAdd() {
        this.formularioClientes.reset();

        this.isEdit = false;
        this.formularioClientes.get('colonia').setValue(null);
        this.formularioClientes.get('pais').setValue("México");

        //this.formularioClientes.get('estatus').setValue(2);

    }

    rfcValido(rfc, aceptarGenerico = true) {
        const re = (/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/);
        var validado = rfc.match(re);

        if (!validado)  //Coincide con el formato general del regex?
            return false;

        //Separar el dígito verificador del resto del RFC
        const digitoVerificador = validado.pop(),
            rfcSinDigito = validado.slice(1).join(''),
            len = rfcSinDigito.length,

            //Obtener el digito esperado
            diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
            indice = len + 1;
        var suma,
            digitoEsperado;

        if (len == 12) suma = 0
        else suma = 481; //Ajuste para persona moral

        for (var i = 0; i < len; i++)
            suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
        digitoEsperado = 11 - suma % 11;
        if (digitoEsperado == 11) digitoEsperado = 0;
        else if (digitoEsperado == 10) digitoEsperado = "A";

        //El dígito verificador coincide con el esperado?
        // o es un RFC Genérico (ventas a público general)?
        if ((digitoVerificador != digitoEsperado)
            && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000")){
                return false;
            }
        else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000"){
            return false;
        }
        return rfcSinDigito + digitoVerificador;
    }

    onKey(event) {
        const inputValue = event.target.value;
        var rfc = inputValue, resultado = document.getElementById("rfc");

        var rfcCorrecto = this.rfcValido(rfc);
        if (rfcCorrecto) {
            resultado.classList.add("ok");
        } else {
            resultado.classList.remove("ok");
        }
    }

    onSubmitAgregar() {
        let agregar_cliente: ClienteProveedor = new ClienteProveedor();
        agregar_cliente.sucursal = new Sucursal();

        agregar_cliente.nombre = this.formularioClientes.get('nombre').value;
        agregar_cliente.correo = this.formularioClientes.get('correo').value;
        agregar_cliente.tipoCliente = this.formularioClientes.get('t_cliente').value;
        agregar_cliente.rfc = this.formularioClientes.get('rfc').value;
        agregar_cliente.sucursal.id = this.formularioClientes.get('sucursal').value;
        agregar_cliente.calle = this.formularioClientes.get('calle').value;
        agregar_cliente.numeroExterior = this.formularioClientes.get('n_exterior').value;
        agregar_cliente.numeroInterior = this.formularioClientes.get('n_interior').value;
        agregar_cliente.cp = this.formularioClientes.get('cp').value;
        agregar_cliente.colonia = this.formularioClientes.get('colonia').value;
        agregar_cliente.localidad = this.formularioClientes.get('localidad').value;
        agregar_cliente.municipio = this.formularioClientes.get('municipio').value;
        agregar_cliente.estado = this.formularioClientes.get('estado').value;
        agregar_cliente.pais = this.formularioClientes.get('pais').value;
        agregar_cliente.mails = this.formularioClientes.get('mails_ccp').value;
        agregar_cliente.comentarios = this.formularioClientes.get('comentarios').value;

        //Tipo: cliente
        agregar_cliente.tipo = 1;

        this.clienteProveedorService.create(agregar_cliente).then((dato) => {
            this.buscarCliente();
        }).catch((error) => {
            alert("Error");
        });
        $('#Clientes').modal('hide');
    }

    onSubmitClientes() {
        if (this.isEdit) {

            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }

    prepareEdit(entity_edit: any) {
        this.isEdit = true;
        this.onClick_edit(entity_edit);
        if (entity_edit.cp) {
            //console.log("CODIGO POSTAL "+item.cp);
            this.autocompleteCodigoP.getLugarExpedicion(entity_edit.cp);
            this.formularioClientes.get('cp').setValue(entity_edit.cp);
            console.log(this.formularioClientes);
        }
        if (entity_edit.sucursal.id && entity_edit.sucursal.id > 0) {
            this.autocompleteSucursalService.getDetalle(entity_edit.sucursal.id);
            this.formularioClientes.get('sucursal').setValue(entity_edit.sucursal.id);
        }

    }

    onCodigoPostalSelected(cp: any) {
        this.colonias = [];
        if (cp !== undefined && cp != null && cp > 0) {
            this.cpService.consultarLocalizacion(cp).then((data) => {
                console.log(data);
                this.formularioClientes.get('cp').setValue(cp);
                this.formularioClientes.get('municipio').setValue(data.data.municipio);
                this.formularioClientes.get('estado').setValue(data.data.estado);

                for (let colonia of data.data.colonia) {
                    this.colonias.push(colonia);
                }
                //this.colonias.push(data.data.colonia);
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.formularioClientes.get('cp').setValue(0);
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioClientes.reset();



        this.formularioClientes.get('nombre').setValue(entity_edit.nombre);
        this.formularioClientes.get('correo').setValue(entity_edit.correo);
        this.formularioClientes.get('t_cliente').setValue(entity_edit.tipoCliente);
        this.formularioClientes.get('rfc').setValue(entity_edit.rfc);
        this.formularioClientes.get('sucursal').setValue(entity_edit.sucursal.id);
        this.formularioClientes.get('calle').setValue(entity_edit.calle);
        this.formularioClientes.get('n_exterior').setValue(entity_edit.numeroExterior);
        this.formularioClientes.get('n_interior').setValue(entity_edit.numeroInterior);
        this.formularioClientes.get('cp').setValue(entity_edit.cp);
        this.formularioClientes.get('colonia').setValue(entity_edit.colonia);
        this.formularioClientes.get('localidad').setValue(entity_edit.localidad);
        this.formularioClientes.get('municipio').setValue(entity_edit.municipio);
        this.formularioClientes.get('estado').setValue(entity_edit.estado);
        this.formularioClientes.get('pais').setValue(entity_edit.pais);
        this.formularioClientes.get('mails_ccp').setValue(entity_edit.mails);
        this.formularioClientes.get('comentarios').setValue(entity_edit.comentarios);

        this.valor = entity_edit.id;
    }

    onSubmitEditar() {
        let editar_cliente: ClienteProveedor = new ClienteProveedor();
        editar_cliente.sucursal = new Sucursal();

        editar_cliente.id = this.valor;
        editar_cliente.nombre = this.formularioClientes.get('nombre').value;
        editar_cliente.correo = this.formularioClientes.get('correo').value;
        editar_cliente.tipoCliente = this.formularioClientes.get('t_cliente').value;
        editar_cliente.rfc = this.formularioClientes.get('rfc').value;
        editar_cliente.sucursal.id = this.formularioClientes.get('sucursal').value;
        editar_cliente.calle = this.formularioClientes.get('calle').value;
        editar_cliente.numeroExterior = this.formularioClientes.get('n_exterior').value;
        editar_cliente.numeroInterior = this.formularioClientes.get('n_interior').value;
        editar_cliente.cp = this.formularioClientes.get('cp').value;
        editar_cliente.colonia = this.formularioClientes.get('colonia').value;
        editar_cliente.localidad = this.formularioClientes.get('localidad').value;
        editar_cliente.municipio = this.formularioClientes.get('municipio').value;
        editar_cliente.estado = this.formularioClientes.get('estado').value;
        editar_cliente.pais = this.formularioClientes.get('pais').value;
        editar_cliente.mails = this.formularioClientes.get('mails_ccp').value;
        editar_cliente.comentarios = this.formularioClientes.get('comentarios').value;

        //Tipo: cliente
        editar_cliente.tipo = 1;

        this.clienteProveedorService.update(editar_cliente).then((dato) => {
            this.buscarCliente();
        }).catch((error) => {
            alert("Error");
        });
        this.formularioClientes.reset();
        $('#Clientes').modal('hide');
    }

    onClick_elim(entity: any) {
        this.formularioClientes.reset();
        this.entidad_elimar = entity;
    }

    remove_cliente(id: number) {
        this.clienteProveedorService.remove(id).then((dato) => {
            this.buscarCliente();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.formularioClientes.reset();
        $('#eliminar').modal('hide');
    }

    onIdSucursalSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.formularioClientes.get('sucursal').setValue(id);

        } else {
            this.formularioClientes.get('sucursal').setValue(0);
        }
    }

    exportarExcel() {
        this.clienteProveedorService.getCSVInfoCliente();
    }
}
