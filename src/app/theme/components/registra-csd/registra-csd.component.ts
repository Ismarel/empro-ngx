import { Component, OnInit } from '@angular/core';
import { Certificado } from 'app/entidades/certificado';
import { CertificadoService } from 'app/servicios-backend/certificado.service';
import { Empresa } from 'app/entidades/empresa';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { RegimenFiscalService } from 'app/servicios-backend/regimen-fiscal.service';
import { Subject } from 'rxjs/Subject';
import { DropzoneService } from 'app/servicios-backend/dropzone.service';

@Component({
    selector: 'app-registra-csd',
    templateUrl: './registra-csd.component.html',
    styleUrls: ['./registra-csd.component.scss']
})
export class RegistraCSDComponent implements OnInit {
    certificado: Certificado = new Certificado();
    public valor: number;
    public archivoCer: AbstractControl;
    public numeroCertificado: AbstractControl;
    public validoDesde: AbstractControl;
    public validoHasta: AbstractControl;
    public archivoLlave: AbstractControl;
    public password: AbstractControl;
    public formCertificado: FormGroup;
    public submitted: boolean = false;
    public error: boolean;
    empresa: Empresa = new Empresa();
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalCertificados: number = 0;
    totalRegimenes: number = 0;
    query: string = '';
    public eventosDropzone: Subject<{ id: String, evento: String, valor: String }> = new Subject();
    public tArchivo: string = ".cer";
    public arAcept: string = ".cer";
    public tArchivoa: string = ".key";
    public arAcepta: string = ".key";
    public tipo = "/upload";
    public proyecto = '3';
    public modulo = '1';
    public submodulo = 'csd'; // carpeta
    public idDZa = "#dZUploadCSDCER"; // Archivo con extension .cer
    public idDZb = "#dZUploadCSDKEY"; // Archivo con extension .key
    public nombreCert: string;
    public nombreKey: string;
    public cond: boolean = false; // Verdadero para renombrar, Falso para no renombrar
    public certCorrect: Certificado;
    public idCert: number;
    constructor(private certificadoService: CertificadoService, fb: FormBuilder, private empresaService: EmpresaService, private regimenFiscalService: RegimenFiscalService, private dropzoneService: DropzoneService) {
        this.formCertificado = fb.group({
            'archivoCer': ['',
                Validators.required,
            ],
            'archivoLlave': ['',
                Validators.required,
            ],
            'password': ['',
                Validators.required,
            ],
        });
        this.archivoCer = this.formCertificado.controls['archivoCer'];
        this.archivoLlave = this.formCertificado.controls['archivoLlave'];
        this.password = this.formCertificado.controls['password'];
    }

    ngOnInit() {
        this.certCorrect = new Certificado();
        this.dropzone();
        this.eventosDropzone.subscribe(
            (data: { id: string, evento: string, valor: string }) => {
                // console.log("DATA: ", data.id , ", ", data.evento, ", ", data.valor);
                console.log(data);

                if (data.id == this.idDZa) {
                    console.log("nombreCert: ", data.valor);
                    this.nombreCert = data.valor;
                }
                if (data.id == this.idDZb) {
                    this.nombreKey = data.valor;
                    console.log("nombreKey: ", data.valor);
                }
                let extFile: string[] = data.valor.split(".");
                console.log(extFile[extFile.length - 1]);
                if (data.evento != undefined && data.evento == "success" && extFile[extFile.length - 1] == "cer") {
                    this.certCorrect.archivoCertificado = this.nombreCert;
                    this.certCorrect.archivoLlave = "cer.key";
                    this.certCorrect.empresa = new Empresa();
                    // this.certCorrect.empresa.id=1;
                    this.certCorrect.validoDesde = 1408774713046;
                    this.certCorrect.validoHasta = 1508774713046;
                    this.certCorrect.password = "123456";
                    //ESTA FUNCIÓN ES LA QUE DUPLICA EL DOBLE DE REGISTRO...
                    /*this.certificadoService.create(this.certCorrect).then((data: any) => {
                      console.log("Certificado agregado correctamente", data);
                      // this.btnNext();
                      if(data.id!=undefined){
                        this.certificadoService.getDetalle(data.id)
                        .then( (item)=>{
                          console.log(item);
                          
                        })
                        .catch((error)=>{
                          console.log("error en la consulta", error);
                        });
                      }
                    }).catch((error) => {
                      console.log("Certificado agregado incorrectamente", error);
                    });*/
                }
            });
    }
    // Modulo de archivos 
    //   0 - Certificado_sello
    dropzone() {
        // this.dropzoneService.dropzone(this.idDZa, this.tArchivo, this.arAcept, this.tipo,  this.modulo, this.submodulo, this.eventosDropzone, this.cond);
        // this.dropzoneService.dropzone(this.idDZb, this.tArchivoa, this.arAcepta, this.tipo,  this.modulo, this.submodulo, this.eventosDropzone, this.cond);
        this.empresaService.getDetalle().then(
            (data) => {
                if (data != undefined && data.id != undefined) {
                    let id = data.id;
                    this.dropzoneService.dropzone(this.idDZa, this.tArchivo, this.arAcept, this.tipo, 0, id, this.eventosDropzone, false);
                    this.dropzoneService.dropzone(this.idDZb, this.tArchivoa, this.arAcepta, this.tipo, 0, id, this.eventosDropzone, false);
                }
            }
        )
            .catch();
    }

