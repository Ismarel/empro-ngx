import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IngresoEgreso } from 'app/entidades/ingreso-egreso';
import { IngresoEgresoService } from 'app/servicios-backend/ingreso-egreso.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GlobalState } from '../../global.state';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Empresa } from 'app/entidades/empresa';
import { TipoComprobante } from '../../entidades/tipo-comprobante';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { Cuenta } from '../../entidades/cuenta';
import { Banco } from 'app/entidades/banco';
import { Cheques } from '../../entidades/cheques';
import { Concepto } from '../../entidades/concepto';
import { Subject } from 'rxjs/Subject';
import { DropzoneService } from '../../servicios-backend/dropzone.service';
import { Caja } from 'app/entidades/caja';
import { HttpHelper } from "../../../app/http-helper";

import { NgbDateStruct, NgbCalendar, NgbDatepickerConfig, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { CuentaService } from '../../servicios-backend/cuenta.service';
import { isUndefined } from 'util';
import { CajaService } from '../../servicios-backend/caja.service';
import { CobroPago } from '../../entidades/cobro-pago';
import { DISABLED } from '@angular/forms/src/model';
import { EmpresaService } from '../../servicios-backend/empresa.service';
import { MailService } from '../../servicios-backend/mail.service';


@Component({
    selector: 'app-ingresos',
    templateUrl: './ingresos.component.html',
    styleUrls: ['./ingresos.component.scss']
})
export class IngresosComponent implements OnInit, OnDestroy {

    montoActual: any;
    errorMonto: boolean = false;
    public form: FormGroup;
    public archivoPdf: AbstractControl;
    public archivoXml: AbstractControl;
    public fecha: AbstractControl;
    public tipo: AbstractControl;
    public monto: AbstractControl;
    public subtotal: AbstractControl;
    public total: AbstractControl;
    public iva: AbstractControl;
    public estatus: AbstractControl;
    public tipoPago: AbstractControl;
    public tipoImpuesto: AbstractControl;
    public tipoComprobante: AbstractControl;
    public cuenta: AbstractControl;
    public banco: AbstractControl;
    public empresa: AbstractControl;
    public cheque: AbstractControl;
    public caja: AbstractControl;
    public concepto: AbstractControl;
    public tipoPagoText: AbstractControl;
    public tipoImpuestoText: AbstractControl;
    public nombreCliente: AbstractControl;
    public rfcCliente: AbstractControl;
    public ivaRetenido: AbstractControl;
    public isrRetenido: AbstractControl;
    public archivo: AbstractControl;
    public tipoEgreso: AbstractControl;
    public nombreProveedor: AbstractControl;
    public rfcProveedor: AbstractControl;
    public cliente: AbstractControl;
    public proveedor: AbstractControl;
    public cobroPagoList: AbstractControl;
    public mensajeError: string;
    public error: boolean;
    formularioFilterQuery: FormGroup;
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalIngresos: number = 0;
    query: string = '';
    tipoa: boolean;
    data: IngresoEgreso[];
    datos: Observable<any>;
    delayBeforeSearch: number = 400;
    querySubscription$: Subscription;
    isEdit: boolean = false;
    entidad_elimar: IngresoEgreso;
    entidad_update: IngresoEgreso;
    idTipoComprobante: number;
    div: any;
    isCosa: number = 0;
    public eventosDropzone: Subject<{ id: String, evento: String, valor: String }> = new Subject();
    public tArchivo: string = ".xml";
    public arAcept: string = ".xml";
    public tArchivoa: string = ".pdf";
    public arAcepta: string = ".pdf";
    public tArchivob: string = ""; // Acepta cualquier archivo, siempre y cuando la condicion (cond) sea falsa
    public arAceptb: string = ".pdf,.xml,.jpg,.jpeg,.png,.doc,.docx,.xlt,.xls";
    public tipob = "/upload";
    public modulo = '6';
    public submodulo = ''; // Carpeta
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
    public opcion: number = 0;
    public checkCuenta: number = 0;
    public checkCaja: number = 0;
    public isMenuCollapsed: boolean = false;
    pendientes: boolean = false;
    cuentasDisponibles: Array<Cuenta> = new Array<Cuenta>();
    cajasDisponibles: Caja[];
    hidexmlUploadOption: boolean = false;
    urlImage: string = "";
    imageExist: boolean;
    suscriptionDropzoneEvents: Subscription;
    private downloadFileURL: string = HttpHelper.urlFILEREST + "/download/6/"

    @ViewChild('autocompleteTComprobanteIngreso') autocompleteTCompIngreso: AutocompleteGenericComponent;
    @ViewChild('autocompleteCuenta') autocompleteCuenta: AutocompleteGenericComponent;
    @ViewChild('autocompleteCaja') autocompleteCaja: AutocompleteGenericComponent;
    @ViewChild('autocompleteConcepto') autocompleteConcepto: AutocompleteGenericComponent;
    comprobanteConceptoDisponible: boolean = false;

    constructor(
        private ingresoEgresoService: IngresoEgresoService,
        private fb: FormBuilder,
        private dropzoneService: DropzoneService,
        private calendar: NgbCalendar,
        private config: NgbDatepickerConfig,
        private cuentaService: CuentaService,
        private cajasService: CajaService,
        private empresaService: EmpresaService,
        private mailService: MailService, private _state: GlobalState) {

        this.form = fb.group({
            'archivoPdf': [''],
            'archivoXml': [''],
            'fecha': [''],
            'tipo': [''],
            'monto': ['',
                Validators.pattern('^[0-9]+$')],
            'subtotal': ['',
                Validators.pattern('^[0-9]+$')],
            'total': ['',
                Validators.pattern('^[0-9]+$')],
            'iva': ['',
                Validators.pattern('^[0-9]+$')],
            'estatus': [''],
            'tipoPago': [''],
            'tipoImpuesto': [''],
            'tipoComprobante': [''],
            'cuenta': [''],
            'banco': [''],
            'empresa': [''],
            'caja': [''],
            'concepto': [''],
            'nombreCliente': [''],
            'rfcCliente': [''],
            //[Validators.pattern(/^[A-Z]{3,4}\d{6}(?:[A-Z\d]{3})?$/)]],
            'ivaRetenido': [''],
            'isrRetenido': [''],
            'archivo': [''],
        });


        this.archivoPdf = this.form.controls['archivoPdf'];
        this.archivoXml = this.form.controls['archivoXml'];
        this.fecha = this.form.controls['fecha'];
        this.tipo = this.form.controls['tipo'];
        this.monto = this.form.controls['monto'];
        this.subtotal = this.form.controls['subtotal'];
        this.total = this.form.controls['total'];
        this.iva = this.form.controls['iva'];
        this.estatus = this.form.controls['estatus'];
        this.tipoPago = this.form.controls['tipoPago'];
        this.tipoImpuesto = this.form.controls['tipoImpuesto'];
        this.tipoComprobante = this.form.controls['tipoComprobante'];
        this.cuenta = this.form.controls['cuenta'];
        this.banco = this.form.controls['banco'];
        this.empresa = this.form.controls['empresa'];
        this.caja = this.form.controls['caja'];
        this.concepto = this.form.controls['concepto'];
        this.nombreCliente = this.form.controls['nombreCliente'];
        this.rfcCliente = this.form.controls['rfcCliente'];
        this.ivaRetenido = this.form.controls['ivaRetenido'];
        this.isrRetenido = this.form.controls['isrRetenido'];
        this.archivo = this.form.controls['archivo'];
    }
    tipoComprobanteOption: { id: number, nombre: string }[] = [
        { id: 1, nombre: "Factura" },
        { id: 2, nombre: "Recibo de Honorarios" },
        { id: 3, nombre: "Recibo de renta" },
        { id: 4, nombre: "Nota de remision" },
        { id: 5, nombre: "Aportación al Capital" },
        { id: 6, nombre: "Préstamos" },
        { id: 7, nombre: "Intereses" },
        { id: 8, nombre: "Anticipo" }
    ];

    tipoComprobanteAdd: number;


    compareWith_tipoComprobante(optionOne, optionTwo): boolean {
        if (optionOne != undefined && optionTwo != undefined) {
            return optionOne.id === optionTwo.id;
        }
        return false;
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.initFormQuery();
        this.buscar();
        this.showButtonCobro = true;
        this.ceroesAndBank = false;
        this.ceroesAndEffective = false;
        this.isNotCeroes = false;
        this.showAlertIsMore = false;
        this.showFecha1 = true;
        this.showImporteTotalCobrar = true;
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    ngOnDestroy(): void {
        if (this.suscriptionDropzoneEvents != undefined) {
            this.suscriptionDropzoneEvents.unsubscribe();
        }
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

        var rfcCorrecto = this.rfcValido(rfc);
        if (rfcCorrecto) {
            resultado.classList.add("ok");
        } else {
            resultado.classList.remove("ok");
        }
    }

    dropzone() {
        if (this.suscriptionDropzoneEvents != undefined) {
            this.suscriptionDropzoneEvents.unsubscribe();
        }
        this.suscriptionDropzoneEvents = this.eventosDropzone.subscribe(
            (data: { id: string, evento: string, valor: string }) => {
                console.log(data);
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
        this.empresaService.getDetalle()
            .then((data) => {
                this.submodulo = String(data.id);
                // this.empresa
                this.dropzoneService.dropzone(this.idDZa, this.tArchivo, this.arAcept, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
                this.dropzoneService.dropzone(this.idDZb, this.tArchivoa, this.arAcepta, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
                this.dropzoneService.dropzone(this.idDZc, this.tArchivo, this.arAcept, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
                this.dropzoneService.dropzone(this.idDZd, this.tArchivoa, this.arAcepta, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
                this.dropzoneService.dropzone(this.idDZe, this.tArchivob, this.arAceptb, this.tipob, this.modulo, this.submodulo, this.eventosDropzone, this.cond);
            })
            .catch();
        console.log('==============');

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

    prepareEdit(item: IngresoEgreso) {
        console.log("----------------------------------------");
        // this.form.reset();
        this.form.get("tipoComprobante").setValue(null);
        this.hidexmlUploadOption = false;
        // $('#form').trigger("reset");
        //   this.autocompleteTCompIngreso.prepareAdd();
        this.savePropertiesToEdit(item);
        this.isEdit = true;
        this.isCosa = item.tipoComprobante.id;
        console.log("Comprobante a editar -------", item);
        console.log(item.tipoComprobante.id);
        // this.form.get("tipoComprobante").setValue(7);
        //console.log("DEBE SER 7:",this.form.get("tipoComprobante").value); 
        // this.form.get("tipoComprobante").setValue(String(item.tipoComprobante.id));
        $("#selectComprobante").val(this.itemSavedFor.tipoComprobante.id);

        // this.form.reset();
        // if (item.tipoComprobante.id != undefined && item.tipoComprobante.id > 0) {
        //   setTimeout(()=>{
        //   this.autocompleteTCompIngreso.getDetalle(item.tipoComprobante.id);

        // },80);
        //llenado de valores para editar el ingreso
        // }

        setTimeout(() => {
            $("#selectComprobante").prop("disabled", true);
            this.onClick_edit(item);
        }, 200);

    }


    savePropertiesToEdit(item: IngresoEgreso) {
        this.itemSavedFor = item;
        this.conceptoSaved = item.conceptos;
        this.tipoComprobanteSaved = item.tipoComprobante.nombre;
        this.fechaSaved = item.fecha;
        this.nombreClienteSaved = item.nombreCliente;
        this.rfcClienteSaved = item.rfcCliente;
        this.subtotalSaved = item.subtotal;
        this.ivaSaved = item.iva;
        this.totalSaved = item.total;
        this.cobroPagoListSaved = item.cobroPagoList;

    }

    onClick_edit(entity_edit: IngresoEgreso) {

        console.log("+++++++++++++++++++++++++++++++++");
        this.entidad_update = entity_edit;
        let tipoPago: boolean = false;//banco-> true, efectivo -> false
        let fecha: string = this.changeTimestampToDate(entity_edit.fecha);

        // if (this.entidad_update.concepto.id != undefined && this.entidad_update.concepto.id > 0 && this.entidad_update.tipoComprobante.id != 1) {
        //   setTimeout(() => {
        //     try {
        //       this.autocompleteConcepto.getDetalle(this.entidad_update.concepto.id);
        //       this.form.get("concepto").setValue(this.entidad_update.concepto.id);
        //     } catch (error) {

        //     }
        //     this.autocompleteConcepto.getDetalle(this.entidad_update.concepto.id);
        //     this.form.get("concepto").setValue(this.entidad_update.concepto.id);
        //   }, 200);
        // }

        if (entity_edit.cuenta.id != undefined && entity_edit.cuenta.id != null) {
            tipoPago = true;
            console.log("Cuenta Existente");
        }
        if (entity_edit.caja.id != undefined && entity_edit.caja.id != null) {
            console.log("Caja Existente", entity_edit.caja.id);
        }

        if (entity_edit.archivo != null && entity_edit.archivo != undefined) {
            this.imageExist = true;
            this.urlImage = this.downloadFileURL + entity_edit.empresa.rfc + "/" + entity_edit.archivo;
            console.log(entity_edit.archivo);
            console.log(this.urlImage);

        } else {
            this.imageExist = false;
        }

        //casos para editar ingresos
        if (entity_edit.tipoComprobante.id) {
            switch (entity_edit.tipoComprobante.id) {
                // this.form.get().setValue();
                //(1) factura, (4) Nota de Remision, (8)Anticipo-antes Factura Manual
                case 1:
                    console.log("CArgar ARchivos Dropzone");
                    break;
                case 4:
                case 8:
                    this.dropzone();
                    this.form.get("fecha").setValue(fecha);
                    this.form.get("nombreCliente").setValue(entity_edit.nombreCliente);
                    this.form.get("rfcCliente").setValue(String(entity_edit.rfcCliente));
                    this.form.get("subtotal").setValue(entity_edit.subtotal);
                    this.form.get("iva").setValue(entity_edit.iva);
                    this.form.get("total").setValue(entity_edit.total);
                    this.form.get("concepto").setValue(entity_edit.conceptos);
                    break;
                // (2)Recibo de honorarios,(3) Recibo de renta
                case 2:
                case 3:
                    this.dropzone();
                    console.log(entity_edit.isrRetenido + ".........." + entity_edit.ivaRetenido);
                    this.form.get("fecha").setValue(fecha);
                    this.form.get("nombreCliente").setValue(entity_edit.nombreCliente);
                    this.form.get("rfcCliente").setValue(entity_edit.rfcCliente);
                    this.form.get("subtotal").setValue(entity_edit.subtotal);
                    this.form.get("iva").setValue(entity_edit.iva);
                    this.form.get("total").setValue(entity_edit.total);
                    this.form.get("ivaRetenido").setValue(entity_edit.ivaRetenido);
                    this.form.get("isrRetenido").setValue(entity_edit.isrRetenido);
                    this.form.get("concepto").setValue(entity_edit.conceptos);
                    break;
                // (5)Aportacion al Capital,(6) Prestamos,(7)Intereses
                case 5:
                case 6:
                    this.dropzone();
                    console.log(entity_edit.total);
                    this.autocompleteCaja.cleanCampo();
                    this.autocompleteCuenta.cleanCampo();
                    this.form.get("fecha").setValue(fecha);
                    this.form.get("monto").setValue(String(entity_edit.total));
                    this.form.get("concepto").setValue(entity_edit.conceptos);
                    this.form.get("nombreCliente").setValue(String(entity_edit.nombreCliente));
                    console.log(tipoPago);
                    if (tipoPago) {
                        $("#choice-animals-dogs").prop("checked", true);
                        setTimeout(() => {
                            this.autocompleteCuenta.getDetalle(entity_edit.cuenta.id)
                            this.form.get("cuenta").setValue(entity_edit.cuenta.id);
                        }, 200);
                    } else {
                        // console.log("autocompleteCAJA######################",entity_edit.caja.id);
                        setTimeout(() => {
                            this.autocompleteCaja.getDetalle(entity_edit.caja.id);
                            this.form.get("caja").setValue(entity_edit.caja.id);
                        }, 200);
                        $("#choice-animals-cats").prop("checked", true);
                    }
                    break;
                case 7:
                    this.dropzone();
                    this.autocompleteCaja.cleanCampo();
                    this.autocompleteCuenta.cleanCampo();
                    this.form.get("fecha").setValue(fecha);
                    this.form.get("monto").setValue(entity_edit.total);
                    this.form.get("concepto").setValue(entity_edit.conceptos);
                    this.form.get("nombreCliente").setValue(entity_edit.nombreCliente);
                    if (tipoPago) {
                        $("#choice-animals-dogs").prop("checked", true); this.autocompleteCuenta.getDetalle(entity_edit.cuenta.id)
                        this.form.get("cuenta").setValue(entity_edit.cuenta.id);
                    } else {
                        // console.log("autocompleteCAJA######################",entity_edit.caja.id);
                        setTimeout(() => {
                            this.autocompleteCaja.getDetalle(entity_edit.caja.id);
                            this.form.get("caja").setValue(entity_edit.caja.id);
                        }, 200);
                        $("#choice-animals-cats").prop("checked", true);
                    }

            }
        }

    }
    onClick_elim(entity: any) {
        this.form.reset();
        this.entidad_elimar = entity;
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscar();
    }

    buscar() {
        // this.page = 1;
        console.log(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.tipoa, this.pendientes);

        this.ingresoEgresoService.getIngresoEgresos(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.tipoa, this.pendientes).subscribe(
            (dataBuscar) => {
                console.log(dataBuscar);
                this.data = dataBuscar.data;
                this.totalIngresos = dataBuscar.total;
            }, (errorBuscar) => {

            }
        );

    }
    removeIngreso(id: number) {
        this.ingresoEgresoService.remove(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            console.log(error);
        });
        $('#eliminar').modal('hide');
    }
    addIngreso() {
        console.log("*****************************");

        this.hidexmlUploadOption = false;
        this.isEdit = false;
        this.isCosa = 0;
        this.imageExist = false;
        $('#form').trigger("reset");
        this.form.reset();
        // this.form.controls["tipoComprobante"].enable();
        $("#selectComprobante").prop("disabled", false);
        this.form.get("tipoComprobante").setValue(null);
        //  this.autocompleteTCompIngreso.prepareAdd();
        //    this.autocompleteCuenta.prepareAdd();
        //  this.autocompleteCaja.prepareAdd();
        //this.autocompleteConcepto.prepareAdd();

    }
    onSubmitIngresos() {
        if (this.isEdit) {
            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }
    onSubmitEditar() {

        console.log("Editando..." + this.nombreArOpG);
        let updateIngreso = new IngresoEgreso();
        updateIngreso.tipoComprobante = new TipoComprobante();
        // updateIngreso.concepto = new Concepto();
        updateIngreso.tipo = false;
        updateIngreso.id = this.entidad_update.id;

        if (this.nombreArOpG != this.entidad_update.archivo) {
            console.log("Nuevo Archivo~~~~~~~~~~~~~~" + this.nombreArOpG);
            updateIngreso.archivo = this.nombreArOpG;
        } else {
            console.log("Archivo sin Cambios^^^^^^^^^^^^^^" + this.entidad_update.archivo);
        }
        //casos para editar ingresos
        switch (this.itemSavedFor.tipoComprobante.id) {
            // this.form.get().setValue();
            //(1) factura, (4) Nota de Remision, (8)Anticipo-antes Factura Manual
            case 4:
            case 8:
                console.log("entro", this.itemSavedFor.tipoComprobante.id);
                console.log(this.form.get('tipoComprobante').value);
                updateIngreso.tipoComprobante.id = this.itemSavedFor.tipoComprobante.id;
                updateIngreso.conceptos = this.form.get('concepto').value;
                // updateIngreso.archivoXml = this.nombreFactXMLO;
                updateIngreso.archivo = this.nombreArOpG;
                updateIngreso.fecha = this.changeDateToTimestamp(this.form.get('fecha').value);
                updateIngreso.nombreCliente = this.form.get('nombreCliente').value;
                updateIngreso.rfcCliente = this.form.get('rfcCliente').value;
                updateIngreso.subtotal = this.form.get('subtotal').value;
                updateIngreso.iva = this.form.get('iva').value;
                updateIngreso.total = this.form.get('total').value;
                updateIngreso.monto = this.itemSavedFor.monto;
                updateIngreso.tipoPago = this.entidad_update.tipoPago;

                this.ingresoEgresoService.update(updateIngreso).then((data) => {
                    console.log(data);
                    $('#Ingreso').modal('hide');
                    this.buscar();
                }).catch((error) => {
                    console.log("ERROR: ", error);
                    // this.error = true;
                    // this.mensajeError = "Favor de llenar los campos obligatorios";
                });
                // this.form.get("fecha").setValue(fecha);
                // this.form.get("nombreCliente").setValue(this.entidad_update.nombreCliente);
                // this.form.get("rfcCliente").setValue(this.entidad_update.rfcCliente);
                // this.form.get("subtotal").setValue(this.entidad_update.subtotal);
                // this.form.get("iva").setValue(this.entidad_update.iva);
                // this.form.get("total").setValue(this.entidad_update.total);
                break;
            // (2)Recibo de honorarios,(3) Recibo de renta
            case 2:
            case 3:

                console.log("entro", this.entidad_update.tipoComprobante.id);
                updateIngreso.tipoComprobante.id = this.itemSavedFor.tipoComprobante.id;
                updateIngreso.conceptos = this.form.get('concepto').value;
                updateIngreso.archivo = this.nombreArOpG;
                updateIngreso.fecha = this.changeDateToTimestamp(this.form.get('fecha').value);
                updateIngreso.nombreCliente = this.form.get("nombreCliente").value;
                updateIngreso.rfcCliente = this.form.get("rfcCliente").value;
                updateIngreso.subtotal = this.form.get("subtotal").value;
                updateIngreso.iva = this.form.get("iva").value;
                updateIngreso.total = this.form.get("total").value;
                updateIngreso.ivaRetenido = this.form.get("ivaRetenido").value;
                updateIngreso.isrRetenido = this.form.get("isrRetenido").value;

                this.ingresoEgresoService.update(updateIngreso).then((data) => {
                    console.log(data);
                    $('#Ingreso').modal('hide');
                    this.buscar();
                }).catch((error) => {
                    console.log("ERROR: ", error);
                    // this.error = true;
                    // this.mensajeError = "Favor de llenar los campos obligatorios";
                });
                break;
            // (5)Aportacion al Capital,(6) Prestamos,(7)Intereses
            case 5:
            case 6:
            case 7:
                console.log("entro", this.entidad_update.tipoComprobante.id);
                // updateIngreso.archivoXml = this.nombreFactXMLO;
                updateIngreso.archivo = this.nombreArOpG;
                updateIngreso.tipoComprobante.id = this.itemSavedFor.tipoComprobante.id;
                updateIngreso.conceptos = this.form.get('concepto').value;
                updateIngreso.total = this.form.get("monto").value;
                updateIngreso.fecha = this.changeDateToTimestamp(this.form.get('fecha').value);
                updateIngreso.nombreCliente = this.form.get('nombreCliente').value;

                if (this.autocompleteCaja.idSelected != undefined && this.autocompleteCaja.idSelected != null) {
                    updateIngreso.caja = new Caja();
                    updateIngreso.caja.id = Number(this.autocompleteCaja.idSelected);
                } else {
                    updateIngreso.banco = new Banco();
                    updateIngreso.banco.id = Number(this.autocompleteCuenta.idSelected);
                }
                this.ingresoEgresoService.update(updateIngreso).then((data) => {
                    console.log(data);
                    $('#Ingreso').modal('hide');
                    this.buscar();
                }).catch((error) => {
                    console.log("ERROR: ", error);
                    // this.error = true;
                    // this.mensajeError = "Favor de llenar los campos obligatorios";
                });
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            case 11:
                break;
            case 12:
                break;
            case 13:
                break;
            case 14:
                break;
            case 15:
                break;
        }

    }/* Fin de onSubmitEdit */

    onSubmitAgregar() {
        this.imageExist = false;
        console.log("entro ENVIAR***************isCosa", this.isCosa);
        let datosIngresos = new IngresoEgreso();
        let tipoComprobante = new TipoComprobante();
        let cuenta = new Cuenta();
        let banco = new Banco();
        let empresa = new Empresa();
        let cheque = new Cheques();
        let concepto = new Concepto();
        let caja = new Caja();
        // datosIngresos.caja = null;
        // datosIngresos.cuenta = null;
        // datosIngresos.cheque = null;
        // datosIngresos.banco = null;
        // datosIngresos.cliente = null;
        // datosIngresos.proveedor = null;
        // console.log(this.form.get('monto').value);
        switch (this.isCosa) {
            case 1: {
                if (this.nombreFactXML) {
                    // console.log("Verdadero");
                    // tipoComprobante.id = this.isCosa;
                    tipoComprobante.id = 1;
                    datosIngresos.tipoComprobante = tipoComprobante;
                    datosIngresos.tipo = false;
                    datosIngresos.archivoXml = this.nombreFactXML;
                    this.nombreFactXML = "";
                    // datosIngresos.tipoComprobante.id=1;
                    datosIngresos.fecha = new Date().getTime();

                    if (this.nombreFactPDF) {
                        datosIngresos.archivoPdf = this.nombreFactPDF;
                        this.nombreFactPDF = "";
                    }
                    this.ingresoEgresoService.create(datosIngresos).then((data) => {
                        console.log("DATA: ", data);
                        $('#Ingreso').modal('hide');
                        this.isCosa = 0;
                        this.buscar();
                    }).catch((error) => {
                        console.log(error.json());
                        $('#Ingreso').modal('hide');
                        this.error = true;
                        setTimeout(() => {
                            $('#modalMensaje').modal('show');
                            this.mensajeError = error.json().error;
                        }, 250);
                    });
                    this.page = 1;
                    this.buscar();
                    break;
                }
            }
            case 2: {
                if (this.form.valid) {
                    datosIngresos.tipo = false;
                    tipoComprobante.id = this.isCosa;
                    datosIngresos.tipoComprobante = tipoComprobante;
                    datosIngresos.conceptos = this.form.get('concepto').value;
                    datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                    datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                    datosIngresos.rfcCliente = this.form.get('rfcCliente').value;
                    datosIngresos.subtotal = this.form.get('subtotal').value;
                    datosIngresos.iva = this.form.get('iva').value;
                    datosIngresos.total = this.form.get('total').value;
                    datosIngresos.ivaRetenido = this.form.get('ivaRetenido').value;
                    datosIngresos.isrRetenido = this.form.get('isrRetenido').value;
                    console.log(this.nombreArOpG + new Date().getTime() + "\n" + this.nombreArOpG);
                    datosIngresos.archivo = this.nombreArOpG;
                    this.ingresoEgresoService.create(datosIngresos).then((data) => {
                        console.log("DATA: ", data);
                        $('#Ingreso').modal('hide');
                        this.isCosa = 0;
                        this.page = 1;
                        this.buscar();
                    }).catch((error) => {
                        console.log("ERROR: ", error);
                        this.error = true;
                        this.mensajeError = "Favor de llenar los campos obligatorios";
                    });
                    this.page = 1;
                    this.buscar();
                    break;
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
            case 3: {
                if (this.form.valid) {
                    datosIngresos.tipo = false;
                    tipoComprobante.id = this.isCosa;
                    datosIngresos.tipoComprobante = tipoComprobante;
                    datosIngresos.conceptos = this.form.get('concepto').value;
                    datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                    datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                    datosIngresos.rfcCliente = this.form.get('rfcCliente').value;
                    datosIngresos.subtotal = this.form.get('subtotal').value;
                    datosIngresos.iva = this.form.get('iva').value;
                    datosIngresos.total = this.form.get('total').value;
                    datosIngresos.ivaRetenido = this.form.get('ivaRetenido').value;
                    datosIngresos.isrRetenido = this.form.get('isrRetenido').value;
                    datosIngresos.archivo = this.nombreArOpG;
                    this.ingresoEgresoService.create(datosIngresos).then((data) => {
                        console.log("DATA: ", data);
                        $('#Ingreso').modal('hide');
                        this.isCosa = 0;
                        this.page = 1;
                        this.buscar();
                    }).catch((error) => {
                        console.log("ERROR: ", error);
                        this.error = true;
                        this.mensajeError = "Favor de llenar los campos obligatorios";
                    });
                    this.page = 1;
                    this.buscar();
                    break;
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
            case 4: {
                if (this.form.valid) {
                    datosIngresos.tipo = false;
                    tipoComprobante.id = this.isCosa;
                    datosIngresos.tipoComprobante = tipoComprobante;
                    datosIngresos.conceptos = this.form.get('concepto').value;
                    datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                    datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                    datosIngresos.rfcCliente = this.form.get('rfcCliente').value;
                    datosIngresos.subtotal = this.form.get('subtotal').value;
                    datosIngresos.iva = this.form.get('iva').value;
                    datosIngresos.total = this.form.get('total').value;
                    datosIngresos.archivo = this.nombreArOpG;
                    this.ingresoEgresoService.create(datosIngresos).then((data) => {
                        console.log("DATA: ", data);
                        $('#Ingreso').modal('hide');
                        this.isCosa = 0;
                        this.page = 1;
                        this.buscar();
                    }).catch((error) => {
                        console.log("ERROR: ", error);
                        this.error = true;
                        this.mensajeError = "Favor de llenar los campos obligatorios";
                    });
                    this.page = 1;
                    this.buscar();
                    break;
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
            case 5: {
                if (this.form.valid) {
                    if (this.checkCuenta > 0) {
                        datosIngresos.tipo = false;
                        tipoComprobante.id = this.isCosa;
                        datosIngresos.tipoComprobante = tipoComprobante;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                        datosIngresos.total = this.form.get('monto').value;
                        // Acá va el input del Banco / Socio / Acredor
                        datosIngresos.conceptos = this.form.get('concepto').value;
                        cuenta.id = this.form.get('cuenta').value;
                        datosIngresos.cuenta = cuenta;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.archivo = this.nombreArOpG;
                        this.ingresoEgresoService.create(datosIngresos).then((data) => {
                            console.log("DATA: ", data);
                            $('#Ingreso').modal('hide');
                            this.isCosa = 0;
                            this.page = 1;
                            this.buscar();
                        }).catch((error) => {
                            console.log("ERROR: ", error);
                            this.error = true;
                            this.mensajeError = "Favor de llenar los campos obligatorios";
                        });
                        this.page = 1;
                        this.buscar();
                        break;
                    }
                    else if (this.checkCaja > 0) {
                        datosIngresos.tipo = false;
                        tipoComprobante.id = this.isCosa;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.tipoComprobante = tipoComprobante;
                        datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                        console.log("Fecha: ", datosIngresos.fecha);
                        datosIngresos.total = this.form.get('monto').value;
                        // Acá va el input del Banco / Socio / Acredor
                        datosIngresos.conceptos = this.form.get('concepto').value;
                        console.log("Entra aquí y activa el guardado para Cajas");
                        caja.id = this.form.get('caja').value;
                        datosIngresos.caja = caja;
                        datosIngresos.archivo = this.nombreArOpG;
                        console.log("Nombre del Archivo Opcional: ", datosIngresos.archivo);
                        this.ingresoEgresoService.create(datosIngresos).then((data) => {
                            console.log("DATA: ", data);
                            $('#Ingreso').modal('hide');
                            this.isCosa = 0;
                            this.page = 1;
                            this.buscar();
                        }).catch((error) => {
                            console.log("ERROR: ", error);
                            this.error = true;
                            this.mensajeError = "Favor de llenar los campos obligatorios";
                        });
                        this.page = 1;
                        this.buscar();
                        break;
                    }
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
            case 6: {
                if (this.form.valid) {
                    if (this.checkCuenta > 0) {
                        datosIngresos.tipo = false;
                        tipoComprobante.id = this.isCosa;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.tipoComprobante = tipoComprobante;
                        datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                        datosIngresos.total = this.form.get('monto').value;
                        // Acá va el input del Banco / Socio / Acredor
                        datosIngresos.conceptos = this.form.get('concepto').value;
                        cuenta.id = this.form.get('cuenta').value;
                        datosIngresos.cuenta = cuenta;
                        datosIngresos.archivo = this.nombreArOpG;
                        this.ingresoEgresoService.create(datosIngresos).then((data) => {
                            console.log("DATA: ", data);
                            $('#Ingreso').modal('hide');
                            this.isCosa = 0;
                            this.page = 1;
                            this.buscar();
                        }).catch((error) => {
                            console.log("ERROR: ", error);
                            this.error = true;
                            this.mensajeError = "Favor de llenar los campos obligatorios";
                        });
                        this.page = 1;
                        this.buscar();
                        break;
                    }
                    else if (this.checkCaja > 0) {
                        datosIngresos.tipo = false;
                        tipoComprobante.id = this.isCosa;
                        datosIngresos.tipoComprobante = tipoComprobante;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                        console.log("Fecha: ", datosIngresos.fecha);
                        datosIngresos.total = this.form.get('monto').value;
                        // Acá va el input del Banco / Socio / Acredor
                        datosIngresos.conceptos = this.form.get('concepto').value;
                        console.log("Entra aquí y activa el guardado para Cajas");
                        caja.id = this.form.get('caja').value;
                        datosIngresos.caja = caja;
                        datosIngresos.archivo = this.nombreArOpG;
                        console.log("Nombre del Archivo Opcional: ", datosIngresos.archivo);
                        this.ingresoEgresoService.create(datosIngresos).then((data) => {
                            console.log("DATA: ", data);
                            $('#Ingreso').modal('hide');
                            this.isCosa = 0;
                            this.page = 1;
                            this.buscar();
                        }).catch((error) => {
                            console.log("ERROR: ", error);
                            this.error = true;
                            this.mensajeError = "Favor de llenar los campos obligatorios";
                        });
                        this.page = 1;
                        this.buscar();
                        break;
                    }
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
            case 7: {
                if (this.form.valid) {
                    console.log(this.checkCaja, this.checkCuenta);
                    if (this.checkCuenta > 0) {
                        datosIngresos.tipo = false;
                        tipoComprobante.id = this.isCosa;
                        datosIngresos.tipoComprobante = tipoComprobante;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                        datosIngresos.total = this.form.get('monto').value;
                        // Acá va el input del Banco / Socio / Acredor
                        datosIngresos.conceptos = this.form.get('concepto').value;
                        cuenta.id = this.form.get('cuenta').value;
                        datosIngresos.cuenta = cuenta;
                        datosIngresos.archivo = this.nombreArOpG;
                        this.ingresoEgresoService.create(datosIngresos).then((data) => {

                            $('#Ingreso').modal('hide');
                            this.isCosa = 0;
                            this.page = 1;
                            this.buscar();
                        }).catch((error) => {
                            console.log("ERROR: ", error);
                            this.error = true;
                            this.mensajeError = "Favor de llenar los campos obligatorios";
                        });
                        this.page = 1;
                        this.buscar();
                        break;
                    }
                    else if (this.checkCaja > 0) {
                        datosIngresos.tipo = false;
                        tipoComprobante.id = this.isCosa;
                        datosIngresos.tipoComprobante = tipoComprobante;
                        datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                        datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();

                        datosIngresos.total = this.form.get('monto').value;
                        // Acá va el input del Banco / Socio / Acredor
                        datosIngresos.conceptos = this.form.get('concepto').value;

                        caja.id = this.form.get('caja').value;
                        datosIngresos.caja = caja;
                        datosIngresos.archivo = this.nombreArOpG;

                        this.ingresoEgresoService.create(datosIngresos).then((data) => {

                            $('#Ingreso').modal('hide');
                            this.isCosa = 0;
                            this.page = 1;
                            this.buscar();
                        }).catch((error) => {
                            console.log("ERROR: ", error);
                            this.error = true;
                            this.mensajeError = "Favor de llenar los campos obligatorios";
                        });
                        this.page = 1;
                        this.buscar();
                        break;
                    }
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
            case 8: {
                console.log("Anticipo");
                if (this.form.valid) {
                    datosIngresos.tipo = false;
                    tipoComprobante.id = this.isCosa;
                    datosIngresos.tipoComprobante = tipoComprobante;
                    datosIngresos.conceptos = this.form.get('concepto').value;
                    // datosIngresos.archivoXml = this.nombreFactXMLO;
                    // datosIngresos.archivoPdf = this.nombreFactPDFO;
                    datosIngresos.fecha = new Date(this.form.get('fecha').value).getTime();
                    datosIngresos.nombreCliente = this.form.get('nombreCliente').value;
                    datosIngresos.rfcCliente = this.form.get('rfcCliente').value;
                    datosIngresos.subtotal = this.form.get('subtotal').value;
                    datosIngresos.iva = this.form.get('iva').value;
                    datosIngresos.total = this.form.get('total').value;
                    console.log("Datos ingresos: ", datosIngresos);
                    this.ingresoEgresoService.create(datosIngresos).then((data) => {
                        console.log("DATA: ", data);
                        $('#Ingreso').modal('hide');
                        this.isCosa = 0;
                        this.page = 1;
                        this.buscar();
                    }).catch((error) => {
                        console.log("ERROR: ", error);
                        this.error = true;
                        this.mensajeError = "Favor de llenar los campos obligatorios";
                    });
                    this.page = 1;
                    this.buscar();
                    break;
                }
                else {
                    console.log("Mandar error");
                    this.error = true;
                    this.mensajeError = "Favor de llenar los campos obligatorios";
                    break;
                }
            }
        }
        this.isCosa = 0;
    }

    onSelectedTComprobanteIngresos(tipoComprobante: any) {
        //console.log(this.form.get("tipoComprobante").value);

        if (!this.isEdit) {
            this.carga(this.form.get("tipoComprobante").value);
        }


    }

    onCuentaSelected(cuenta: any) {
        if (cuenta !== undefined && cuenta != null && cuenta > 0) {
            this.form.get('cuenta').setValue(cuenta);
            // console.log("CUENTA: ", cuenta);
            this.checkCuenta = cuenta;
        } else {
            this.form.get('cuenta').setValue(0);
        }
    }

    onConceptoSelected(concepto: any) {
        if (concepto !== undefined && concepto != null && concepto > 0) {
            this.form.get('concepto').setValue(concepto);
        } else {
            this.form.get('concepto').setValue(0);
        }
    }

    onCajaSelected(caja: any) {

        if (caja !== undefined && caja != null && caja > 0) {
            this.form.get('caja').setValue(caja);
            // console.log("CAJA: ", caja);
            this.checkCaja = caja;
        } else {

            this.form.get('caja').setValue(0);
        }
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

    carga(id: any) {
        if (id) {
            switch (id) {
                case '1': {
                    this.isCosa = 1;
                    this.jsAddI();
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'archivoPdf': [''],
                        'archivoXml': [''],
                        'fecha': ['', Validators.required],
                        'subtotal': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'total': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'iva': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'concepto': ['', Validators.required],
                        'nombreCliente': ['', Validators.required],
                        'rfcCliente': ['', Validators.required],
                        'archivo': [''],
                    });
                    this.archivoPdf = this.form.controls['archivoPdf'];
                    this.archivoXml = this.form.controls['archivoXml'];
                    this.fecha = this.form.controls['fecha'];
                    this.subtotal = this.form.controls['subtotal'];
                    this.total = this.form.controls['total'];
                    this.iva = this.form.controls['iva'];
                    this.concepto = this.form.controls['concepto'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    this.rfcCliente = this.form.controls['rfcCliente'];
                    this.archivo = this.form.controls['archivo'];
                    break;
                }
                case '2': {
                    this.isCosa = 2;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'fecha': ['', Validators.required],
                        'subtotal': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'total': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'iva': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'concepto': ['', Validators.required],
                        'nombreCliente': ['', Validators.required],
                        'rfcCliente': ['', Validators.required],
                        'ivaRetenido': ['', Validators.required],
                        'isrRetenido': ['', Validators.required],
                        'archivo': [''],
                    });
                    this.fecha = this.form.controls['fecha'];
                    this.subtotal = this.form.controls['subtotal'];
                    this.total = this.form.controls['total'];
                    this.iva = this.form.controls['iva'];
                    this.concepto = this.form.controls['concepto'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    this.rfcCliente = this.form.controls['rfcCliente'];
                    this.ivaRetenido = this.form.controls['ivaRetenido'];
                    this.isrRetenido = this.form.controls['isrRetenido'];
                    this.archivo = this.form.controls['archivo'];
                    break;
                }
                case '3': {
                    this.isCosa = 3;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'fecha': ['', Validators.required],
                        'subtotal': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'total': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'iva': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'concepto': ['', Validators.required],
                        'nombreCliente': ['', Validators.required],
                        'rfcCliente': ['', Validators.required],
                        'ivaRetenido': ['', Validators.required],
                        'isrRetenido': ['', Validators.required],
                        'archivo': [''],
                    });
                    this.fecha = this.form.controls['fecha'];
                    this.subtotal = this.form.controls['subtotal'];
                    this.total = this.form.controls['total'];
                    this.iva = this.form.controls['iva'];
                    this.concepto = this.form.controls['concepto'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    this.rfcCliente = this.form.controls['rfcCliente'];
                    this.ivaRetenido = this.form.controls['ivaRetenido'];
                    this.isrRetenido = this.form.controls['isrRetenido'];
                    this.archivo = this.form.controls['archivo'];
                    break;
                }
                case '4': {
                    this.isCosa = 4;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'fecha': ['', Validators.required],
                        'subtotal': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'total': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'iva': ['', Validators.required, Validators.pattern('^[0-9]+$')],
                        'concepto': ['', Validators.required],
                        'nombreCliente': ['', Validators.required],
                        'rfcCliente': ['', Validators.required],
                        'archivo': [''],
                    });
                    this.fecha = this.form.controls['fecha'];
                    this.subtotal = this.form.controls['subtotal'];
                    this.total = this.form.controls['total'];
                    this.iva = this.form.controls['iva'];
                    this.concepto = this.form.controls['concepto'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    this.rfcCliente = this.form.controls['rfcCliente'];
                    this.archivo = this.form.controls['archivo'];
                    break;
                }
                case '5': {
                    this.isCosa = 5;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'fecha': ['', Validators.required],
                        'monto': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                        'concepto': ['', Validators.required],
                        'cuenta': [''],
                        'caja': [''],
                        'archivo': [''],
                        'nombreCliente': ['', Validators.required]
                    });
                    this.fecha = this.form.controls['fecha'];
                    this.concepto = this.form.controls['concepto'];
                    this.monto = this.form.controls['monto'];
                    this.cuenta = this.form.controls['cuenta'];
                    this.caja = this.form.controls['caja'];
                    this.archivo = this.form.controls['archivo'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    break;
                }
                case '6': {
                    this.isCosa = 6;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'fecha': ['', Validators.required],
                        'monto': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                        'concepto': ['', Validators.required],
                        'cuenta': [''],
                        'caja': [''],
                        'archivo': [''],
                        'nombreCliente': ['', Validators.required]
                    });
                    this.fecha = this.form.controls['fecha'];
                    this.concepto = this.form.controls['concepto'];
                    this.monto = this.form.controls['monto'];
                    this.cuenta = this.form.controls['cuenta'];
                    this.caja = this.form.controls['caja'];
                    this.archivo = this.form.controls['archivo'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    break;
                }
                case '7': {
                    this.isCosa = 7;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'archivoPdf': [''],
                        'archivoXml': [''],
                        'fecha': ['', Validators.required],
                        'monto': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                        'concepto': ['', Validators.required],
                        'cuenta': [''],
                        'caja': [''],
                        'archivo': [''],
                        'nombreCliente': ['', Validators.required]
                    });
                    this.archivoPdf = this.form.controls['archivoPdf'];
                    this.archivoXml = this.form.controls['archivoXml'];
                    this.fecha = this.form.controls['fecha'];
                    this.concepto = this.form.controls['concepto'];
                    this.monto = this.form.controls['monto'];
                    this.cuenta = this.form.controls['cuenta'];
                    this.caja = this.form.controls['caja'];
                    this.archivo = this.form.controls['archivo'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    break;
                }

                case '8': {
                    this.isCosa = 8;
                    this.dropzone();
                    this.form = this.fb.group({
                        'tipoComprobante': [this.idTipoComprobante],
                        'fecha': ['', Validators.required],
                        'subtotal': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                        'total': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                        'iva': ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
                        'concepto': ['', Validators.required],
                        'nombreCliente': ['', Validators.required],
                        'rfcCliente': ['', Validators.required],
                        'archivo': [''],
                    });
                    this.fecha = this.form.controls['fecha'];
                    this.subtotal = this.form.controls['subtotal'];
                    this.total = this.form.controls['total'];
                    this.iva = this.form.controls['iva'];
                    this.concepto = this.form.controls['concepto'];
                    this.nombreCliente = this.form.controls['nombreCliente'];
                    this.rfcCliente = this.form.controls['rfcCliente'];
                    this.archivo = this.form.controls['archivo'];
                    break;
                }

            }/////-
        }
    }

    /*modal registro de cobro */

    /*Boton azul  $*/
    openModalRegistroCobro() {
        if (!$('#modalRegistroCobro').hasClass('show')) {
            $('#modalRegistroCobro').modal('show');
        }
    }

    showButtonCobro: boolean;
    ceroesAndBank: boolean;
    ceroesAndEffective: boolean;
    isNotCeroes: boolean;
    showAlertIsMore: boolean;
    showImporteTotalCobrar: boolean;
    showFecha1: boolean;

    activateBanco() {
        this.ceroesAndBank = true;
        this.ceroesAndEffective = false;
    }

    activateEfectivo() {
        this.ceroesAndEffective = true;
        this.ceroesAndBank = false;
    }

    activateCeros() {   //activa 3er modal
        this.isNotCeroes = true;
        this.ceroesAndBank = false;
        this.showImporteTotalCobrar = false;  //apagar label importe total a pagar
        this.showFecha1 = false;             //apagar labelfecha first row                    
    }

    //  llenar los 3 primeros campos : cliente , conceptos importe cuando se abra modal de cobro !
    itemSavedFor: IngresoEgreso;
    conceptoSaved: any;
    tipoComprobanteSaved: any;
    fechaSaved: any;
    nombreClienteSaved: any;
    rfcClienteSaved: any;
    subtotalSaved: any;
    ivaSaved: any;
    totalSaved: any;
    cobroPagoListSaved: any;

    modalForm = new FormGroup({
        cliente: new FormControl(),
        importeTotalCobrar: new FormControl(),
        conceptoTextarea: new FormControl(),
        importeMontoCobrado: new FormControl('', [Validators.required]),
        fechaCobro: new FormControl('', [Validators.required]),
        fechaUltimoCobro: new FormControl('', []),
        selectBanco: new FormControl(),
        selectCaja: new FormControl(),
        nvoCobro: new FormControl('', [Validators.pattern('^[0-9]+$')])

    });

    saveProperties(item: any) {
        this.error = false;
        this.modalForm.reset();
        this.entidad_update = item;
        console.log(item);
        this.errorMonto = false;
        this.itemSavedFor = item;
        this.conceptoSaved = item.conceptos;
        this.tipoComprobanteSaved = item.tipoComprobante.nombre;
        this.fechaSaved = item.fecha;
        this.nombreClienteSaved = item.nombreCliente;
        this.rfcClienteSaved = item.rfcCliente;
        this.subtotalSaved = item.subtotal;
        this.ivaSaved = item.iva;
        this.totalSaved = item.total;
        if (item.cobroPagoList != null && item.cobroPagoList != undefined) {
            this.montoActual = this.montoCobradoActual(item.cobroPagoList);
        } else {
            this.montoActual = 0;
        }

        // console.log(this.montoCobradoActual(item.cobroPagoList));
        this.modalForm.get('cliente').setValue(this.nombreClienteSaved);
        this.modalForm.get('importeTotalCobrar').setValue(this.totalSaved);
        this.modalForm.get('conceptoTextarea').setValue(this.conceptoSaved);

        $("#rdBtnBancoCobro").prop("checked", false);
        $("#rdBtnEfectivoCobro").prop("checked", false);
        this.ceroesAndBank = false;
        this.ceroesAndEffective = false;

        if (this.montoActual > 0) {
            console.log(item.monto);
            this.modalForm.controls["nvoCobro"].setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
            this.modalForm.controls["fechaUltimoCobro"].setValidators(Validators.required);
            let fecha: string = this.changeTimestampToDate(item.fecha)
            this.activateCeros();
            this.modalForm.get("importeMontoCobrado").setValue(this.montoActual);
            this.modalForm.get("fechaCobro").setValue(fecha);
            document.getElementById("importeMontoCobrado").setAttribute("disabled", "true");
        } else {
            console.log(item.monto);
            this.isNotCeroes = false;
            this.modalForm.controls["nvoCobro"].clearValidators();
            this.modalForm.controls["fechaUltimoCobro"].clearValidators();
            document.getElementById("importeMontoCobrado").removeAttribute("disabled")
        }

        this.cajasService.getCajas("", "", "", 0, 0).subscribe(
            (dataCajas) => {
                this.cajasDisponibles = dataCajas.data;
                // this.cuentasDisponibles
            });

        this.cuentasDisponibles = [];
        this.cuentaService.getCuentas("", "", "", 0, 0).subscribe(
            (dataCuentas) => {
                for (let item of dataCuentas.data) {
                    let cuenta = new Cuenta();
                    if (item.estatus == 1) {

                        cuenta = item;
                        this.cuentasDisponibles.push(cuenta);
                    }
                }
                // this.cuentasDisponibles=dataCuentas.data;
            });
        console.log(this.isNotCeroes);
    }


    //validar cuentas

    validarCuentas() {

    }


    getIngresosCSV() {
        this.ingresoEgresoService.getCSVIngreso();
    }

    //borrar formulario
    cleanData() {
        this.modalForm.reset();
        //con data picker setear a cero la fecha.
    }

    sendDatosCobro() {
        let montoCobrado: number;
        // console.log(item);

        if (this.isNotCeroes) {
            montoCobrado = this.modalForm.get("nvoCobro").value;
            console.log("nvoCOBRO", this.modalForm.get("nvoCobro").value);
        } else {
            montoCobrado = this.modalForm.get("importeMontoCobrado").value;
        }

        // console.log(montoCobrado);
        // let montoActual:number=this.montoCobradoActual(this.entidad_update.cobroPagoList);
        let montoCorrecto: boolean = this.compareMontovsTotal(montoCobrado);
        // console.log(montoActual);
        if (montoCorrecto) {
            let nuevoIngreso: IngresoEgreso = new IngresoEgreso();

            console.log(this.modalForm.get("fechaUltimoCobro").value, this.modalForm.get("fechaCobro").value);

            nuevoIngreso = this.entidad_update;
            if (this.isNotCeroes) {
                let fechaUltimoCobro: number = this.changeDateToTimestamp(this.modalForm.get("fechaUltimoCobro").value);
                nuevoIngreso.fecha = fechaUltimoCobro;
            } else {
                let fechaCobro: number = this.changeDateToTimestamp(this.modalForm.get("fechaCobro").value);
                nuevoIngreso.fecha = fechaCobro;
            }
            // this.entidad_update.monto=montoCobrado+this.montoActual;

            // nuevoIngreso.id = this.entidad_update.id;
            // nuevoIngreso.estatus = this.entidad_update.estatus;
            // nuevoIngreso.tipo = false;
            // nuevoIngreso.tipoPago = 0;
            if (this.ceroesAndBank) {
                nuevoIngreso.tipoPago = 0;
            } else {
                nuevoIngreso.tipoPago = 1;
            }
            console.log(montoCobrado, this.montoActual);
            nuevoIngreso.monto = montoCobrado + this.montoActual;

            if (this.modalForm.valid) {
                // implementacion del servicio crearPAgoCobro
                let nuevoCobro = new CobroPago();
                nuevoCobro.ingresoEgreso = new IngresoEgreso();
                // nuevoIngreso=this.entidad_updat;
                nuevoCobro.ingresoEgreso.id = Number(this.entidad_update.id);
                nuevoCobro.fecha = new Date(this.modalForm.get("fechaCobro").value).getTime();
                nuevoCobro.monto = montoCobrado;
                // nuevoCobro.fechaCreacion=new Date().getTime();
                if (this.ceroesAndBank) {
                    //banco
                    nuevoCobro.cuenta = new Cuenta();
                    nuevoCobro.tipoPago = 0;
                    nuevoCobro.cuenta.id = Number(this.modalForm.get("selectBanco").value);
                } else {
                    //Efectivo
                    nuevoCobro.caja = new Caja();
                    nuevoCobro.tipoPago = 1;
                    nuevoCobro.caja.id = Number(this.modalForm.get("selectCaja").value);
                }


                this.ingresoEgresoService.crearPagoCobro(nuevoCobro)
                    .then((response) => {
                        console.log(response);
                        if (response.ok == "ok") {
                            this.ingresoEgresoService.updateMonto(nuevoIngreso)
                                .then((response) => {
                                    this.buscar();
                                    $('#modalRegistroCobro').modal('hide');
                                })
                                .catch();
                        }
                    })
                    .catch();



            } else {
                this.error = true;
                this.mensajeError = "Favor de llenar los campos obligatorios";
            }

        }
    }

    date: { year: number, month: number };
    now = new Date();
    model: NgbDateStruct = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
    maxDate = this.model;


    settingMaxDate() {
        // this.config.maxDate = this.calendar.getToday();
    }

    //Enviar XML
    sendXMLFile() {


    }
    //Modal de envío de Mail -->

    enviarMail(item: IngresoEgreso) {
        console.log(item);
        this.entidad_update = item;
        this.modalEnvioMail.reset();
        if ((item.conceptos != null && item.conceptos != undefined) || (item.tipoComprobante != null && item.tipoComprobante != undefined)) {
            this.comprobanteConceptoDisponible = true;
        }
        if (item.cliente.mails != undefined && item.cliente.mails != null) {
            this.modalEnvioMail.get("direccionMail").setValue(item.cliente.mails);
        }

    }

    direccionMail: any;
    regexMultipleMail: string = `^((\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}),?)+$`;
    modalEnvioMail = new FormGroup({
        direccionMail: new FormControl('', [Validators.pattern(this.regexMultipleMail), Validators.required])
    })

    sendMail() {
        console.log(this.entidad_update);
        console.log(this.modalEnvioMail.controls["direccionMail"].value);
        let listMail = this.modalEnvioMail.controls["direccionMail"].value;
        this.mailService.sendMailIngreso(this.entidad_update.id, listMail)
            .then((response) => {
                console.log(response);
                if (response.ok == "enviado") {
                    console.log("Correo Enviado con exitó");
                    $('#modalMail').modal('hide');
                }
            })
            .catch((error) => {
                this.error = true;
                this.mensajeError = "Error al enviar correo";
            });
    }

    compareMontovsTotal(montoCobrado: number): boolean {

        let status: boolean = true;
        let money: number = montoCobrado + this.montoActual;
        if (this.totalSaved < money) {
            console.log("Error en el monto a cobrar");
            this.errorMonto = true;
            status = false;
        }

        return status;
    }

    montoCobradoActual(cobroList: Array<CobroPago>): number {
        let montoActual: number = 0;
        console.log(cobroList);
        cobroList.forEach((cobro) => {
            // console.log(cobro.monto);

            montoActual += cobro.monto;
        });
        console.log(montoActual);
        return montoActual;
    }

    filtrarPendientes() {
        this.pendientes = !this.pendientes;
        this.page = 1;
        this.buscar();

    }

    changeTimestampToDate(timestamp: number): string {
        let dateFormat: string;
        let dateFormatTimestamp: Date = new Date(timestamp);
        console.log(dateFormatTimestamp.toDateString());
        let mouth: string = (dateFormatTimestamp.getMonth() + 1) + "";
        let day: string = dateFormatTimestamp.getDate() + "";

        if (dateFormatTimestamp.getMonth() + 1 < 10) {
            mouth = "0" + (dateFormatTimestamp.getMonth() + 1);
        }
        if (dateFormatTimestamp.getDate() < 10) {
            day = "0" + dateFormatTimestamp.getDate();
        }
        dateFormat = dateFormatTimestamp.getFullYear() + "-" + mouth + "-" + day;
        return dateFormat;
    }

    changeDateToTimestamp(date: String): number {
        let changedDate: string[] = date.split("-");
        let datetimeStamp = new Date(Number(changedDate[0]), Number(changedDate[1]) - 1, Number(changedDate[2]), 0, 0, 0);

        return datetimeStamp.getTime();
    }

    descargarPDF(item: any) {
        console.log("PDF");
        if (item.archivoPdf != null) {
            this.ingresoEgresoService.descargarPDF(item.empresa.rfc, item.archivoPdf);
        } else {
            this.error = true;
            this.mensajeError = "No Existe archivo";
        }

    }

    descargarXML(item: any) {
        console.log("XML");
        if (item.archivoXml != null) {
            this.ingresoEgresoService.descargarXML(item.empresa.rfc, item.archivoXml);
        } else {
            this.error = true;
            this.mensajeError = "No Existe archivo";
        }
    }

    descargarArchivo(item: any) {
        if (item.archivo != null) {
            this.ingresoEgresoService.descargarArchivo(item.empresa.rfc, item.archivo);
        }
    }

    generarFactura(item: any) {

        console.log("generando XML-EMPRO", item);
        this.ingresoEgresoService.generaXml(item.id)
            .then((response) => {
                console.log(response);

                if (response.ok == "ok") {
                    setTimeout(() => {
                        this.ingresoEgresoService.descargarXML(item.empresa.rfc, item.id + ".xml");
                    }, 200);

                }
            })
            .catch((error) => {
                console.log("Error al Descargar archivos");
            });
    }

    onChangeComprobante(tipoComprobante: any) {
        console.log(tipoComprobante);
        // console.log(tipoComprobante.id);
        // console.log(tipoComprobante.nombre);

        if (!this.isEdit) {
            this.carga(tipoComprobante.target.value);
        }
    }

    deleteValue() {
        this.isCosa = 0;
    }

}