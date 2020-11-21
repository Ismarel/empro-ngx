import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../../entidades/ingreso-egreso';
import { Subscription, Subject } from 'rxjs';
import { IngresoEgresoService } from 'app/servicios-backend/ingreso-egreso.service';
import { Observable } from 'rxjs/Observable';
import { GlobalState } from '../../global.state';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { TipoComprobante } from 'app/entidades/tipo-comprobante';
import { Concepto } from 'app/entidades/concepto';
import { Trabajador } from '../../entidades/trabajador';
import { Cuenta } from '../../entidades/cuenta';
import { Caja } from '../../entidades/caja';
import { Empresa } from '../../entidades/empresa';
import { DropzoneService } from '../../servicios-backend/dropzone.service';

@Component({
    selector: 'app-egresos',
    templateUrl: './egresos.component.html',
    styleUrls: ['./egresos.component.scss']
})
export class EgresosComponent implements OnInit {
    http: any;
    FormControl: any;
    formularioIngresoEgreso: FormGroup;

    data: IngresoEgreso[];
    rowsOnPage: number = 10;
    sortBy: string = 'nombre';
    sortOrder: string = 'asc';
    page: number = 1;
    totalIngresoEgreso: number = 0;

    entidad_elimar: IngresoEgreso;
    valor: number;

    isEdit: boolean = false;
    ischeck: number = 0;
    inventario: boolean = false;

    tipoComprobante: number = 0;
    tipoPagos: number = 0;
    impuesto: number = 0;
    ideditar: number = 0;

    fechaEditar: number = 0;
    tipoComprobanteEditar: number = 0;
    cajaEditar: number = 0;
    cuentaEditar: number = 0;
    rfcProveedorEditar: String = "";
    public isMenuCollapsed: boolean = false;



    queryIngresosEgresos: string = '';
    delayBeforeSearch: number = 800; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    public eventosDropzone: Subject<{ id: String, evento: String, valor: String }> = new Subject();
    public tArchivo: string = ".xml";
    public arAcept: string = ".xml";
    public tArchivoa: string = ".pdf";
    public arAcepta: string = ".pdf";
    public tArchivob: string = ""; // Acepta cualquier archivo, siempre y cuando la condicion (cond) sea falsa
    public arAceptb: string = ".pdf,.xml,.jpg,.jpeg,.png,.doc,.docx,.xlt,.xls";
    public tipob = "/upload";
    public proyecto = '3';
    public modulo = '1';
    public submodulo = 'ingreso_factura'; // Carpeta
    public idDZa = "#dZUploadXML"; // Archivo con extension .xml
    public idDZb = "#dZUploadPDF"; // Archivo con extension .pdf
    public idDZc = "#dZUploadManXML"; // Archivo con extension .xml
    public idDZd = "#dZUploadManPDF"; // Archivo con extension .pdf
    public idDZe = "#dZUploadArOpG"; //Archivos con extension .pdf, .xml, jpg, jpeg, png, doc, docx, xlt, xls
    public nombreFactXML: string;
    public nombreFactPDF: string;
    public nombreFactXMLO: string;
    public nombreFactPDFO: string;
    public nombreArOpG: string;
    public cond: boolean = false; // Verdadero para renombrar, Falso para no renombrar


    @ViewChild('autocompleteTComprobanteIngreso') autocompleteTCompIngreso: AutocompleteGenericComponent;
    @ViewChild('autocompleteTConceptos') autocompleteTConceptos: AutocompleteGenericComponent;
    @ViewChild('autocompleteTrabajador') autocompleteTrabajador: AutocompleteGenericComponent;
    @ViewChild('autocompleteCuenta') autocompleteCuenta: AutocompleteGenericComponent;
    @ViewChild('autocompleteTCaja') autocompleteTCaja: AutocompleteGenericComponent;



