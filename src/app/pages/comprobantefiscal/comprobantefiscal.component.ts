import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from "@angular/forms";

import { ComprobanteFiscal } from "../../entidades/comprobante-fiscal";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { ComprobanteFiscalService } from "../../servicios-backend/comprobante-fiscal.service";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/map";
import { EmpresaService } from "../../servicios-backend/empresa.service";
import { Empresa } from "../../entidades/empresa";
import { FoliosService } from "../../servicios-backend/folios.service";
import { Folios } from "../../entidades/folios";
import { ConceptoService } from "../../servicios-backend/concepto.service";
import { ClienteProveedorService } from "../../servicios-backend/cliente-proveedor.service";
import { RegimenFiscal } from "../../entidades/regimen-fiscal";
import { ClienteProveedor } from "../../entidades/cliente-proveedor";
import { ComprobanteFiscalConcepto } from "../../entidades/comprobante-fiscal-concepto";
import { Concepto } from "../../entidades/concepto";
import { Producto } from "../../entidades/producto";
import { Unidad } from "../../entidades/unidad";
import { ComprobantesfiscalesComponent } from "../comprobantesfiscales/comprobantesfiscales.component";
import { ComprobanteidService } from "../comprobantesfiscales/comprobanteid.service";
import { AutocompleteGenericComponent } from "../../comun/components/autocomplete-generic";
import { UsoCfdi } from "../../entidades/uso-cfdi";
import { FormasPago } from "../../entidades/formas-pago";
import { RegimenFiscalService } from "../../servicios-backend/regimen-fiscal.service";
import { TipoComprobante } from "app/entidades/tipo-comprobante";
import { MailService } from "../../servicios-backend/mail.service";
import { empty } from "rxjs/Observer";

@Component({
  selector: "app-comprobantefiscal",
  templateUrl: "./comprobantefiscal.component.html",
  styleUrls: ["./comprobantefiscal.component.scss"],
})
export class ComprobantefiscalComponent implements OnInit {
  FormControl: any;
  formularioComprobanteFiscal: FormGroup;
  invoiceForm: FormGroup;
  empresaService: EmpresaService;
  regimenService: RegimenFiscalService;
  empresa: Empresa = new Empresa();

  data: Folios[];
  query: string = "";
  rowsOnPage: number = 10;
  sortBy: string;
  sortOrder: string = "asc";
  page: number = 1;

  ivaR: number = 0.0;
  isR: number = 0.0;
  ieps: number = 0.0;
  ivaExcento: boolean;
  ivaFrontera: boolean;
  parametrosrfc: Map<string, string> = new Map();
  changeOption: number;
  respuestachecked: boolean = false;
  agregarTimbre: number = 1;

  idEmpresa: number = 0;
  idRegimen: number;
  idEdit: number;

  entidad_elimar: ComprobanteFiscal;
  conceptoLista: any;
  folioPlaceHolder: string = "";
  disabledManual: boolean = true;
  isAllValidConcept: boolean = false;
  validsConcepts: boolean[] = [];

  @ViewChild("autocompleteRegimenEmpresa")
  autocompleteRegimenEmpresa: AutocompleteGenericComponent;
  @ViewChild("autocompleteNombreCliente")
  autocompleteNombreCliente: AutocompleteGenericComponent;
  @ViewChild("autocompleteTConceptos")
  autocompleteTConceptos: AutocompleteGenericComponent;

  public modalEnvioMail: FormGroup;
  public direccionMail: AbstractControl;

  constructor(
    empresaService: EmpresaService,
    regimenService: RegimenFiscalService,
    private _fb: FormBuilder,
    private foliosService: FoliosService,
    private conceptoService: ConceptoService,
    private clienteProveedorService: ClienteProveedorService,
    private compobantefiscalservice: ComprobanteFiscalService,
    private comprobanteidService: ComprobanteidService,
    private mailService: MailService
  ) {
    this.modalEnvioMail = _fb.group({
      direccionMail: [
        "",
        Validators.compose([
          Validators.required,
          this.commaSepEmail,
          Validators.minLength(3),
        ]),
      ],
    });
    this.direccionMail = this.modalEnvioMail.controls["direccionMail"];
    this.empresaService = empresaService;
    this.regimenService = regimenService;
  }

