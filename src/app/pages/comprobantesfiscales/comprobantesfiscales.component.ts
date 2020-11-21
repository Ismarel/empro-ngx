import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ComprobanteFiscal } from '../../entidades/comprobante-fiscal';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ComprobanteFiscalService } from '../../servicios-backend/comprobante-fiscal.service';
import { GlobalState } from '../../global.state';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { ComprobantefiscalComponent } from '../comprobantefiscal/comprobantefiscal.component';
import { ComprobanteidService } from './comprobanteid.service';
import { MailService } from '../../servicios-backend/mail.service';

@Component({
    selector: 'app-comprobantesfiscales',
    templateUrl: './comprobantesfiscales.component.html',
    styleUrls: ['./comprobantesfiscales.component.scss']
})
export class ComprobantesfiscalesComponent implements OnInit {
    FormControl: any;
    formularioComprobantesFiscales: FormGroup;

    data: ComprobanteFiscal[];
    rowsOnPage: number = 10;
    sortBy: string = 'fechaCreacion';
    sortOrder: string = 'desc';
    page: number = 1;
    totalComprobantesFiscales: number = 0;
    public isMenuCollapsed: boolean = false;

    queryComprobantesFiscales: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    changeOption: number;
    entidad_elimar: ComprobanteFiscal;
    public modalEnvioMail: FormGroup;
    public direccionMail: AbstractControl;


    email: string;
    name: string;
    message: string;
    endpoint: string;