    constructor(private ingresoEgresoService: IngresoEgresoService, private _fb: FormBuilder, private dropzoneService: DropzoneService, private _state: GlobalState) { }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormularioEgresos();
        this.initFormQuery();
        this.buscar();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioEgresos() {
        this.formularioIngresoEgreso = new FormGroup({
            id: new FormControl(),
            archivoPdf: new FormControl(),
            archivoXml: new FormControl(),
            fecha: new FormControl(),
            tipo: new FormControl(),
            monto: new FormControl(),
            subtotal: new FormControl(),
            total: new FormControl(),
            iva: new FormControl(),
            estatus: new FormControl(),
            tipoPago: new FormControl(),
            tipoImpuesto: new FormControl(),
            tipoComprobante: new FormControl(),
            cuenta: new FormControl(),
            banco: new FormControl(),
            empresa: new FormControl(),
            cheque: new FormControl(),
            concepto: new FormControl(),
            tipoPagoText: new FormControl(),
            tipoImpuestoText: new FormControl(),
            nombreCliente: new FormControl(),
            rfcCliente: new FormControl(),
            ivaRetenido: new FormControl(),
            isrRetenido: new FormControl(),
            archivo: new FormControl(),
            tipoEgreso: new FormControl(),
            nombreProveedor: new FormControl(),
            rfcProveedor: new FormControl(),
            cliente: new FormControl(),
            proveedor: new FormControl(),
            caja: new FormControl(),
            trabajador: new FormControl(),
            pago: new FormControl(),


        });
        this.addRequiredValidator('rfcProveedor', this.formularioIngresoEgreso);
        this.addRequiredValidator('fecha', this.formularioIngresoEgreso);
        this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);
        this.addRequiredValidator('subtotal', this.formularioIngresoEgreso);
        this.addRequiredValidator('iva', this.formularioIngresoEgreso);
        this.addRequiredValidator('total', this.formularioIngresoEgreso);
    }

    dropzone() {
        this.eventosDropzone.subscribe(
            (data: { id: string, evento: string, valor: string }) => {
                // console.log("DATA: ", data.id , ", ", data.evento, ", ", data.valor);
                if (data.id == this.idDZa) {
                    this.nombreFactXML = data.valor;
                    console.log("Nombre: ", this.nombreFactXML);
                }
                if (data.id == this.idDZb) {
                    this.nombreFactPDF = data.valor;
                    console.log("Nombre: ", this.nombreFactPDF);
                }
                if (data.id == this.idDZc) {
                    this.nombreFactXMLO = data.valor;
                    console.log("Nombre: ", this.nombreFactXMLO);
                }
                if (data.id == this.idDZd) {
                    this.nombreFactPDFO = data.valor;
                    console.log("Nombre: ", this.nombreFactPDFO);
                }
                if (data.id == this.idDZe) {
                    this.nombreArOpG = data.valor;
                    console.log("Nombre: ", this.nombreArOpG);
                }
            });
        this.dropzoneService.dropzone(this.idDZa, this.tArchivo, this.arAcept, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
        this.dropzoneService.dropzone(this.idDZb, this.tArchivoa, this.arAcepta, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
        this.dropzoneService.dropzone(this.idDZc, this.tArchivo, this.arAcept, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
        this.dropzoneService.dropzone(this.idDZd, this.tArchivoa, this.arAcepta, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
        this.dropzoneService.dropzone(this.idDZe, this.tArchivob, this.arAceptb, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
    }

    jsAddI() {
        $(function() {
            $(document).on('click', '.btn-add', function(e) {
                e.preventDefault();
                var controlForm = $('.controls'),
                    currentEntry = $(this).parents('.entry:first'),
                    newEntry = $(currentEntry.clone()).appendTo(controlForm);
                newEntry.find('input').val('');
                controlForm.find('.entry:not(:last) .btn-add')
                    .removeClass('btn-add').addClass('btn-remove')
                    .removeClass('btn-success').addClass('btn-danger')
                    .html('<span class="glyphicon glyphicon-minus"></span>');
            }).on('click', '.btn-remove', function(e) {
                $(this).parents('.entry:first').remove();
                e.preventDefault();
                return false;
            });
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryIngresosEgresos': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryIngresosEgresos = data.queryIngresosEgresos;
                this.buscar();
            });
    }

    buscar() {
        this.ingresoEgresoService.getIngresoEgresos(this.queryIngresosEgresos, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, true).subscribe(
            (dataEgresos) => {
                this.totalIngresoEgreso = dataEgresos.total;
                this.data = dataEgresos.data;
            }, (errorEgreso) => {
            }
        )
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


    tipoPago(tipoPago) {
        //console.log("entro aqui mijo", tipoPago);

        if (tipoPago == "transferencia") {
            //console.log("entro aqui mijo", tipoPago);

            document.getElementById('cuenta').style.display = 'block';
            document.getElementById('cheque').style.display = 'none';
            document.getElementById('caja').style.display = 'none';

            this.tipoPagos = 2;
            //console.log(this.tipoComprobante);


            // $('.cuenta').modal('show');      
        } else if (tipoPago == "cheque") {
            document.getElementById('cuenta').style.display = 'block';
            document.getElementById('cheque').style.display = 'block';
            this.tipoPagos = 3;


            // $('#cheque').modal('show');      

        } else {
            document.getElementById('caja').style.display = 'block';
            document.getElementById('cheque').style.display = 'none';
            document.getElementById('cuenta').style.display = 'none';
            this.tipoPagos = 1;


        }

    }

    limpia() {
        this.formularioIngresoEgreso.reset();
    }

    onSelectedTComprobanteIngresos(tipoComprobante: any) {
        if (tipoComprobante !== undefined && tipoComprobante != null && tipoComprobante > 0) {
            this.formularioIngresoEgreso.get('tipoComprobante').setValue(tipoComprobante);

        }
        else {
            this.formularioIngresoEgreso.get('tipoComprobante').setValue(0);
        }
    }

    onSelectedTConceptos(concepto: any) {
        if (concepto !== undefined && concepto != null && concepto > 0) {
            this.formularioIngresoEgreso.get('concepto').setValue(concepto);

        }
        else {
            this.formularioIngresoEgreso.get('concepto').setValue(0);
        }
    }

    onSelectedTrabajador(trabajador: any) {
        if (trabajador !== undefined && trabajador != null && trabajador > 0) {
            this.formularioIngresoEgreso.get('trabajador').setValue(trabajador);

        }
        else {
            this.formularioIngresoEgreso.get('trabajador').setValue(0);
        }
    }

    onSelectedTCaja(caja: any) {
        if (caja !== undefined && caja != null && caja > 0) {
            this.formularioIngresoEgreso.get('caja').setValue(caja);

        }
        else {
            this.formularioIngresoEgreso.get('caja').setValue(0);
        }
    }



    onAgregarEgresos(valor) {
        //console.log("OBTENGO VALORS",valor);
        this.jsAddI();
        this.dropzone();

        let agregar_egresosc: IngresoEgreso = new IngresoEgreso();
        agregar_egresosc.tipoComprobante = new TipoComprobante;

        agregar_egresosc.fecha = new Date(this.formularioIngresoEgreso.get('fecha').value).getTime();
        agregar_egresosc.conceptos = this.formularioIngresoEgreso.get('concepto').value;


        if (valor == 4) {
            agregar_egresosc.trabajador = new Trabajador;

            agregar_egresosc.trabajador.id = this.formularioIngresoEgreso.get('trabajador').value;
            agregar_egresosc.tipoPago = this.tipoPagos;
            agregar_egresosc.subtotal = ((this.formularioIngresoEgreso.get('total').value) / 116) * 100;
            agregar_egresosc.iva = ((this.formularioIngresoEgreso.get('total').value) / 116) * 16;
            agregar_egresosc.total = this.formularioIngresoEgreso.get('total').value;
            agregar_egresosc.nombreProveedor = "OTROS EGRESOS";

            if (this.tipoPagos == 2 || this.tipoPagos == 3) {
                agregar_egresosc.cuenta = new Cuenta;
                agregar_egresosc.cuenta.id = this.formularioIngresoEgreso.get('cuenta').value;
            }
            if (this.tipoPagos == 1) {
                agregar_egresosc.caja = new Caja;
                agregar_egresosc.caja.id = this.formularioIngresoEgreso.get('caja').value;
            }
            agregar_egresosc.rfcProveedor = this.formularioIngresoEgreso.get('rfcProveedor').value;
            agregar_egresosc.tipoImpuesto = this.impuesto;




        }
        if (valor == 2) {
            agregar_egresosc.subtotal = this.formularioIngresoEgreso.get('subtotal').value;
            agregar_egresosc.iva = this.formularioIngresoEgreso.get('iva').value;
            agregar_egresosc.total = this.formularioIngresoEgreso.get('total').value;
            agregar_egresosc.nombreProveedor = this.formularioIngresoEgreso.get('nombreProveedor').value;

        }
        //



        // console.log("VALOR", this.tipoComprobante);


        if (this.tipoComprobante == 0) {
            agregar_egresosc.tipoComprobante.id = this.formularioIngresoEgreso.get('tipoComprobante').value;

        } else {
            agregar_egresosc.tipoComprobante.id = this.tipoComprobante;
        }

        //agregar_egresosc.rfcProveedor = this.formularioIngresoEgreso.get('rfcProveedor').value;
        //


        agregar_egresosc.tipo = true;

        //console.log(agregar_egresosc);


        this.ingresoEgresoService.create(agregar_egresosc).then((dato) => {
            this.buscar();
            console.log("Si hace la inseccion");

        }).catch((error) => {
            alert("Error");
        });
        $('#EgresoSComprobante').modal('hide');

    }

    exportarExcel() {

    }

    otrosEgresos(valor) {
        this.jsAddI();
        this.dropzone();
        this.tipoComprobante = valor;
        //console.log(this.tipoComprobante);

        if (valor == 12) {
            document.getElementById('nombreProveedor').style.display = 'none';
            //this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);
            this.removeValidators('nombreProveedor', this.formularioIngresoEgreso);


            document.getElementById('rfcProveedor').style.display = 'none';
            //this.addRequiredValidator('rfcProveedor', this.formularioIngresoEgreso);
            this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);


            document.getElementById('trabajador').style.display = 'block';
            this.addRequiredValidator('trabajador', this.formularioIngresoEgreso);
            //this.removeValidators('trabajador', this.formularioIngresoEgreso);

            document.getElementById('imss').style.display = 'none';
            document.getElementById('sat').style.display = 'none';
            document.getElementById('tesoreria').style.display = 'none';
            document.getElementById('infonavit').style.display = 'none';

            document.getElementById('dZUploadPDF').style.display = 'none';
            document.getElementById('dZUploadXML').style.display = 'none';
            document.getElementById('xml').style.display = 'none';
            document.getElementById('pdf').style.display = 'none';



        }

        if (valor == 13) {
            document.getElementById('nombreProveedor').style.display = 'block';
            this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);

            document.getElementById('rfcProveedor').style.display = 'block';
            this.addRequiredValidator('rfcProveedor', this.formularioIngresoEgreso);

            document.getElementById('trabajador').style.display = 'none';
            this.removeValidators('trabajador', this.formularioIngresoEgreso);

            document.getElementById('imss').style.display = 'none';
            document.getElementById('sat').style.display = 'none';
            document.getElementById('tesoreria').style.display = 'none';
            document.getElementById('infonavit').style.display = 'none';

            document.getElementById('dZUploadXML').style.display = 'none';
            document.getElementById('dZUploadPDF').style.display = 'none';
            document.getElementById('xml').style.display = 'none';
            document.getElementById('pdf').style.display = 'none';

        }
        if (valor == 14) {
            document.getElementById('nombreProveedor').style.display = 'none';
            //this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);
            this.removeValidators('nombreProveedor', this.formularioIngresoEgreso);


            document.getElementById('rfcProveedor').style.display = 'none';
            //this.addRequiredValidator('rfcProveedor', this.formularioIngresoEgreso);
            this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

            document.getElementById('trabajador').style.display = 'none';
            this.removeValidators('trabajador', this.formularioIngresoEgreso);

            document.getElementById('imss').style.display = 'block';
            document.getElementById('sat').style.display = 'block';
            document.getElementById('tesoreria').style.display = 'block';
            document.getElementById('infonavit').style.display = 'block';

            document.getElementById('dZUploadPDF').style.display = 'block';
            document.getElementById('dZUploadXML').style.display = 'block';
            document.getElementById('xml').style.display = 'block';
            document.getElementById('pdf').style.display = 'block';

        }
        if (valor == 15) {
            document.getElementById('nombreProveedor').style.display = 'none';
            //this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);
            this.removeValidators('nombreProveedor', this.formularioIngresoEgreso);


            document.getElementById('rfcProveedor').style.display = 'none';
            //this.addRequiredValidator('rfcProveedor', this.formularioIngresoEgreso);
            this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

            document.getElementById('trabajador').style.display = 'none';
            this.removeValidators('trabajador', this.formularioIngresoEgreso);


            document.getElementById('imss').style.display = 'none';
            document.getElementById('sat').style.display = 'none';
            document.getElementById('tesoreria').style.display = 'none';
            document.getElementById('infonavit').style.display = 'none';

            document.getElementById('dZUploadPDF').style.display = 'block';
            document.getElementById('dZUploadXML').style.display = 'block';
            document.getElementById('xml').style.display = 'block';
            document.getElementById('pdf').style.display = 'block';
        }


    }



    newFunction(numero) {


        if (numero == 1) {
            // console.log("entra al false");
            this.inventario = false;

        } else {
            //console.log("entra al true");

            this.inventario = true;

        }
    }

    // Remueve las validaciones para el campo recibido el formulario,formularioIngresoEgreso 
    removeValidators(campo: string, form: FormGroup) {
        form.controls[campo].clearValidators();
        form.controls[campo].updateValueAndValidity();
        //console.log('Quitando validator');
    }

    // Agrega campo requerido 
    addRequiredValidator(campo: string, form: FormGroup) {
        form.controls[campo].setValidators(Validators.required);
        form.controls[campo].updateValueAndValidity();
    }

    onCuentaSelected(cuenta: any) {
        if (cuenta !== undefined && cuenta != null && cuenta > 0) {
            this.formularioIngresoEgreso.get('cuenta').setValue(cuenta);
        } else {
            this.formularioIngresoEgreso.get('cuenta').setValue(0);
        }
    }

    limpiaECCFDI() {
        this.jsAddI();
        this.dropzone();
        this.formularioIngresoEgreso.reset();
        this.ischeck = 1;

        document.getElementById('tipoComprobante').style.display = 'block';
        document.getElementById('otrosEgresostp').style.display = 'none';
        document.getElementById('otrosEgresostext').style.display = 'none';

        this.addRequiredValidator('tipoComprobante', this.formularioIngresoEgreso);

        document.getElementById('gridRadios').style.display = 'block';
        document.getElementById('gridRadios1').style.display = 'block';
        document.getElementById('gridRadios2').style.display = 'block';
        // this.addRequiredValidator('gridRadios', this.formularioIngresoEgreso);

        document.getElementById('fecha').style.display = 'none';
        this.removeValidators('fecha', this.formularioIngresoEgreso);

        document.getElementById('nombreProveedor').style.display = 'none';
        this.removeValidators('nombreProveedor', this.formularioIngresoEgreso);

        document.getElementById('trabajador').style.display = 'none';
        this.removeValidators('trabajador', this.formularioIngresoEgreso);

        document.getElementById('rfcProveedor').style.display = 'none';
        this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

        document.getElementById('subtotal').style.display = 'none';
        this.removeValidators('subtotal', this.formularioIngresoEgreso);

        document.getElementById('iva').style.display = 'none';
        this.removeValidators('iva', this.formularioIngresoEgreso);

        document.getElementById('total').style.display = 'none';
        this.removeValidators('total', this.formularioIngresoEgreso);

        document.getElementById('concepto').style.display = 'none';
        this.removeValidators('concepto', this.formularioIngresoEgreso);

        document.getElementById('tablainventario').style.display = 'none';
        document.getElementById('transferencia').style.display = 'none';
        document.getElementById('cheque').style.display = 'none';
        document.getElementById('efectivo').style.display = 'none';
        document.getElementById('chequebox').style.display = 'none';



    }

    limpiaAESC() {
        this.jsAddI();
        this.dropzone();
        this.formularioIngresoEgreso.reset();
        this.ischeck = 2;
        document.getElementById('tipoComprobante').style.display = 'block';
        document.getElementById('otrosEgresostp').style.display = 'none';
        document.getElementById('otrosEgresostext').style.display = 'none';

        this.addRequiredValidator('tipoComprobante', this.formularioIngresoEgreso);

        document.getElementById('gridRadios').style.display = 'none';
        document.getElementById('gridRadios1').style.display = 'none';
        document.getElementById('gridRadios2').style.display = 'none';

        // this.removeValidators('gridRadios', this.formularioIngresoEgreso);

        document.getElementById('fecha').style.display = 'block';
        this.addRequiredValidator('fecha', this.formularioIngresoEgreso);

        document.getElementById('nombreProveedor').style.display = 'block';
        this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);

        document.getElementById('rfcProveedor').style.display = 'none';
        this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

        document.getElementById('subtotal').style.display = 'block';
        this.addRequiredValidator('subtotal', this.formularioIngresoEgreso);

        document.getElementById('iva').style.display = 'block';
        this.addRequiredValidator('iva', this.formularioIngresoEgreso);

        document.getElementById('total').style.display = 'block';
        this.addRequiredValidator('total', this.formularioIngresoEgreso);

        document.getElementById('trabajador').style.display = 'none';
        this.removeValidators('trabajador', this.formularioIngresoEgreso);

        document.getElementById('concepto').style.display = 'block';
        this.addRequiredValidator('concepto', this.formularioIngresoEgreso);

        document.getElementById('tablainventario').style.display = 'none';
        document.getElementById('transferencia').style.display = 'none';
        document.getElementById('cheque').style.display = 'none';
        document.getElementById('efectivo').style.display = 'none';
        document.getElementById('chequebox').style.display = 'none';


    }
    inventarioTabla(valor) {
        this.jsAddI();
        this.dropzone();
        if (valor == 1) {
            this.formularioIngresoEgreso.reset();
            this.ischeck = 3;
            this.inventario = false;

            document.getElementById('tablainventario').style.display = 'block';
            document.getElementById('otrosEgresostp').style.display = 'none';
            document.getElementById('otrosEgresostext').style.display = 'none';



            document.getElementById('tipoComprobante').style.display = 'none';
            this.removeValidators('tipoComprobante', this.formularioIngresoEgreso);

            document.getElementById('gridRadios').style.display = 'none';
            document.getElementById('gridRadios1').style.display = 'none';
            document.getElementById('gridRadios2').style.display = 'none';
            // this.addRequiredValidator('gridRadios', this.formularioIngresoEgreso);

            document.getElementById('fecha').style.display = 'none';
            this.removeValidators('fecha', this.formularioIngresoEgreso);

            document.getElementById('nombreProveedor').style.display = 'none';
            this.removeValidators('nombreProveedor', this.formularioIngresoEgreso);

            document.getElementById('rfcProveedor').style.display = 'none';
            this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

            document.getElementById('subtotal').style.display = 'none';
            this.removeValidators('subtotal', this.formularioIngresoEgreso);

            document.getElementById('iva').style.display = 'none';
            this.removeValidators('iva', this.formularioIngresoEgreso);

            document.getElementById('total').style.display = 'none';
            this.removeValidators('total', this.formularioIngresoEgreso);

            document.getElementById('trabajador').style.display = 'none';
            this.removeValidators('trabajador', this.formularioIngresoEgreso);

            document.getElementById('concepto').style.display = 'none';
            this.removeValidators('concepto', this.formularioIngresoEgreso);

            document.getElementById('transferencia').style.display = 'none';
            //document.getElementById('cheque').style.display = 'none';
            document.getElementById('efectivo').style.display = 'none';
            document.getElementById('chequebox').style.display = 'none';
            document.getElementById('tablainventario').style.display = 'none';


        }

    }

    limpiaOE() {
        this.jsAddI();
        this.dropzone();
        this.ischeck = 4;

        this.inventario = false;

        document.getElementById('tablainventario').style.display = 'none';
        document.getElementById('otrosEgresostp').style.display = 'block';
        document.getElementById('otrosEgresostext').style.display = 'block';


        document.getElementById('tipoComprobante').style.display = 'none';
        //this.addRequiredValidator('tipoComprobante', this.formularioIngresoEgreso);
        this.removeValidators('tipoComprobante', this.formularioIngresoEgreso);


        document.getElementById('gridRadios').style.display = 'none';
        document.getElementById('gridRadios1').style.display = 'none';
        document.getElementById('gridRadios2').style.display = 'none';
        // this.addRequiredValidator('gridRadios', this.formularioIngresoEgreso);

        document.getElementById('fecha').style.display = 'block';
        this.addRequiredValidator('fecha', this.formularioIngresoEgreso);

        document.getElementById('nombreProveedor').style.display = 'none';
        this.removeValidators('nombreProveedor', this.formularioIngresoEgreso);

        document.getElementById('rfcProveedor').style.display = 'none';
        this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

        document.getElementById('subtotal').style.display = 'none';
        this.removeValidators('subtotal', this.formularioIngresoEgreso);

        document.getElementById('iva').style.display = 'none';
        this.removeValidators('iva', this.formularioIngresoEgreso);

        document.getElementById('total').style.display = 'block';
        this.addRequiredValidator('total', this.formularioIngresoEgreso);

        document.getElementById('trabajador').style.display = 'block';
        this.addRequiredValidator('trabajador', this.formularioIngresoEgreso);

        document.getElementById('concepto').style.display = 'block';
        this.addRequiredValidator('concepto', this.formularioIngresoEgreso);

        document.getElementById('transferencia').style.display = 'none';
        //document.getElementById('cheque').style.display = 'none';
        document.getElementById('efectivo').style.display = 'none';
        document.getElementById('chequebox').style.display = 'none';


    }

    onClick_elim(entity: any) {
        this.formularioIngresoEgreso.reset();
        this.entidad_elimar = entity;
    }

    removeEgreso(id: number) {
        this.ingresoEgresoService.remove(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            console.log(error);
        });
        $('#eliminar').modal('hide');
    }

    prepareEdit(entity_edit: any) {
        this.ischeck = 5;

        document.getElementById('tablainventario').style.display = 'none';
        document.getElementById('otrosEgresostp').style.display = 'none';
        document.getElementById('otrosEgresostext').style.display = 'none';


        document.getElementById('tipoComprobante').style.display = 'none';
        //this.addRequiredValidator('tipoComprobante', this.formularioIngresoEgreso);
        this.removeValidators('tipoComprobante', this.formularioIngresoEgreso);


        document.getElementById('gridRadios').style.display = 'none';
        document.getElementById('gridRadios1').style.display = 'none';
        document.getElementById('gridRadios2').style.display = 'none';
        // this.addRequiredValidator('gridRadios', this.formularioIngresoEgreso);

        document.getElementById('fecha').style.display = 'none';
        this.removeValidators('fecha', this.formularioIngresoEgreso);


        document.getElementById('nombreProveedor').style.display = 'block';
        this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);

        document.getElementById('rfcProveedor').style.display = 'none';
        this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

        document.getElementById('subtotal').style.display = 'block';
        this.addRequiredValidator('subtotal', this.formularioIngresoEgreso);

        document.getElementById('iva').style.display = 'block';
        this.addRequiredValidator('iva', this.formularioIngresoEgreso);

        document.getElementById('total').style.display = 'block';
        this.addRequiredValidator('total', this.formularioIngresoEgreso);

        document.getElementById('trabajador').style.display = 'none';
        this.removeValidators('trabajador', this.formularioIngresoEgreso);


        document.getElementById('concepto').style.display = 'block';
        this.addRequiredValidator('concepto', this.formularioIngresoEgreso);

        document.getElementById('transferencia').style.display = 'none';
        //document.getElementById('cheque').style.display = 'none';
        document.getElementById('efectivo').style.display = 'none';
        document.getElementById('chequebox').style.display = 'none';

        this.onClick_edit(entity_edit);
        if (entity_edit.concepto.id && entity_edit.concepto.id > 0) {
            //console.log("CODIGO POSTAL "+entity_edit.concepto.id);
            this.autocompleteTConceptos.getDetalle(entity_edit.concepto.id);
            this.formularioIngresoEgreso.get('concepto').setValue(entity_edit.concepto.id);
            //console.log(this.formularioIngresoEgreso);
        }
    }

    onClick_edit(entity_edit: any) {
        this.formularioIngresoEgreso.reset();
        //console.log(entity_edit);
        console.log("DATOS", entity_edit);


        this.formularioIngresoEgreso.get('nombreProveedor').setValue(entity_edit.nombreProveedor);
        this.formularioIngresoEgreso.get('subtotal').setValue(entity_edit.subtotal);
        this.formularioIngresoEgreso.get('iva').setValue(entity_edit.iva);
        this.formularioIngresoEgreso.get('total').setValue(entity_edit.total);
        this.formularioIngresoEgreso.get('concepto').setValue(entity_edit.concepto.id);

        this.formularioIngresoEgreso.get('fecha').setValue(entity_edit.fecha);
        this.formularioIngresoEgreso.get('monto').setValue(entity_edit.monto);


        // this.formularioIngresoEgreso.get('trabajador').setValue(entity_edit.trabajador.id);
        //this.formularioIngresoEgreso.get('nombreProveedor').setValue(entity_edit.nombreProveedor);
        //this.formularioIngresoEgreso.get('tipoComprobante').setValue(entity_edit.tipoComprobante.id);
        //this.formularioIngresoEgreso.get('caja').setValue(entity_edit.caja.id);
        //this.formularioIngresoEgreso.get('cuenta').setValue(entity_edit.caja.id);
        //this.formularioIngresoEgreso.get('rfcProveedor').setValue(entity_edit.caja.id);


        this.fechaEditar = entity_edit.fecha;
        this.tipoComprobanteEditar = entity_edit.tipoComprobante.id;
        this.cajaEditar = entity_edit.caja.id;
        this.cuentaEditar = entity_edit.cuenta.id;
        this.rfcProveedorEditar = entity_edit.rfcProveedor;


        this.ideditar = entity_edit.id;


    }

    impuestos(impuesto) {
        this.impuesto = impuesto;
    }

    enviarFormularios(valor) {
        if (valor == 5) {
            this.onEditarEgresos();
        } else {
            this.onAgregarEgresos(valor);
        }
    }

    onEditarEgresos() {
        let editar_egresos: IngresoEgreso = new IngresoEgreso();
        editar_egresos.tipoComprobante = new TipoComprobante;
        editar_egresos.caja = new Caja;
        editar_egresos.cuenta = new Cuenta;
        editar_egresos.empresa = new Empresa;
        editar_egresos.fecha = new Date(this.formularioIngresoEgreso.get('fecha').value).getTime();
        editar_egresos.nombreProveedor = this.formularioIngresoEgreso.get('nombreProveedor').value;
        editar_egresos.subtotal = this.formularioIngresoEgreso.get('subtotal').value;
        editar_egresos.total = this.formularioIngresoEgreso.get('total').value;
        editar_egresos.iva = this.formularioIngresoEgreso.get('iva').value;
        editar_egresos.conceptos = this.formularioIngresoEgreso.get('concepto').value;

        editar_egresos.fecha = this.fechaEditar;
        editar_egresos.tipoComprobante.id = this.tipoComprobanteEditar;
        editar_egresos.caja.id = this.cajaEditar;
        editar_egresos.cuenta.id = this.cuentaEditar;
        editar_egresos.rfcProveedor = this.rfcProveedorEditar;
        editar_egresos.id = this.ideditar;

        editar_egresos.empresa.id = 1;

        editar_egresos.tipo = true;
        console.log(editar_egresos);

        this.ingresoEgresoService.update(editar_egresos).then((dato) => {
            this.buscar();
            console.log("SI modifica esta cosa");

        }).catch((error) => {
            alert("Error");
        });
        $('#EgresoSComprobante').modal('hide');

    }

    pago(entity_edit: any) {
        this.ischeck = 6;

        console.log("Entra Aqui al 6");
        this.formularioIngresoEgreso.reset();

        //document.getElementById('nombreProveedor').getAttribute("disabled");

        document.getElementById('tablainventario').style.display = 'none';
        document.getElementById('otrosEgresostp').style.display = 'none';
        document.getElementById('otrosEgresostext').style.display = 'none';


        document.getElementById('tipoComprobante').style.display = 'none';
        //this.addRequiredValidator('tipoComprobante', this.formularioIngresoEgreso);
        this.removeValidators('tipoComprobante', this.formularioIngresoEgreso);


        document.getElementById('gridRadios').style.display = 'none';
        document.getElementById('gridRadios1').style.display = 'none';
        document.getElementById('gridRadios2').style.display = 'none';
        // this.addRequiredValidator('gridRadios', this.formularioIngresoEgreso);

        document.getElementById('fecha').style.display = 'none';
        this.removeValidators('fecha', this.formularioIngresoEgreso);


        document.getElementById('nombreProveedor').style.display = 'block';
        document.getElementById('nombreProveedorD').setAttribute("disabled", "disabled");
        //document.getElementById('nombreProveedor').getAttribute("disabled");
        this.addRequiredValidator('nombreProveedor', this.formularioIngresoEgreso);

        document.getElementById('rfcProveedor').style.display = 'none';
        this.removeValidators('rfcProveedor', this.formularioIngresoEgreso);

        document.getElementById('subtotal').style.display = 'none';
        this.removeValidators('subtotal', this.formularioIngresoEgreso);


        document.getElementById('iva').style.display = 'none';
        this.removeValidators('iva', this.formularioIngresoEgreso);


        document.getElementById('total').style.display = 'block';
        this.addRequiredValidator('total', this.formularioIngresoEgreso);
        document.getElementById('totalD').setAttribute("disabled", "disabled");



        document.getElementById('trabajador').style.display = 'none';
        this.removeValidators('trabajador', this.formularioIngresoEgreso);


        document.getElementById('concepto').style.display = 'block';
        this.addRequiredValidator('concepto', this.formularioIngresoEgreso);
        document.getElementById('conceptoD').setAttribute("disabled", "disabled");


        document.getElementById('transferencia').style.display = 'block';
        //document.getElementById('cheque').style.display = 'block';
        document.getElementById('efectivo').style.display = 'block';
        document.getElementById('chequebox').style.display = 'block';

        document.getElementById('fechapago').style.display = 'block';
        document.getElementById('montoPagado').style.display = 'block';



        this.onClick_edit(entity_edit);
        if (entity_edit.concepto.id && entity_edit.concepto.id > 0) {
            //console.log("CODIGO POSTAL "+entity_edit.concepto.id);
            this.autocompleteTConceptos.getDetalle(entity_edit.concepto.id);
            this.formularioIngresoEgreso.get('concepto').setValue(entity_edit.concepto.id);
            //console.log(this.formularioIngresoEgreso);
        }
    }


}