    btnNext() {
        this.empresaService.getDetalle().then((dataEmp: any) => {
            this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {
                this.totalCertificados = dataCert.total;
                console.log(dataCert);

                this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {
                    this.totalRegimenes = dataReg.total;
                    this.empresa = dataEmp;
                    let condicionRF = this.totalRegimenes == 0;
                    if (condicionRF) {
                        $("#csdModal").modal("hide");
                        $('#rfModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else {
                        $("#csdModal").modal("hide");
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
        $("#csdModal").modal("hide");
        $('#rfModal').modal({ backdrop: 'static', keyboard: false }, "show")
    }
    btnPrev() {
        let cfdiCondition: boolean = false;
        this.empresaService.getDetalle().then((dataEmp: any) => {
            this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {
                this.totalCertificados = dataCert.total;
                this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {
                    this.totalRegimenes = dataReg.total;
                    this.empresa = dataEmp;
                    let dRFC = dataEmp.rfc == undefined || dataEmp.rfc == null || dataEmp.rfc == 0 || dataEmp.rfc == " ";
                    let dRePa = dataEmp.registroPatronal == undefined || dataEmp.registroPatronal == null || dataEmp.registroPatronal == 0 || dataEmp.registroPatronal == " ";
                    let dRiPu = dataEmp.riesgoPuesto.id == undefined || dataEmp.riesgoPuesto.id == null || dataEmp.riesgoPuesto.id == 0 || dataEmp.riesgoPuesto.id == " ";
                    let dLuEx = dataEmp.lugarExpedicion == undefined || dataEmp.lugarExpedicion == null || dataEmp.lugarExpedicion == 0 || dataEmp.lugarExpedicion == " ";
                    let dLogo = dataEmp.logo == undefined || dataEmp.logo == null || dataEmp.logo == 0 || dataEmp.logo == " ";
                    let dCeId = dataEmp.cedulaIdentificacionFiscal == undefined || dataEmp.cedulaIdentificacionFiscal == null || dataEmp.cedulaIdentificacionFiscal == 0 || dataEmp.cedulaIdentificacionFiscal == " ";
                    let condicionDFE = dRFC && dRePa && dRiPu && dLuEx;
                    let condicionCFDI = dLogo && dCeId;
                    let condicionCSD = this.totalCertificados == 0;
                    let condicionRF = this.totalRegimenes == 0;
                    if (dataEmp.logo != undefined && dataEmp.cedulaIdentificacionFiscal != undefined) {
                        cfdiCondition = true;
                    }

                    if (cfdiCondition) {
                        $("#csdModal").modal("hide");
                        $('#cfdiModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (condicionCFDI && condicionDFE) {
                        $("#csdModal").modal("hide");
                        $('#dfeModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (condicionRF) {
                        $("#csdModal").modal("hide");
                        $('#cfdiModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else {
                        $("#csdModal").modal("hide");
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
        $("#csdModal").modal("hide");
    }
    onSubmitAgregar() {
        this.submitted = true;
        var password = this.formCertificado.get('password').value;
        var truePassword = password.replace(/(^\s+|\s+$)/g, "");
        if (this.nombreCert && this.nombreKey && password) {
            //if (this.formCertificado.valid) {
            let cert = new Certificado();
            cert.empresa = new Empresa();
            cert.archivoCertificado = this.nombreCert;
            cert.archivoLlave = this.nombreKey;
            /*/cert.numeroCertificado = this.formCertificado.get('numeroCertificado').value;
            let validoDesdeRAW = this.formCertificado.get('validoDesde').value;
            let validoHastaRAW = this.formCertificado.get('validoHasta').value;
            let dateDesde = (new Date(validoDesdeRAW).getTime()) + 86400000;
            let dateHasta = (new Date(validoHastaRAW).getTime()) + 86400000;
            cert.validoDesde = dateDesde;
            cert.validoHasta = dateHasta;*/
            cert.password = truePassword;//this.formCertificado.get('password').value;
            this.certificadoService.create(cert).then((data: any) => {
                console.log("Certificado agregado correctamente", cert);
                this.btnNext();
            }).catch((error) => {
                console.log("Certificado agregado incorrectamente", error);
            });
            /*}
            else {
              console.log("Favor de llenar los campos faltantes");
              this.error = true
            }*/
        }
        else {
            this.error = true
        }
    }
}