    constructor(private comprobantesFiscalesService: ComprobanteFiscalService, private _fb: FormBuilder, private comprobanteidService: ComprobanteidService, private mailService: MailService, private _state: GlobalState) {
        this.modalEnvioMail = _fb.group({
            'direccionMail': ['', Validators.compose([
                Validators.required,
                this.commaSepEmail,
                Validators.minLength(3)
            ]),
            ]
        });
        this.direccionMail = this.modalEnvioMail.controls['direccionMail'];
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.changeOption = 1;
        this.initFormularioComprobanteFiscal();
        this.initFormQuery();
        this.buscar();
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    initFormularioComprobanteFiscal() {
        this.formularioComprobantesFiscales = new FormGroup({
            id: new FormControl(),
            moneda: new FormControl(),
            monedaText: new FormControl(),
            observacion: new FormControl(),
            descuento: new FormControl(),
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
            usoCfdi: new FormControl(),
            regimen: new FormControl(),
            cliente: new FormControl(),
            documento: new FormControl(),
            formaPago: new FormControl(),
            cp: new FormControl(),
            tipoImpuesto: new FormControl(),
            tipoImpuestoText: new FormControl(),
            tipoFactor: new FormControl(),
            tipoFactorText: new FormControl(),
            comprobanteFiscalConceptoList: new FormControl(),

            uuid: new FormControl(),
            rfcCliente: new FormControl(),
            fechaCreacion: new FormControl(),
        });
    }

    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
            'queryComprobantesFiscales': ['',
                [Validators.minLength(1)]
            ]
        });
        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.queryComprobantesFiscales = data.queryComprobantesFiscales;
                this.buscar();
            });
    }

    buscar() {
        this.comprobantesFiscalesService.getComprobanteFiscales(this.queryComprobantesFiscales, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataComprobantes) => {

                this.totalComprobantesFiscales = dataComprobantes.total;
                this.data = dataComprobantes.data;

            }, (errorCliente) => {
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

    change(valor) {
        this.changeOption = valor;
        this.comprobanteidService.incrementValue(0);
    }

    generarPDF(id: any) {
        var that = $("#pdfbutton_" + id);
        that.toggleClass("btn-wait");
        that.prop("disabled", true);

        this.comprobantesFiscalesService.crearPDF(id)
            .then((response) => {
                if (response.ok == "ok") {
                    this.comprobantesFiscalesService.downloadPDF(id);
                    that.prop("disabled", false);
                    that.toggleClass("btn-wait");
                }
            })
            .catch((error) => {
                console.log("Error con el archivo PDF");
                var jsonErr = JSON.parse(error._body);
                console.log(jsonErr);
                $("#pdfbutton_" + id).prop("disabled", false);
                $("#pdfbutton_" + id).removeClass("btn-wait");
                $("#errorMessag" + id).prop("hidden", false);
                $("#errorMessag" + id).find(".message").text(jsonErr.error);
            });
    }

    generarXML(id: any) {
        var that = $("#xmlbutton_" + id);
        that.toggleClass("btn-wait");
        that.prop("disabled", true);
        this.comprobantesFiscalesService.crearXml(id)
            .then((response) => {
                if (response.ok == "ok") {
                    this.comprobantesFiscalesService.downloadXML(id);
                    that.toggleClass("btn-wait");
                    that.prop("disabled", false);
                }
            })
            .catch((error) => {
                console.log("Error con el archivo XML");
                var jsonErr = JSON.parse(error._body);
                console.log(jsonErr.error);
                that.toggleClass("btn-wait");
                that.prop("disabled", false);
                $("#errorMessag" + id).prop("hidden", false);
                $("#errorMessag" + id).find(".message").text(jsonErr.error);
                
            });
    }

    closeAlert(id: any) {
        $("#errorMessag" + id).prop("hidden", true);
    }

    exportarExcel() {
        this.comprobantesFiscalesService.getCSVInfo();
    }

    public prepareEdit(item) {
        this.comprobanteidService.incrementValue(item);
        this.changeOption = 2;
    }

    onClick_elim(entity: any) {
        this.formularioComprobantesFiscales.reset();
        this.entidad_elimar = entity;
    }

    onClick_Cancel(entity: any) {
        this.formularioComprobantesFiscales.reset();
        this.entidad_elimar = entity;

    }

    onClick_sendEmail(entity: any) {
        this.modalEnvioMail.reset();
        this.formularioComprobantesFiscales.reset();
        this.entidad_elimar = entity;

    }
    cancelarComprobanteFiscal(entity: any) {
        $("#row_" + entity.id).addClass('waitcanceled');
        var waitText = "Cancelando";
        var originalText = "Cancelar Comprobante";

        var that = $("#cancel_button");
        that.toggleClass("btn-wait-light");
        that.prop("disabled", true);

        if (that.text() === waitText) {
            that.text(that.prop("data-original-text"));
            that.prop("aria-busy", "false");
        } else {
            that.prop("data-original-text", that.text());
            that.text(waitText);
            that.prop("aria-busy", "true");
        }


        let id = entity.id;
        this.comprobantesFiscalesService.cancelar(id).then((data) => {
            console.log(data);
            console.log("succefull");
            $("#row_" + entity.id).removeClass('waitcanceled');
            $("#row_" + entity.id).addClass('endcanceled');
            $("#row_" + entity.id).addClass('table-cancel');
            $("#cancelbutton_" + entity.id).hide();
            $("#xmlbutton_" + entity.id).hide();
            $('#cancelar').modal('hide');
            that.toggleClass("btn-wait-light");
            that.text(originalText);
            that.prop("disabled", false);
        }).catch(error => {
            $("#row_" + entity.id).removeClass('waitcanceled');
            console.log(error);
            that.toggleClass("btn-wait-light");
            $('#cancelar').modal('hide');
            that.text(originalText);
            that.prop("disabled", false);
        });
    }


    removeComprobanteFiscal(id: any) {
        this.comprobantesFiscalesService.remove(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            console.log(error);
        });
        $('#eliminar').modal('hide');
    }

    enviarComprobanteFiscal(id: any) {

        let correos = this.modalEnvioMail.get('direccionMail').value;
        var that = $("#sendmail_button");
        that.addClass("btn-wait-light");
        that.prop("disabled", true);

        this.mailService.sendMailFilesComprobante(correos, id.id).then((response) => {
            console.log(response);
            that.removeClass("btn-wait-light");
            that.prop("disabled", false);
            $('#send_mail').modal('hide');
        }).catch((error) => {
            console.log(error);
            that.removeClass("btn-wait-light");
            that.prop("disabled", false);
        });
    }

    commaSepEmail = (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value != null) {
            let valiscomma = control.value.includes(',');
            if (valiscomma) {
                const emails = control.value.split(',').map(e => e.trim());
                const forbidden = emails.some(email => Validators.email(new FormControl(email)));
                return forbidden ? { 'toAddress': { value: control.value } } : null;
            } else {
                const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let va = re.test(String(control.value).toLowerCase().trim());

                return !va ? { 'toAddress': { value: control.value } } : null;
            }
        } else {
            return null;
        }

    };


}
