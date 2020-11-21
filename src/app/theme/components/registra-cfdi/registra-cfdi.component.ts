import { Component, OnInit } from '@angular/core';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { Empresa } from 'app/entidades/empresa';
import { RegimenFiscal } from 'app/entidades/regimen-fiscal';
import { CertificadoService } from 'app/servicios-backend/certificado.service';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { RegimenFiscalService } from 'app/servicios-backend/regimen-fiscal.service';
import { HttpHelper } from 'app/http-helper';
import { RiesgoPuesto } from 'app/entidades/riesgo-puesto';
import { DropzoneService } from 'app/servicios-backend/dropzone.service';
import { Subject } from 'rxjs/Subject';

declare var Dropzone: any;

@Component({
    selector: 'app-registra-cfdi',
    templateUrl: './registra-cfdi.component.html',
    styleUrls: ['./registra-cfdi.component.scss']
})
export class RegistraCFDIComponent implements OnInit {
    public form: FormGroup;
    public cedulaIdentificacionFiscal: AbstractControl;
    public logo: AbstractControl;
    public empresa: Empresa = new Empresa();
    public rowsOnPage: number = 10;
    public sortBy: string;
    public nombreCert: string;
    public nombreLogo: string;
    public sortOrder: string = 'asc';
    public page: number = 1;
    public totalCertificados: number = 0;
    public totalRegimenes: number = 0;
    public query: string = '';
    public subirIMG1: boolean = false;
    public subirIMG2: boolean = false;
    public eventosDropzone: Subject<{ id: String, evento: String, valor: String }> = new Subject();
    public tArchivo: string = ".jpg";
    public arAcept: string = ".jpeg,.jpg,.pdf,.png";
    public tipo = "/upload";
    public modulo = '1';  //
    public submodulo = 'cfdi'; //carpeta
    public idDZa = "#dZUpload"; // Logotipo de la empresa
    public idDZb = "#dZUpload1"; // Cedula de identificación Fiscal
    // public validacionCert = this.nombreCert == null || this.nombreCert == undefined || this.nombreCert == ' ';
    public validacionLogo = this.nombreLogo == null || this.nombreLogo == undefined || this.nombreLogo == ' ';
    public id: any;
    public nombre: any;
    public colonia: any;
    public localidad: any;
    public referencia: any;
    public municipio: any;
    public estado: any;
    public pais: any;
    public rfc: any;
    public registroPatronal: any;
    public riesgoPuesto: any;
    public calle: any;
    public numInterior: any;
    public numExterior: any;
    public lugarExpedicion: any;
    public error: boolean;
    public validancia: boolean = false;
    public cond: boolean = true;
    constructor(private empresaService: EmpresaService, private certificadoService: CertificadoService, private fb: FormBuilder, private regimenFiscalService: RegimenFiscalService, private dropzoneService: DropzoneService) {

        this.form = fb.group({
            'id': [''],
            'nombre': [''],
            'colonia': [''],
            'localidad': [''],
            'referencia': [''],
            'municipio': [''],
            'estado': [''],
            'pais': [''],
            'rfc': [''],
            'registroPatronal': [''],
            'riesgoPuesto': [''],
            'calle': [''],
            'numInterior': [''],
            'numExterior': [''],
            'lugarExpedicion': [''],
            'cedulaIdentificacionFiscal': ['',
                Validators.required
            ],
            'logo': [''],
        });
        this.cedulaIdentificacionFiscal = this.form.controls['cedulaIdentificacionFiscal'];
        this.logo = this.form.controls['logo'];
    }

    ngOnInit() {
        //AQUI EMPIEZA LO DE IMAGEN
        this.dropzone();
        this.eventosDropzone.subscribe(
            (data: { id: string, evento: string, valor: any }) => {
                console.log(data);
                if (data.id == this.idDZb) {
                    this.nombreCert = data.valor;
                }
                else {
                    this.nombreLogo = data.valor;
                }
                console.log(data);

            }
        );
    }
    // Modulo de archivos 
    //   3 - Cedula_Identificacion
    //   1 - Logotipo 
    dropzone() {
        //AQUI PASA ALGO CUANDO SE REGRESA O ENTRA POR PRIMERA VEZ
        this.empresaService.getDetalle().then(
            (data) => {
                if (data != undefined && data.id != undefined) {
                    let id = data.id;
                    this.dropzoneService.dropzone(this.idDZa, this.tArchivo, this.arAcept, this.tipo, 3, id, this.eventosDropzone, false);
                    this.dropzoneService.dropzone(this.idDZb, this.tArchivo, this.arAcept, this.tipo, 1, id, this.eventosDropzone, false);
                }
            }
        )
            .catch();
    }