  ngOnInit() {
    this.changeOption = 2;

    this.parametrosrfc.set("tipo", "1");
    this.getEmpresa();
    this.initFormularioComprobanteFiscal();
    this.buscar();
    this.invoiceForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()]),
    });
    this.formularioComprobanteFiscal.get("tipoComprobante").setValue(0);
    this.formularioComprobanteFiscal.get("moneda").setValue(0);
    this.formularioComprobanteFiscal.get("tipoCambio").setValue(1);

    if (this.comprobanteidService.editarComprobante == "0") {
      this.agregarTimbre = 1;
    } else {
      this.editarComprobanteFiscal(this.comprobanteidService.editarComprobante);
      this.agregarTimbre = 2;
    }
  }

  initItemRows() {
    return this._fb.group({
      claveprodserv: [""],
      idprodserv: [""],
      descripcion: [""],
      unidad: [""],
      cantidad: [""],
      precioUnitario: [""],
      claveIdentificacion: [""],
      descuento: [""],
      importe: [""],
      descripcionAdd: [""],

      ivaRetenido: [""],
      ivaPorcentaje: [""],
      isrRetenido: [""],
      ieps: [""],
      ivaExcento: [""],
      ivaFrontera: [""],
      tipoFactor: [""],
      base: [""],
    });
  }

  buscar() {
    this.foliosService
      .getFolios(
        this.query,
        this.sortBy,
        this.sortOrder,
        this.rowsOnPage,
        this.page
      )
      .subscribe(
        (dataxyz) => {
          if (dataxyz == null) {
            this.removeValidators("serie", this.formularioComprobanteFiscal);
          } else {
          }
          this.data = dataxyz.data;
        },
        (errorxyz) => {
          console.log("error", errorxyz);
        }
      );
  }

  getEmpresa() {
    this.empresaService
      .getDetalle()
      .then((data: any) => {
        this.empresa = data;
        this.getRegimen();
        this.formularioComprobanteFiscal
          .get("cp")
          .setValue(this.empresa.lugarExpedicion);
        this.idEmpresa = this.empresa.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  selectSerie(event) {
    this.formularioComprobanteFiscal.get("manualFolio").setValue(null);
    this.folioPlaceHolder = this.data[
      event.target.selectedIndex - 1
    ].folioActual.toString();
  }

  enableManual(event) {
    this.disabledManual = !event.target.checked;
    var select = document.getElementById("serie") as HTMLSelectElement;
    if (event.target.checked) {
      this.formularioComprobanteFiscal.get("manualFolio").touched;
      this.folioPlaceHolder = "";
    }

    if (!event.target.checked && select.selectedIndex > 0) {
      this.formularioComprobanteFiscal.get("manualFolio").setValue(null);
      this.folioPlaceHolder = this.data[
        select.selectedIndex - 1
      ].folioActual.toString();
    }
  }

  getRegimen() {
    this.regimenService.getRegimenes("", "", "asc", 10, 1).subscribe(
      (data) => {
        let idRegimenDefault = Number(localStorage.getItem("idRegimenDefault"));
        this.autocompleteRegimenEmpresa.getDetalle(idRegimenDefault);
        this.formularioComprobanteFiscal
          .get("regimen")
          .setValue(idRegimenDefault);

        //llena datos si no existe idRegimen
        let array = data["data"];
        let idReg = array["0"]["id"];
        this.autocompleteRegimenEmpresa.getDetalle(idReg);
        this.formularioComprobanteFiscal.get("regimen").setValue(idReg);
      },
      (errorxyz) => {}
    );
  }

  initFormularioComprobanteFiscal() {
    this.formularioComprobanteFiscal = new FormGroup({
      id: new FormControl(),
      moneda: new FormControl(),
      monedaText: new FormControl(),
      observacion: new FormControl(),
      motivoDescuento: new FormControl(),
      subtotal: new FormControl(),
      montoIva: new FormControl(),
      total: new FormControl(),
      condicionPago: new FormControl(),
      numeroCuenta: new FormControl(),
      tipoComprobante: new FormControl(),
      tipoComprobanteText: new FormControl(),
      metodoPago: new FormControl(),
      serie: new FormControl(),
      manualFolio: new FormControl(),
      cambioManual: new FormControl(),
      usoCfdi: new FormControl(),
      regimen: new FormControl(),
      cliente: new FormControl(),
      documento: new FormControl(),
      formaPago: new FormControl(),
      cp: new FormControl(),
      tipoImpuesto: new FormControl(),
      tipoImpuestoText: new FormControl(),

      tipoFactorText: new FormControl(),
      comprobanteFiscalConceptoList: new FormControl(),

      uuid: new FormControl(),
      rfcCliente: new FormControl(),
      nombreCliente: new FormControl(),
      fechaCreacion: new FormControl(),

      impuesto: new FormControl(), // Mandar 0 ->IVA, 1 -> ISR y 2 -> IEPS
      concepto: new FormControl(),
      comprobanteFiscal: new FormControl(),
      impuestoText: new FormControl(),
      tasaCuota: new FormControl(),

      totaldescuento: new FormControl(),
      tipoRelacion: new FormControl(),
      tipoCambio: new FormControl(),

      totalivaretenido: new FormControl(),
      totalisrretenido: new FormControl(),
      totalIeps: new FormControl(),
      impuestoPorConceptocheck: new FormControl(),
    });
    this.addRequiredValidator("serie", this.formularioComprobanteFiscal);
  }

  addNewRow() {
    const control = <FormArray>this.invoiceForm.controls["itemRows"];
    control.push(this.initItemRows());
    this.validsConcepts.push(false);
    this.checkValueConcepts();
  }

  deleteRow(index: number) {
    const control = <FormArray>this.invoiceForm.controls["itemRows"];
    control.removeAt(index);
    this.totalIvaRetenido();
    this.montoTotal();
    this.validsConcepts.splice(index);
    this.checkValueConcepts();
  }

  onIdRegimenEmpresaSelected(tipoRegimen: any) {
    if (tipoRegimen !== undefined && tipoRegimen != null && tipoRegimen > 0) {
      this.formularioComprobanteFiscal.get("regimen").setValue(tipoRegimen);

      let filterQuery = "";
      let rowsOnPage = 10;
      let sortBy = "tipoRegimen.nombre";
      let sortOrder = "asc";
      let page: number = 1;
      this.regimenService
        .getRegimenes(filterQuery, sortBy, sortOrder, rowsOnPage, page)
        .subscribe(
          (resp) => {
            let array = resp["data"];
            let idTipo = 0;
            for (let listRegimen in array) {
              let position = String(listRegimen);
              idTipo = array[position]["tipoRegimen"]["id"];
              if (idTipo == tipoRegimen) {
                this.idRegimen = array[position]["id"];
              }
            }
          },
          (error) => {
            console.warn("Error al buscar todos los contactos, ", error);
          }
        );
    } else {
      this.formularioComprobanteFiscal.get("regimen").setValue(0);
    }
  }

  onIdNombreClienteSelected(nombreCliente: any) {
    if (
      nombreCliente !== undefined &&
      nombreCliente != null &&
      nombreCliente > 0
    ) {
      this.formularioComprobanteFiscal
        .get("nombreCliente")
        .setValue(nombreCliente);
      this.clienteProveedorService
        .getDetalle(nombreCliente)
        .subscribe((data: any) => {
          this.empresa = data;
          this.formularioComprobanteFiscal.get("rfcCliente").setValue(data.rfc);
        });
    } else {
      this.formularioComprobanteFiscal.get("nombreCliente").setValue(0);
    }
  }

  calculaTotales(i: number) {
    // without type info
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];
    var cantidad: number = 0.0;
    var preUnitario: number = 0.0;
    var importe: number = 0.0;
    var descuento: number = 0.0;

    cantidad = parseFloat(control.controls[i].get("cantidad").value);
    preUnitario = parseFloat(control.controls[i].get("precioUnitario").value);
    importe = parseFloat(control.controls[i].get("importe").value);
    descuento = parseFloat(control.controls[i].get("descuento").value);
    this.ivaR = parseFloat(control.controls[i].get("ivaRetenido").value);

    //this.isR = parseFloat(control.controls[i].get('isrRetenido').value);

    this.ieps = parseFloat(control.controls[i].get("ieps").value);
    this.ivaExcento = control.controls[i].get("ivaExcento").value;
    this.isR = control.controls[i].get("isrRetenido").value;
    this.ivaFrontera = control.controls[i].get("ivaFrontera").value;

    if (isNaN(cantidad)) {
      control.controls[i].get("cantidad").setValue((0).toFixed(2));
    }
    if (isNaN(preUnitario)) {
      control.controls[i].get("precioUnitario").setValue((0).toFixed(2));
    }
    if (isNaN(importe)) {
      control.controls[i].get("importe").setValue((0).toFixed(2));
    }
    if (isNaN(descuento)) {
      control.controls[i].get("descuento").setValue((0).toFixed(2));
    }
    if (isNaN(this.ivaR)) {
      control.controls[i].get("ivaRetenido").setValue(0);
    }
    /*    if (isNaN(this.isR)) {
             control.controls[i].get('isrRetenido').setValue(0);
           } */
    if (isNaN(this.ieps)) {
      control.controls[i].get("ieps").setValue(0);
    }

    control.controls[i]
      .get("importe")
      .setValue((cantidad * preUnitario).toFixed(2));
    control.controls[i]
      .get("base")
      .setValue((cantidad * preUnitario - descuento).toFixed(2));
    // control.controls[i].get('tipoFactor').setValue(null);

    this.montoTotal();
  }

  calculaIvaRetenido(index: number) {
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];
    var tipoIva = control.controls[index].get("ivaRetenido").value;
    var base = control.controls[index].get("base").value;
    var ivaRetenido: number;

    if (tipoIva == null) {
      ivaRetenido = 0.0;
    } else if (tipoIva == 1) {
      ivaRetenido = base * 0.04;
    } else if (tipoIva == 2) {
      ivaRetenido = base * 0.106667;
    } else {
      ivaRetenido = 0.0;
    }
    control.controls[index]
      .get("ivaPorcentaje")
      .setValue(parseFloat(ivaRetenido.toFixed(2)));
    this.totalIvaRetenido();
  }

  totalIvaRetenido() {
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];
    var y = control.length - 1;
    var nums: any = [Number];
    var total = 0.0;

    for (var index = 0; y >= index; index += 1) {
      var num = parseFloat(control.controls[index].get("ivaPorcentaje").value);
      nums[index] = num;
      total = total + nums[index];
    }

    this.formularioComprobanteFiscal
      .get("totalivaretenido")
      .setValue(parseFloat(total.toFixed(2)));
    this.montoTotal();
  }

  montoTotal() {
    var montoTotales: number = 0.0;
    var montodescuento: number = 0.0;
    var iva: number = 0.0;
    var isr: number = 0.0;
    var TotalIvaRetenido: number = 0.0;
    var TotalIsrRetenido: number = 0.0;
    var TotalIeps: number = 0.0;
    var montoIvaRetenido: number = 0.0;
    var montoIsrRetenido: boolean;
    var montoiepsRetenido: number = 0.0;
    var montoIvaExcento: boolean;
    var montoIvaFrontera: boolean;

    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];
    var y = control.length - 1;

    for (var campos = 0; y >= campos; campos += 1) {
      campos - 1;

      let importe = isNaN(control.controls[campos].get("importe").value)
        ? 0.0
        : control.controls[campos].get("importe").value;
      let descuento = isNaN(control.controls[campos].get("descuento").value)
        ? 0.0
        : control.controls[campos].get("descuento").value;
      var ieps = isNaN(control.controls[campos].get("ieps").value)
        ? 0.0
        : control.controls[campos].get("ieps").value;
      ieps = 0.0 + ieps;
      montoTotales += parseFloat(importe);
      montodescuento += parseFloat(descuento);
      var ivaval =
        control.controls[campos].get("ivaFrontera").value == true ? 8 : 16;
      if (control.controls[campos].get("ivaExcento").value == true) {
        iva += parseFloat(
          (((parseFloat(importe) - parseFloat(descuento)) / 100) * 0).toFixed(2)
        );
      } else {
        iva += parseFloat(
          (
            ((parseFloat(importe) - parseFloat(descuento)) / 100) *
            ivaval
          ).toFixed(2)
        );
        //iva = parseFloat((((montoTotales - montodescuento) / 100) * 16).toFixed(2));
      }
      if (this.respuestachecked == true) {
        if (control.controls[campos].get("isrRetenido").value == true) {
          isr += parseFloat(
            (
              ((parseFloat(importe) - parseFloat(descuento)) / 100) *
              10
            ).toFixed(2)
          );
        } else {
          isr += parseFloat(
            (((parseFloat(importe) - parseFloat(descuento)) / 100) * 0).toFixed(
              2
            )
          );
          //iva = parseFloat((((montoTotales - montodescuento) / 100) * 16).toFixed(2));
        }
      }
      // montoIsrRetenido += (((parseFloat(control.controls[campos].get('importe').value) - parseFloat(control.controls[campos].get('descuento').value)) / 100) * parseFloat(control.controls[campos].get('isrRetenido').value));
      montoiepsRetenido +=
        (parseFloat(importe) - parseFloat(descuento)) * parseFloat(ieps);

      campos + 1;
    }

    TotalIvaRetenido = this.formularioComprobanteFiscal.get("totalivaretenido")
      .value;
    TotalIsrRetenido = isr;
    TotalIeps = montoiepsRetenido;
    montoTotales = isNaN(montoTotales) ? 0.0 : montoTotales;
    montodescuento = isNaN(montodescuento) ? 0.0 : montodescuento;
    iva = isNaN(iva) ? 0.0 : iva;
    TotalIvaRetenido = isNaN(TotalIvaRetenido) ? 0.0 : TotalIvaRetenido;
    TotalIsrRetenido = isNaN(TotalIsrRetenido) ? 0.0 : TotalIsrRetenido;
    TotalIeps = isNaN(TotalIeps) ? 0.0 : TotalIeps;

    this.formularioComprobanteFiscal
      .get("total")
      .setValue(
        (
          montoTotales -
          montodescuento +
          iva -
          TotalIvaRetenido -
          TotalIsrRetenido -
          TotalIeps
        ).toFixed(2)
      );
    this.formularioComprobanteFiscal.get("montoIva").setValue(iva.toFixed(2));
    this.formularioComprobanteFiscal
      .get("totaldescuento")
      .setValue(montodescuento.toFixed(2));
    this.formularioComprobanteFiscal
      .get("subtotal")
      .setValue(montoTotales.toFixed(2));

    //this.formularioComprobanteFiscal.get('totalivaretenido').setValue(TotalIvaRetenido.toFixed(2));
    this.formularioComprobanteFiscal
      .get("totalisrretenido")
      .setValue(TotalIsrRetenido.toFixed(2));
    this.formularioComprobanteFiscal
      .get("totalIeps")
      .setValue(TotalIeps.toFixed(2));
  }

  tipoRelacionUUID(tipoRelacion: any) {
    if (tipoRelacion.target.value != null) {
      document.getElementById("uuid").style.display = "block";
      this.addRequiredValidator("uuid", this.formularioComprobanteFiscal);
    }
    if (tipoRelacion.target.value == "0: null") {
      document.getElementById("uuid").style.display = "none";
      this.removeValidators("uuid", this.formularioComprobanteFiscal);
    }
  }

  tipoMoneda() {
    if (this.formularioComprobanteFiscal.get("moneda").value != 0) {
      document.getElementById("tipoCambio").style.display = "block";
      this.addRequiredValidator("tipoCambio", this.formularioComprobanteFiscal);
    } else {
      document.getElementById("tipoCambio").style.display = "none";
      this.removeValidators("tipoCambio", this.formularioComprobanteFiscal);
    }
  }

  addRequiredValidator(campo: string, form: FormGroup) {
    form.controls[campo].setValidators(Validators.required);
    form.controls[campo].updateValueAndValidity();
  }
  removeValidators(campo: string, form: FormGroup) {
    form.controls[campo].clearValidators();
    form.controls[campo].updateValueAndValidity();
    //console.log('Quitando validator');
  }

  impuestoPorConcepto(respuestacheck: any) {
    this.formularioComprobanteFiscal.get("totalivaretenido").setValue("0.00");
    this.impuestosPorConceptoCheck(respuestacheck.target.checked);
  }

  impuestosPorConceptoCheck(value: Boolean) {
    if (value) {
      this.respuestachecked = true;
      document.getElementById("impuestosXconceptos").style.display = "block";
      document.getElementById("impuestosXconceptoscajas").style.display =
        "block";
      document.getElementById("totalivaret").style.display = "block";
      document.getElementById("totalisrret").style.display = "block";
      document.getElementById("totalIeps").style.display = "block";
      this.montoTotal();
    } else {
      this.respuestachecked = false;
      document.getElementById("impuestosXconceptos").style.display = "none";
      document.getElementById("impuestosXconceptoscajas").style.display =
        "none";
      document.getElementById("totalivaret").style.display = "none";
      document.getElementById("totalisrret").style.display = "none";
      document.getElementById("totalIeps").style.display = "none";

      const control: FormArray = <FormArray>(
        this.invoiceForm.controls["itemRows"]
      );
      var y = control.length - 1;
      for (var campos = 0; y >= campos; campos += 1) {
        control.controls[campos].get("ivaRetenido").setValue(0);
        control.controls[campos].get("isrRetenido").setValue(0);
        control.controls[campos].get("ieps").setValue(0);
        control.controls[campos].get("ivaExcento").setValue(0);
        control.controls[campos].get("ivaFrontera").setValue(0);
      }
      this.montoTotal();
    }
  }

  onSelectedTConceptos(concepto: any, i: any) {
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];
    control.controls[i].get("descripcion").value;
    if (concepto !== undefined && concepto != null && concepto > 0) {
      this.conceptoService.getDetalle(concepto).subscribe((data: any) => {
        this.empresa = data;
        control.controls[i].get("claveprodserv").setValue(data.producto.clave);
        control.controls[i].get("idprodserv").setValue(data.id);
        control.controls[i].get("unidad").setValue(data.unidad.claveUnidad);
        control.controls[i]
          .get("claveIdentificacion")
          .setValue(data.unidad.nombre);

        this.checkValueConcepts();
      });
    } else {
      control.controls[i].get("cantidad").setValue(0);
      control.controls[i].get("precioUnitario").setValue(0);
      this.calculaTotales(i);

      this.checkValueConcepts();
    }
  }

  checkValueConcepts() {
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];
    var y = control.length - 1;
    for (var campos = 0; y >= campos; campos += 1) {
        this.validsConcepts[campos] = control.controls[campos].get("idprodserv").value != "";
      if(campos == 0 || this.isAllValidConcept){
        this.isAllValidConcept = control.controls[campos].get("idprodserv").value != "";
      }
    }
  }

  change(valor) {
    this.changeOption = valor;
  }

  onSubmitComprobantes() {
    $("#preloader").show();
    $("#preloader").css("opacity", 0.8);
    var that = $("#savingwhitout");
    that.toggleClass("btn-wait-light");
    that.prop("disabled", true);
    let agregarComprobante: ComprobanteFiscal = new ComprobanteFiscal();
    agregarComprobante.regimen = new RegimenFiscal();
    agregarComprobante.cliente = new ClienteProveedor();
    agregarComprobante.usoCfdi = new UsoCfdi();
    agregarComprobante.serie = new Folios();
    agregarComprobante.formaPago = new FormasPago();
    agregarComprobante.comprobanteFiscalConceptoList = new Array<
      ComprobanteFiscalConcepto
    >();

    agregarComprobante.regimen.id = this.idRegimen;
    agregarComprobante.tipoComprobante = this.formularioComprobanteFiscal.get(
      "tipoComprobante"
    ).value;
    agregarComprobante.cp = this.formularioComprobanteFiscal.get("cp").value;
    agregarComprobante.moneda = this.formularioComprobanteFiscal.get(
      "moneda"
    ).value;
    agregarComprobante.tipoCambio = this.formularioComprobanteFiscal.get(
      "tipoCambio"
    ).value;
    agregarComprobante.usoCfdi.id = this.formularioComprobanteFiscal.get(
      "usoCfdi"
    ).value;
    agregarComprobante.cliente.id = parseInt(
      this.formularioComprobanteFiscal.get("nombreCliente").value
    );
    agregarComprobante.cliente.rfc = this.formularioComprobanteFiscal.get(
      "rfcCliente"
    ).value;
    agregarComprobante.serie.id = this.formularioComprobanteFiscal.get(
      "serie"
    ).value;
    if (this.formularioComprobanteFiscal.get("manualFolio").value != null) {
      agregarComprobante.folio_ind = this.formularioComprobanteFiscal.get(
        "manualFolio"
      ).value;
    }

    //agregarComprobante.tipoRelacion = this.formularioComprobanteFiscal.get('tipoRelacion').value;
    agregarComprobante.uuid = this.formularioComprobanteFiscal.get(
      "uuid"
    ).value;
    agregarComprobante.descuento = parseFloat(
      this.formularioComprobanteFiscal.get("totaldescuento").value
    );
    agregarComprobante.motivoDescuento = this.formularioComprobanteFiscal.get(
      "motivoDescuento"
    ).value;
    agregarComprobante.subtotal = parseFloat(
      this.formularioComprobanteFiscal.get("subtotal").value
    );
    agregarComprobante.montoIva = parseFloat(
      this.formularioComprobanteFiscal.get("montoIva").value
    );
    agregarComprobante.total = parseFloat(
      this.formularioComprobanteFiscal.get("total").value
    );
    agregarComprobante.formaPago.id = this.formularioComprobanteFiscal.get(
      "formaPago"
    ).value;
    agregarComprobante.condicionPago = this.formularioComprobanteFiscal.get(
      "condicionPago"
    ).value;
    agregarComprobante.numeroCuenta = this.formularioComprobanteFiscal.get(
      "numeroCuenta"
    ).value;
    agregarComprobante.metodoPago = this.formularioComprobanteFiscal.get(
      "metodoPago"
    ).value;
    agregarComprobante.observacion = this.formularioComprobanteFiscal.get(
      "observacion"
    ).value;
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];

    if (this.ivaExcento == true) {
      agregarComprobante.tipoFactor = 1;
    } else {
      agregarComprobante.tipoFactor = 0;
    }

    //agregarConceptoComprobante.concepto.producto = new Producto();
    //agregarConceptoComprobante.concepto.unidad = new Unidad();
    //agregarConceptoComprobante.concepto.empresa = new Empresa();

    let listC = new Array<ComprobanteFiscalConcepto>();

    //var datosConceptos: string[][] = [];
    var y = control.length - 1;
    for (var campos = 0; y >= campos; campos += 1) {
      let agregarConceptoComprobante: ComprobanteFiscalConcepto = new ComprobanteFiscalConcepto();
      agregarConceptoComprobante.concepto = new Concepto();
      campos - 1;
      //console.log("Entro muchas veces", campos);

      /*control.controls[campos].get('cantidad').value,
            control.controls[campos].get('unidad').value,
            control.controls[campos].get('claveIdentificacion').value,
            control.controls[campos].get('precioUnitario').value,
            control.controls[campos].get('importe').value]); */

      //agregarConceptoComprobante.concepto.unidad.id = control.controls[campos].get('unidad').value;
      agregarConceptoComprobante.concepto.id = control.controls[campos].get(
        "idprodserv"
      ).value;
      agregarConceptoComprobante.cantidad = control.controls[campos].get(
        "cantidad"
      ).value;
      agregarConceptoComprobante.claveIdentificacion = control.controls[
        campos
      ].get("claveIdentificacion").value;
      
      agregarConceptoComprobante.precioUnitario = Number(control.controls[campos].get(
        "precioUnitario"
      ).value).toFixed(2);
      agregarConceptoComprobante.importe = parseFloat(
        control.controls[campos].get("importe").value
      );
      agregarConceptoComprobante.impuesto = 0;
      agregarConceptoComprobante.tasaCuota =
        control.controls[campos].get("ivaFrontera").value == true ? 0.08 : 0.16;
      agregarConceptoComprobante.descripcion = control.controls[campos].get(
        "descripcionAdd"
      ).value;
      agregarConceptoComprobante.descuento =
        !isNaN(parseFloat(control.controls[campos].get("descuento").value)) &&
        isFinite(control.controls[campos].get("descuento").value)
          ? control.controls[campos].get("descuento").value
          : 0.0;

      agregarConceptoComprobante.ivaRetenido = control.controls[campos].get(
        "ivaRetenido"
      ).value;
      agregarConceptoComprobante.isrRetenido =
        control.controls[campos].get("isrRetenido").value == 0 ? false : true;
      agregarConceptoComprobante.iepsRetenido = control.controls[campos].get(
        "ieps"
      ).value;
      agregarConceptoComprobante.ivaExcento =
        control.controls[campos].get("ivaExcento").value == 0 ? false : true;

      listC[campos] = agregarConceptoComprobante;

      campos + 1;
    }
    agregarComprobante.comprobanteFiscalConceptoList = listC;
    this.compobantefiscalservice
      .create(agregarComprobante)
      .then((dato) => {
        this.changeOption = 1;
        $("#preloader").css("opacity", 1);
        $("#preloader").hide();

        that.toggleClass("btn-wait-light");
        that.prop("disabled", false);
      })
      .catch((error) => {
        console.log(error);
        $("#preloader").css("opacity", 1);
        $("#preloader").hide();
        that.toggleClass("btn-wait-light");
        that.prop("disabled", false);
      });
  }

  formaPagoClic() {
    if (this.formularioComprobanteFiscal.get("formaPago").value == 20) {
      this.formularioComprobanteFiscal.get("metodoPago").setValue(1);
    } else {
      this.formularioComprobanteFiscal.get("metodoPago").setValue(0);
    }
  }

  editarComprobanteFiscal(item_edit: any) {
    setTimeout(() => {
      if (item_edit.regimen.id && item_edit.regimen.id > 0) {
        this.autocompleteRegimenEmpresa.getDetalle(item_edit.regimen.id);
        this.formularioComprobanteFiscal
          .get("regimen")
          .setValue(item_edit.regimen.id);
      }
      if (item_edit.cliente.id && item_edit.cliente.id > 0) {
        this.autocompleteNombreCliente.getDetalle(item_edit.cliente.id);
        this.formularioComprobanteFiscal
          .get("nombreCliente")
          .setValue(item_edit.cliente.id);
      }
    }, 50);

    setTimeout(() => {
      this.onClick_edit(item_edit);
    }, 150);
  }

  onClick_edit(entity_edit: any) {
    //console.log("SEGUNDO EN EDITAR", entity_edit);
    this.idEdit = entity_edit.id;
    this.formularioComprobanteFiscal
      .get("tipoComprobante")
      .setValue(entity_edit.tipoComprobante);
    this.formularioComprobanteFiscal.get("cp").setValue(entity_edit.cp);
    this.formularioComprobanteFiscal.get("moneda").setValue(entity_edit.moneda);
    this.formularioComprobanteFiscal
      .get("tipoCambio")
      .setValue(entity_edit.tipoCambio);
    this.formularioComprobanteFiscal
      .get("usoCfdi")
      .setValue(entity_edit.usoCfdi.id);
    this.formularioComprobanteFiscal
      .get("nombreCliente")
      .setValue(entity_edit.cliente.id);
    this.formularioComprobanteFiscal
      .get("rfcCliente")
      .setValue(entity_edit.cliente.rfc);
    this.formularioComprobanteFiscal
      .get("serie")
      .setValue(entity_edit.serie.id);
    this.formularioComprobanteFiscal
      .get("manualFolio")
      .setValue(entity_edit.folio_ind);
    this.formularioComprobanteFiscal
      .get("tipoRelacion")
      .setValue(entity_edit.tipoRelacion);
    this.formularioComprobanteFiscal.get("uuid").setValue(entity_edit.uuid);
    this.formularioComprobanteFiscal
      .get("totaldescuento")
      .setValue(entity_edit.descuento);
    this.formularioComprobanteFiscal
      .get("motivoDescuento")
      .setValue(entity_edit.motivoDescuento);
    this.formularioComprobanteFiscal
      .get("subtotal")
      .setValue(entity_edit.subtotal);
    this.formularioComprobanteFiscal
      .get("montoIva")
      .setValue(entity_edit.montoIva);
    this.formularioComprobanteFiscal.get("total").setValue(entity_edit.total);
    this.formularioComprobanteFiscal
      .get("formaPago")
      .setValue(entity_edit.formaPago.id);
    this.formularioComprobanteFiscal
      .get("condicionPago")
      .setValue(entity_edit.condicionPago);
    this.formularioComprobanteFiscal
      .get("numeroCuenta")
      .setValue(entity_edit.numeroCuenta);
    this.formularioComprobanteFiscal
      .get("metodoPago")
      .setValue(entity_edit.metodoPago);
    this.formularioComprobanteFiscal
      .get("observacion")
      .setValue(entity_edit.observacion);

    var letrai = 0;
    var numcampos = 0;

    this.conceptoLista = entity_edit.comprobanteFiscalConceptoList;

    for (let concepttos of entity_edit.comprobanteFiscalConceptoList) {
      var i = entity_edit.comprobanteFiscalConceptoList.length - 1;
      const control: FormArray = <FormArray>(
        this.invoiceForm.controls["itemRows"]
      );
      this.onSelectedTConceptos(concepttos.concepto.id, letrai);
      control.controls[letrai]
        .get("descripcion")
        .setValue(concepttos.concepto.nombre);
      control.controls[letrai]
        .get("idprodserv")
        .setValue(concepttos.concepto.id);
      control.controls[letrai].get("cantidad").setValue(concepttos.cantidad);
      control.controls[letrai]
        .get("precioUnitario")
        .setValue(concepttos.precioUnitario);
      control.controls[letrai].get("descuento").setValue(concepttos.descuento);
      control.controls[letrai]
        .get("descripcionAdd")
        .setValue(concepttos.descripcion);
      this.calculaTotales(letrai);
      let addimpuestos = this.formularioComprobanteFiscal.get(
        "impuestoPorConceptocheck"
      );
      var checkin = false;
      if (concepttos.ivaRetenido != null) {
        addimpuestos.setValue(1);
        var checkin = true;
        control.controls[letrai]
          .get("ivaRetenido")
          .setValue(concepttos.ivaRetenido);
        this.calculaIvaRetenido(letrai);
      }
      if (concepttos.isrRetenido) {
        addimpuestos.setValue(1);
        var checkin = true;
        control.controls[letrai]
          .get("isrRetenido")
          .setValue(concepttos.isrRetenido);
      }
      if (concepttos.iepsRetenido != null) {
        addimpuestos.setValue(1);
        var checkin = true;
        control.controls[letrai].get("ieps").setValue(concepttos.iepsRetenido);
      }
      if (concepttos.ivaExcento) {
        addimpuestos.setValue(1);
        var checkin = true;
        control.controls[letrai]
          .get("ivaExcento")
          .setValue(concepttos.ivaExcento);
      }
      if (concepttos.tasaCuota == 0.08) {
        addimpuestos.setValue(1);
        var checkin = true;
        control.controls[letrai].get("ivaFrontera").setValue(1);
      }
      this.impuestosPorConceptoCheck(checkin);
      this.montoTotal();
      letrai += 1;
      this.addNewRow();
    }
    this.deleteRow(letrai);
  }

  editarConcepto(index: number) {
    var name = "concepto" + "[" + index + "]";
    var x = document.getElementById(name);
    x.style.display = "none";
    /*if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }*/
  }

  onSubmitTimbrar(from: String) {
    $("#preloader").show();
    $("#preloader").css("opacity", 0.8);

    var that = $("#savingwhit");
    that.toggleClass("btn-wait-light");
    that.prop("disabled", true);

    let agregarComprobante: ComprobanteFiscal = new ComprobanteFiscal();
    agregarComprobante.regimen = new RegimenFiscal();
    agregarComprobante.cliente = new ClienteProveedor();
    agregarComprobante.usoCfdi = new UsoCfdi();
    agregarComprobante.serie = new Folios();
    agregarComprobante.formaPago = new FormasPago();
    agregarComprobante.comprobanteFiscalConceptoList = new Array<
      ComprobanteFiscalConcepto
    >();

    agregarComprobante.regimen.id = this.idRegimen;
    agregarComprobante.tipoComprobante = this.formularioComprobanteFiscal.get(
      "tipoComprobante"
    ).value;
    agregarComprobante.cp = this.formularioComprobanteFiscal.get("cp").value;
    agregarComprobante.moneda = this.formularioComprobanteFiscal.get(
      "moneda"
    ).value;
    agregarComprobante.tipoCambio = this.formularioComprobanteFiscal.get(
      "tipoCambio"
    ).value;
    agregarComprobante.usoCfdi.id = this.formularioComprobanteFiscal.get(
      "usoCfdi"
    ).value;
    agregarComprobante.cliente.id = this.formularioComprobanteFiscal.get(
      "nombreCliente"
    ).value;
    agregarComprobante.cliente.rfc = this.formularioComprobanteFiscal.get(
      "rfcCliente"
    ).value;
    agregarComprobante.serie.id = this.formularioComprobanteFiscal.get(
      "serie"
    ).value;
    if (this.formularioComprobanteFiscal.get("manualFolio").value != null) {
      agregarComprobante.folio_ind = this.formularioComprobanteFiscal.get(
        "manualFolio"
      ).value;
    }
    //agregarComprobante.tipoRelacion = this.formularioComprobanteFiscal.get('tipoRelacion').value;
    agregarComprobante.uuid = this.formularioComprobanteFiscal.get(
      "uuid"
    ).value;
    agregarComprobante.descuento = this.formularioComprobanteFiscal.get(
      "totaldescuento"
    ).value;
    agregarComprobante.motivoDescuento = this.formularioComprobanteFiscal.get(
      "motivoDescuento"
    ).value;
    agregarComprobante.subtotal = this.formularioComprobanteFiscal.get(
      "subtotal"
    ).value;
    agregarComprobante.montoIva = this.formularioComprobanteFiscal.get(
      "montoIva"
    ).value;
    agregarComprobante.total = this.formularioComprobanteFiscal.get(
      "total"
    ).value;
    agregarComprobante.formaPago.id = this.formularioComprobanteFiscal.get(
      "formaPago"
    ).value;
    agregarComprobante.condicionPago = this.formularioComprobanteFiscal.get(
      "condicionPago"
    ).value;
    agregarComprobante.numeroCuenta = this.formularioComprobanteFiscal.get(
      "numeroCuenta"
    ).value;
    agregarComprobante.metodoPago = this.formularioComprobanteFiscal.get(
      "metodoPago"
    ).value;
    agregarComprobante.observacion = this.formularioComprobanteFiscal.get(
      "observacion"
    ).value;
    const control: FormArray = <FormArray>this.invoiceForm.controls["itemRows"];

    if (this.ivaExcento == true) {
      agregarComprobante.tipoFactor = 1;
    } else {
      agregarComprobante.tipoFactor = 0;
    }

    //agregarConceptoComprobante.concepto.producto = new Producto();
    //agregarConceptoComprobante.concepto.unidad = new Unidad();

    let listC = new Array<ComprobanteFiscalConcepto>();

    //var datosConceptos: string[][] = [];
    var y = control.length - 1;

    for (var campos = 0; y >= campos; campos += 1) {
      let agregarConceptoComprobante: ComprobanteFiscalConcepto = new ComprobanteFiscalConcepto();
      agregarConceptoComprobante.concepto = new Concepto();
      campos - 1;

      /*control.controls[campos].get('cantidad').value,
            control.controls[campos].get('unidad').value,
            control.controls[campos].get('claveIdentificacion').value,
            control.controls[campos].get('precioUnitario').value,
            control.controls[campos].get('importe').value]);*/
      if (this.conceptoLista && campos < this.conceptoLista.length) {
        agregarConceptoComprobante.id = this.conceptoLista[campos].id;
      }
      agregarConceptoComprobante.cantidad = control.controls[campos].get(
        "cantidad"
      ).value;
      //agregarConceptoComprobante.concepto.unidad.id = control.controls[campos].get('unidad').value;
      agregarConceptoComprobante.concepto.id = control.controls[campos].get(
        "idprodserv"
      ).value;
      agregarConceptoComprobante.claveIdentificacion = control.controls[
        campos
      ].get("claveIdentificacion").value;
      agregarConceptoComprobante.precioUnitario = Number(control.controls[campos].get(
        "precioUnitario"
      ).value).toFixed(2);
      agregarConceptoComprobante.importe = parseFloat(
        control.controls[campos].get("importe").value
      );
      agregarConceptoComprobante.impuesto = 0;
      // agregarConceptoComprobante.descuento = control.controls[campos].get('descuento').value;
      //console.log(campos);
      agregarConceptoComprobante.tasaCuota =
        control.controls[campos].get("ivaFrontera").value == true ? 0.08 : 0.16;
      agregarConceptoComprobante.descripcion = control.controls[campos].get(
        "descripcionAdd"
      ).value;
      agregarConceptoComprobante.descuento =
        !isNaN(parseFloat(control.controls[campos].get("descuento").value)) &&
        isFinite(control.controls[campos].get("descuento").value)
          ? control.controls[campos].get("descuento").value
          : 0.0;

      agregarConceptoComprobante.ivaRetenido = control.controls[campos].get(
        "ivaRetenido"
      ).value;
      agregarConceptoComprobante.isrRetenido =
        control.controls[campos].get("isrRetenido").value == 0 ? false : true;
      agregarConceptoComprobante.iepsRetenido = control.controls[campos].get(
        "ieps"
      ).value;

      agregarConceptoComprobante.ivaExcento =
        control.controls[campos].get("ivaExcento").value == 0 ? false : true;

      listC[campos] = agregarConceptoComprobante;

      campos + 1;
    }
    agregarComprobante.comprobanteFiscalConceptoList = listC;

    if (from == "create" && !this.idEdit) {
      this.compobantefiscalservice
        .create(agregarComprobante)
        .then((dato) => {
          let id = dato.id;
          this.idEdit = id;
          this.compobantefiscalservice
            .timbrado(id)
            .then((data) => {
              that.toggleClass("btn-wait-light");
              that.prop("disabled", false);
              this.modalEnvioMail.reset();
              this.entidad_elimar = dato;

              this.modalEnvioMail.reset();
              if (data.mensaje == "Comprobante timbrado") {
                $("#modalMensaje #tituloAlerta").html(data.mensaje);
                $("#modalMensaje p").html("");
                $("#modalMensaje #buttonAlert").html("Enviar");
                var divSuccess = document.getElementById("successMail");
                divSuccess.classList.add("ok");
                $("#modalMensaje").modal("show");
              } else {
                $("#modalError #tituloAlerta").html("Algo salio mal");
                $("#modalError p").html(data.mensaje);
                $("#modalError #buttonAlert").html("OK");
                var divSuccess = document.getElementById("successMail");
                divSuccess.classList.remove("ok");
                $("#modalError").modal("show");
              }
              $("#preloader").css("opacity", 1);
              $("#preloader").hide();
            })
            .catch((error) => {
              that.toggleClass("btn-wait-light");
              that.prop("disabled", false);
              $("#modalError #tituloAlerta").html("Algo salio mal");
              $("#modalError p").html(
                "Ocurrio un error al timbrar el comprobante fiscal."
              );
              $("#modalError #buttonAlert").html("OK");
              var divSuccess = document.getElementById("successMail");
              divSuccess.classList.remove("ok");
              $("#modalError").modal("show");
              $("#preloader").css("opacity", 1);
              $("#preloader").hide();
              console.log(error);
            });
        })
        .catch((error) => {
          that.toggleClass("btn-wait-light");
          that.prop("disabled", false);
          $("#modalError #tituloAlerta").html("Algo salio mal");
          $("#modalError p").html(
            "Ocurrio un error al crear el comprobante fiscal."
          );
          $("#modalError #buttonAlert").html("OK");
          var divSuccess = document.getElementById("successMail");
          divSuccess.classList.remove("ok");
          $("#modalError").modal("show");
          $("#preloader").css("opacity", 1);
          $("#preloader").hide();
          console.log(error);
        });
    } else if (from == "editar" || this.idEdit) {
      agregarComprobante.id = this.idEdit;

      this.compobantefiscalservice
        .update(agregarComprobante)
        .then((dato) => {
          this.compobantefiscalservice
            .timbrado(this.idEdit)
            .then((data) => {
              that.toggleClass("btn-wait-light");
              that.prop("disabled", false);
              this.modalEnvioMail.reset();
              this.entidad_elimar = agregarComprobante;
              this.modalEnvioMail.reset();
              if (data.mensaje == "Comprobante timbrado") {
                $("#modalMensaje #tituloAlerta").html(data.mensaje);
                $("#modalMensaje p").html("");
                $("#modalMensaje #buttonAlert").html("Enviar");
                var divSuccess = document.getElementById("successMail");
                divSuccess.classList.add("ok");
                $("#modalMensaje").modal("show");
              } else {
                $("#modalError #tituloAlerta").html("Algo salio mal");
                $("#modalError p").html(data.mensaje);
                $("#modalError #buttonAlert").html("OK");
                var divSuccess = document.getElementById("successMail");
                divSuccess.classList.remove("ok");
                $("#modalError").modal("show");
              }
              $("#preloader").css("opacity", 1);
              $("#preloader").hide();
            })
            .catch((error) => {
              that.toggleClass("btn-wait-light");
              that.prop("disabled", false);
              $("#modalError #tituloAlerta").html("Algo salio mal");
              $("#modalError p").html(
                "Ocurrio un error al timbrar el comprobante fiscal."
              );
              $("#modalError #buttonAlert").html("OK");
              var divSuccess = document.getElementById("successMail");
              divSuccess.classList.remove("ok");
              $("#modalError").modal("show");
              $("#preloader").css("opacity", 1);
              $("#preloader").hide();
              console.log(error);
            });
        })
        .catch((error) => {
          that.toggleClass("btn-wait-light");
          that.prop("disabled", false);
          $("#modalError #tituloAlerta").html("Algo salio mal");
          $("#modalError p").html(
            "Ocurrio un error al actualizar el comprobante fiscal."
          );
          $("#modalError #buttonAlert").html("OK");
          var divSuccess = document.getElementById("successMail");
          divSuccess.classList.remove("ok");
          $("#modalError").modal("show");
          $("#preloader").css("opacity", 1);
          $("#preloader").hide();
          console.log(error);
        });
    }
  }

  isTimbrado() {
    var button = document.getElementById("buttonAlert").textContent;
    if (button == "Enviar") {
      $("#modalMensaje").modal("hide");
      this.change(1);
      this.sendMail();
    } else {
      $("#modalMensaje").modal("hide");
      this.change(1);
    }
  }
  conceptoEdit(index: number) {
    this.editarConcepto(index);
  }
  sendMail() {
    console.log("CORREOS ENVIADOS");
  }

  enviarComprobanteFiscal(id: any) {
    let correos = this.modalEnvioMail.get("direccionMail").value;
    var that = $("#buttonAlert");
    that.addClass("btn-wait");
    that.prop("disabled", true);

    this.mailService
      .sendMailFilesComprobante(correos, id.id)
      .then((response) => {
        that.removeClass("btn-wait");
        that.prop("disabled", false);
        $("#modalMensaje").modal("hide");
        this.change(1);
      })
      .catch((error) => {
        console.log(error);
        that.removeClass("btn-wait");
        that.prop("disabled", false);
        this.change(1);
      });
  }

  closeError() {
    this.change(1);
  }

  commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value != null) {
      let valiscomma = control.value.includes(",");
      if (valiscomma) {
        const emails = control.value.split(",").map((e) => e.trim());
        const forbidden = emails.some((email) =>
          Validators.email(new FormControl(email))
        );
        return forbidden ? { toAddress: { value: control.value } } : null;
      } else {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let va = re.test(String(control.value).toLowerCase().trim());

        return !va ? { toAddress: { value: control.value } } : null;
      }
    } else {
      return null;
    }
  };
}
