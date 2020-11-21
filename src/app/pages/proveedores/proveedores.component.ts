import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ClienteProveedor } from '../../entidades/cliente-proveedor';
import { Subscription } from 'rxjs/Rx';
import { Empresa } from '../../entidades/empresa';
import { Sucursal } from '../../entidades/sucursal';
import { Certificado } from '../../entidades/certificado';
import { Observable } from 'rxjs/Observable';
import { ClienteProveedorService } from '../../servicios-backend/cliente-proveedor.service';
import { CpService } from '../../servicios-backend/cp.service';
import { Cp } from '../../entidades/cp';
import { AutocompleteGenericComponent } from "app/comun/components/autocomplete-generic";
import { GlobalState } from '../../global.state';

@Component({
    selector: 'app-proveedores',
    templateUrl: './proveedores.component.html',
    styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
    form: any;
    FormControl: any;
    formularioProveedores: FormGroup;

    data: ClienteProveedor[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalProveedor: number = 0;

    filterIdUsuario: number = 0;
    loadingFirstTime: boolean = false;
    public isMenuCollapsed: boolean = false;

    entidad_elimar: ClienteProveedor;
    valor: number;
    colonias = [];

    isEdit: boolean = false;

    /**
   * Variables para filtrar por query
   */
    queryProveedor: string = '';
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
        this.initFormularioProveedores();
        this.initFormQuery();
        this.buscarProveedor();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioProveedores() {
        this.formularioProveedores = new FormGroup({
            nombre: new FormControl(),
            correo: new FormControl(),
            // t_cliente: new FormControl(),
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
            'queryProveedor': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryProveedor = data.queryProveedor;
                this.buscarProveedor();
            });
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
            && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
            return false;
        else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
            return false;
        return rfcSinDigito + digitoVerificador;
    }

    onKey(event) {
        const inputValue = event.target.value;
        var rfc = inputValue, resultado = document.getElementById("rfc");

        var rfcCorrecto = this.rfcValido(rfc);   // ⬅️ Acá se comprueba
        if (rfcCorrecto) {
            resultado.classList.add("ok");
        } else {
            resultado.classList.remove("ok");
        }
    }

    buscarProveedor() {
        this.clienteProveedorService.getClienteProveedor(this.queryProveedor, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, 2).subscribe(
            (dataCliente) => {
                this.totalProveedor = dataCliente.total;
                this.data = dataCliente.data;
            }, (errorCliente) => {
            }
        )
    }

    onChangeSize() {
        this.page = 1;
        this.buscarProveedor();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscarProveedor();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscarProveedor();
    }

    buscar() {
        this.clienteProveedorService.getClienteProveedor(this.queryProveedor, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, 2).subscribe(
            (dataxyz) => {
                this.totalProveedor = dataxyz.total;
                this.data = dataxyz.data;
            }, (errorxyz) => {
            }
        );
    }

    prepareAdd() {
        this.formularioProveedores.reset();
        this.autocompleteSucursalService.prepareAdd();
        this.autocompleteCodigoP.prepareAdd();
        this.isEdit = false;
        this.formularioProveedores.get('colonia').setValue(null);
        this.formularioProveedores.get('pais').setValue("México");

        //this.formularioProveedores.get('estatus').setValue(2);

    }

    onSubmitAgregar() {
        let agregar_proveedor: ClienteProveedor = new ClienteProveedor();
        agregar_proveedor.sucursal = new Sucursal();

        agregar_proveedor.nombre = this.formularioProveedores.get('nombre').value;
        agregar_proveedor.correo = this.formularioProveedores.get('correo').value;
        // agregar_proveedor.tipoCliente = this.formularioProveedores.get('t_cliente').value;
        agregar_proveedor.rfc = this.formularioProveedores.get('rfc').value;
        agregar_proveedor.sucursal.id = this.formularioProveedores.get('sucursal').value;
        agregar_proveedor.calle = this.formularioProveedores.get('calle').value;
        agregar_proveedor.numeroExterior = this.formularioProveedores.get('n_exterior').value;
        agregar_proveedor.numeroInterior = this.formularioProveedores.get('n_interior').value;
        agregar_proveedor.cp = this.formularioProveedores.get('cp').value;
        agregar_proveedor.colonia = this.formularioProveedores.get('colonia').value;
        agregar_proveedor.localidad = this.formularioProveedores.get('localidad').value;
        agregar_proveedor.municipio = this.formularioProveedores.get('municipio').value;
        agregar_proveedor.estado = this.formularioProveedores.get('estado').value;
        agregar_proveedor.pais = this.formularioProveedores.get('pais').value;
        agregar_proveedor.mails = this.formularioProveedores.get('mails_ccp').value;
        agregar_proveedor.comentarios = this.formularioProveedores.get('comentarios').value;

        //Tipo: cliente
        agregar_proveedor.tipo = 2;

        this.clienteProveedorService.create(agregar_proveedor).then((dato) => {
            this.buscarProveedor();
        }).catch((error) => {
            alert("Error");
        });
        $('#Proveedores').modal('hide');
    }

    onIdSucursalSelected(id) {
        if (id !== undefined && id != null && id > 0) {
            this.formularioProveedores.get('sucursal').setValue(id);

        } else {
            this.formularioProveedores.get('sucursal').setValue(0);
        }
    }

    onSubmitProveedores() {
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
            this.formularioProveedores.get('cp').setValue(entity_edit.cp);
            console.log(this.formularioProveedores);
        }
        if (entity_edit.sucursal.id && entity_edit.sucursal.id > 0) {
            this.autocompleteSucursalService.getDetalle(entity_edit.sucursal.id);
            this.formularioProveedores.get('sucursal').setValue(entity_edit.sucursal.id);
        }

    }

    onCodigoPostalSelected(cp: any) {
        this.colonias = [];
        if (cp !== undefined && cp != null && cp > 0) {
            this.cpService.consultarLocalizacion(cp).then((data) => {
                console.log(data);
                this.formularioProveedores.get('cp').setValue(cp);
                this.formularioProveedores.get('municipio').setValue(data.data.municipio);
                this.formularioProveedores.get('estado').setValue(data.data.estado);

                for (let colonia of data.data.colonia) {
                    this.colonias.push(colonia);
                }
                //this.colonias.push(data.data.colonia);
            }).catch((error) => {
                console.log(error);
            });
        } else {
            this.formularioProveedores.get('cp').setValue(0);
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioProveedores.reset();

        this.formularioProveedores.get('nombre').setValue(entity_edit.nombre);
        this.formularioProveedores.get('correo').setValue(entity_edit.correo);
        // this.formularioProveedores.get('t_cliente').setValue(entity_edit.tipoCliente);
        this.formularioProveedores.get('rfc').setValue(entity_edit.rfc);
        this.formularioProveedores.get('sucursal').setValue(entity_edit.sucursal.id);
        this.formularioProveedores.get('calle').setValue(entity_edit.calle);
        this.formularioProveedores.get('n_exterior').setValue(entity_edit.numeroExterior);
        this.formularioProveedores.get('n_interior').setValue(entity_edit.numeroInterior);
        this.formularioProveedores.get('cp').setValue(entity_edit.cp);
        this.formularioProveedores.get('colonia').setValue(entity_edit.colonia);
        this.formularioProveedores.get('localidad').setValue(entity_edit.localidad);
        this.formularioProveedores.get('municipio').setValue(entity_edit.municipio);
        this.formularioProveedores.get('estado').setValue(entity_edit.estado);
        this.formularioProveedores.get('pais').setValue(entity_edit.pais);
        this.formularioProveedores.get('mails_ccp').setValue(entity_edit.mails);
        this.formularioProveedores.get('comentarios').setValue(entity_edit.comentarios);

        this.valor = entity_edit.id;
    }

    onSubmitEditar() {
        let editar_proveedor: ClienteProveedor = new ClienteProveedor();
        editar_proveedor.sucursal = new Sucursal();

        editar_proveedor.id = this.valor;
        editar_proveedor.nombre = this.formularioProveedores.get('nombre').value;
        editar_proveedor.correo = this.formularioProveedores.get('correo').value;
        // editar_proveedor.tipoCliente = this.formularioProveedores.get('t_cliente').value;
        editar_proveedor.rfc = this.formularioProveedores.get('rfc').value;
        editar_proveedor.sucursal.id = this.formularioProveedores.get('sucursal').value;
        editar_proveedor.calle = this.formularioProveedores.get('calle').value;
        editar_proveedor.numeroExterior = this.formularioProveedores.get('n_exterior').value;
        editar_proveedor.numeroInterior = this.formularioProveedores.get('n_interior').value;
        editar_proveedor.cp = this.formularioProveedores.get('cp').value;
        editar_proveedor.colonia = this.formularioProveedores.get('colonia').value;
        editar_proveedor.localidad = this.formularioProveedores.get('localidad').value;
        editar_proveedor.municipio = this.formularioProveedores.get('municipio').value;
        editar_proveedor.estado = this.formularioProveedores.get('estado').value;
        editar_proveedor.pais = this.formularioProveedores.get('pais').value;
        editar_proveedor.mails = this.formularioProveedores.get('mails_ccp').value;
        editar_proveedor.comentarios = this.formularioProveedores.get('comentarios').value;

        //Tipo: cliente
        editar_proveedor.tipo = 2;

        this.clienteProveedorService.update(editar_proveedor).then((dato) => {
            this.buscarProveedor();
        }).catch((error) => {
            alert("Error");
        });
        this.formularioProveedores.reset();
        $('#Proveedores').modal('hide');
    }

    onClick_elim(entity: any) {
        this.formularioProveedores.reset();
        this.entidad_elimar = entity;
    }

    remove_cliente(id: number) {
        this.clienteProveedorService.remove(id).then((dato) => {
            this.buscarProveedor();
        }).catch((error) => {
            alert("Error de conexión");
        });
        this.formularioProveedores.reset();
        $('#eliminar').modal('hide');
    }

    exportarExcel() {
        this.clienteProveedorService.getCSVInfoProveedor();
    }
}