    btnNext() {
        this.empresaService.getDetalle().then((dataEmp: any) => {
            this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {
                this.totalCertificados = dataCert.total;
                this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {
                    this.totalRegimenes = dataReg.total;
                    this.empresa = dataEmp;
                    let condicionCSD = this.totalCertificados == 0;
                    let condicionRF = this.totalRegimenes == 0;
                    if (condicionCSD) {
                        $("#cfdiModal").modal("hide");
                        $('#csdModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (condicionRF) {
                        $("#cfdiModal").modal("hide");
                        $('#rfModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else {
                        $("#cfdiModal").modal("hide");
                    }
                }, (error) => {
                    console.log("Hubo un error", error);
                }
                );
            }, (error) => {
                console.log("Hubo un error", error);
            }
            );
        }).catch((error) => {
            console.log(error);
        });
    }
    btnPrev() {
        // console.log("btn regresar");
        let dfeCondition: boolean = false;

        this.empresaService.getDetalle().then((dataEmp: any) => {

            this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {

                this.totalCertificados = dataCert.total;

                this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {

                    this.totalRegimenes = dataReg.total;
                    let dRFC = dataEmp.rfc == undefined || dataEmp.rfc == null || dataEmp.rfc == 0 || dataEmp.rfc == " ";

                    // let dRePa = dataEmp.registroPatronal == undefined || dataEmp.registroPatronal == null || dataEmp.registroPatronal == 0 || dataEmp.registroPatronal == " ";

                    // let dRiPu = dataEmp.riesgoPuesto.id == undefined || dataEmp.riesgoPuesto.id == null || dataEmp.riesgoPuesto.id == 0 || dataEmp.riesgoPuesto.id == " ";

                    let dLuEx = dataEmp.lugarExpedicion == undefined || dataEmp.lugarExpedicion == null || dataEmp.lugarExpedicion == 0 || dataEmp.lugarExpedicion == " ";

                    let dLogo = dataEmp.logo == undefined || dataEmp.logo == null || dataEmp.logo == 0 || dataEmp.logo == " ";

                    let dCeId = dataEmp.cedulaIdentificacionFiscal == undefined || dataEmp.cedulaIdentificacionFiscal == null || dataEmp.cedulaIdentificacionFiscal == 0 || dataEmp.cedulaIdentificacionFiscal == " ";

                    if (dataEmp.rfc != undefined && dataEmp.lugarExpedicion != undefined) {
                        dfeCondition = true;
                    }

                    // let condicionDFE = dataEmp.rfc  && dataEmp.lugarExpedicion;
                    let condicionCFDI = dataEmp.logo && dataEmp.cedulaIdentificacionFiscal;
                    // let condicionCSD = this.totalCertificados == 0;
                    // let condicionRF = this.totalRegimenes == 0;
                    console.log(dataEmp.rfc, dataEmp.lugarExpedicion);

                    console.log(dLogo, dCeId);


                    if (dfeCondition) {
                        $("#cfdiModal").modal("hide");
                        $('#dfeModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (this.totalRegimenes) {
                        $("#cfdiModal").modal("hide");
                        $('#rfModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (this.totalCertificados) {
                        $("#cfdiModal").modal("hide");
                        $('#csdModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else {
                        $("#cfdiModal").modal("hide");
                    }
                }, (error) => {
                    console.log("Hubo un error", error);
                }
                );
            }, (error) => {
                console.log("Hubo un error", error);
            }
            );
        }).catch((error) => {
            console.log(error);
        });
    }
    btnOM() {
        $("#cfdiModal").modal("hide");
    }

    agregarIMG() {
        this.empresaService.getDetalle().then((data) => {
            this.id = data.id;
            this.nombre = data.nombre;
            this.colonia = data.colonia;
            this.localidad = data.localidad;
            this.referencia = data.referencia;
            this.municipio = data.municipio
            this.estado = data.estado;
            this.pais = data.pais;
            this.rfc = data.rfc;
            this.registroPatronal = data.registroPatronal;
            this.riesgoPuesto = data.riesgoPuesto;
            this.calle = data.calle;
            this.numInterior = data.numInterior;
            this.numExterior = data.numExterior;
            this.lugarExpedicion = data.lugarExpedicion;
            if (this.nombreCert) {
                this.validancia = true
                if (this.validancia == true) {
                    let dataIMG = new Empresa();
                    dataIMG.id = this.id;
                    dataIMG.nombre = this.nombre;
                    dataIMG.colonia = this.colonia;
                    dataIMG.localidad = this.localidad;
                    dataIMG.referencia = this.referencia;
                    dataIMG.municipio = this.municipio;
                    dataIMG.estado = this.estado;
                    dataIMG.pais = this.pais;
                    dataIMG.rfc = this.rfc;
                    dataIMG.registroPatronal = this.registroPatronal;
                    // dataIMG.riesgoPuesto = this.riesgoPuesto;
                    dataIMG.calle = this.calle;
                    dataIMG.numInterior = this.numInterior;
                    dataIMG.numExterior = this.numExterior;
                    dataIMG.lugarExpedicion = this.lugarExpedicion;
                    dataIMG.cedulaIdentificacionFiscal = this.nombreCert;
                    dataIMG.logo = this.nombreLogo;
                    console.log(dataIMG)
                    this.empresaService.update(dataIMG).then((data) => {
                        this.btnNext();
                    }).catch((error) => {
                        console.log("ERROR: ", error);
                    });
                }
                else {
                }
            }
            else {
                console.log("Error, Favor de llenar los campos obligatorios.");
                this.error = true;
            }
        }).catch((error) => {
            console.log("ERROR", error);
        });
    }

}
