import { Component, OnInit } from '@angular/core';
import { TransferenciaService } from 'app/servicios-backend/transferencia.service';
import { Trabajador } from 'app/entidades/trabajador';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Transferencia } from 'app/entidades/transferencia';
import { CuentaService } from '../../../../servicios-backend/cuenta.service';
import { SucursalService } from '../../../../servicios-backend/sucursal.servicio';
import { Cuenta } from '../../../../entidades/cuenta';
import { IngresoEgresoService } from '../../../../servicios-backend/ingreso-egreso.service';
import { CobroPago } from '../../../../entidades/cobro-pago';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'app-estadoscuenta',
    templateUrl: './estadoscuenta.component.html',
    styleUrls: ['./estadoscuenta.component.scss']
})
export class EstadoscuentaComponent implements OnInit {

    sucursalesEnabled: boolean = false; // variable Sucursales existentes o no
    listaCuentas: Array<Cuenta> = new Array<Cuenta>();
    formularioFilterQuery: FormGroup;
    form: FormGroup;
    //parametros para buscar()
    rowsOnPage: number = 10;
    sortBy: string = "";
    sortOrder: string = 'asc';
    page: number = 1;
    idCuenta: number = 0;
    //parametros para poblar la tabla
    totalEstadosCuenta: number = 0;
    data: CobroPago[];
    public isMenuCollapsed: boolean = false;

    query: string = '';
    delayBeforeSearch: number = 400;
    querySubscription$: Subscription;
    isEdit: boolean = false;
    entidad_elimar: Transferencia;
    nombreCuenta: String = "Ver Todas";
    arrayColumnas: Number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // variables para la seleccion de columnas  
    fechaColumna: boolean = true;
    transaccionColumna: boolean = true;
    tipoColumna: boolean = true;
    montoColumna: boolean = true;
    bancoEColumna: boolean = true;
    bancoRColumna: boolean = true;
    numCuentaRColumna: boolean = true;
    nomCuentaRColumna: boolean = true;
    numCuentaEColumna: boolean = true;
    nomCuentaEColumna: boolean = true;
    sucursalColumna: boolean = true;

    /*Constructor para la inyeccion de servicios*/
    constructor(private transferenciaService: TransferenciaService, private fb: FormBuilder,
        private cuentaService: CuentaService, private sucursalesService: SucursalService, private ingresoEgresoService: IngresoEgresoService, private _state: GlobalState) {
        this.form = fb.group({
            //Tipo: Retiro (false) o Deposito (true)
            // 'tipo': ['', Validators.compose([])],
            // 'monto': ['', Validators.compose([])],
            // 'estatus': ['', Validators.compose([])],
            // 'cuentaEmision': ['', Validators.compose([])],
            // 'cuentaRecepcion': ['', Validators.compose([])],
            // 'tarjetaEmision': ['', Validators.compose([])],
            // 'tarjetaRecepcion': ['', Validators.compose([])],
            // 'sucursal': ['', Validators.compose([])],
        });
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormQuery();
        this.buscar();
        this.sucursalesService.getSucursales("", "", "", 10, 1)
            .subscribe((response) => {
                console.log(response);
                if (response.total != undefined && response.total > 0) {
                    this.sucursalesEnabled = true;
                } else {
                    this.sucursalesEnabled = false;
                }

            });


        this.cuentaService.getCuentas("", "", "", 10, 1).subscribe((response) => {
            if (response.total != undefined && response.total > 0) {
                // console.log(response);
                this.listaCuentas = response.data;
            }
        });

        this.ingresoEgresoService.listAllCobroPago(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page)
            .then((response) => {
                console.log(response);
            })
            .catch(this.handleError);
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormQuery() {
        this.formularioFilterQuery = this.fb.group({
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

    onChangeSize() {
        this.page = 1;
        this.buscar();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscar();
    }

    prepareEdit(item: any) {
        this.form.reset();
        this.isEdit = true;
        this.onClick_edit(item);
        this.ingresoEgresoService.update(item);

    }

    onClick_edit(entity_edit: any) {
        // this.formCertificado.get('archivoCer').setValue(entity_edit.archivoCer);
        // this.formCertificado.get('numeroCertificado').setValue(entity_edit.numeroCertificado);
        // this.formCertificado.get('validoDesde').setValue(entity_edit.validoDesde);
        // this.formCertificado.get('validoHasta').setValue(entity_edit.validoHasta);
        // this.formCertificado.get('archivoLlave').setValue(entity_edit.archivoLlave);
        // this.formCertificado.get('password').setValue(entity_edit.password);

        // this.valor = entity_edit.id;

        //dataCertificados.empresa.id = 1;

    }

    onClick_elim(entity: any) {
        //this.myGroup.reset();
        this.form.reset();
        this.entidad_elimar = entity;
        this.ingresoEgresoService.remove(entity.id);
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscar();
    }

    buscar() {
        console.log(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page);

        this.ingresoEgresoService.listAllCobroPago(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.idCuenta)
            .then((response) => {
                this.totalEstadosCuenta = response.total;
                this.data = response.data;
                console.log(response);
            })
            .catch(this.handleError);

        // this.transferenciaService.getTransferencias(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
        //   (data) => {
        //     console.log("La data del suscribe", data);
        //     this.totalEstadosCuenta = data.total;
        //     this.data = data.data;
        //   },
        //   (error) => {
        //     console.log("El error del suscribe", error);
        //   }
        // )
    }

    descargarCSV() {
        this.ingresoEgresoService.descargaCSV();
    }

    filterCuenta(item: any) {
        console.log(item.id);
        if (item.id > 0) {
            this.nombreCuenta = item.nombre;
        } else {
            this.nombreCuenta = "Ver Todas";
        }
        this.idCuenta = item.id;
        this.buscar();
    }

    saveColumns() {
        let columnasSelected: Array<Number> = new Array<Number>();
        $('input:checkbox:checked').each(function(index) {
            console.log(index, $(this).index() / 2);
            columnasSelected.push($(this).index() / 2);
        });
        this.arrayColumnas = columnasSelected;

        $('#modalEditarColumnas').modal('hide');

    }

    columnaAvailable(column: number): boolean {
        if (this.arrayColumnas && this.arrayColumnas.length > 0) {
            for (let i = 0; i < this.arrayColumnas.length; i++) {
                if (this.arrayColumnas[i] == column) {
                    return true;
                }
            }

        }
        return false;
    }

    allColumnsSelected() {
        //llenar el array de columnas con todas las columnas para habilitarlas
        this.arrayColumnas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('A ocurrido un ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }
}
