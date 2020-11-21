import { Component, OnInit, ViewChild } from '@angular/core';
import { RegimenFiscal } from 'app/entidades/regimen-fiscal';
import { RegimenFiscalService } from 'app/servicios-backend/regimen-fiscal.service';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TipoRegimen } from 'app/entidades/tipo-regimen';
import { Empresa } from 'app/entidades/empresa';
import { CertificadoService } from 'app/servicios-backend/certificado.service';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { MailService } from '../../../servicios-backend/mail.service';
import { ActualizacionService } from '../../../comun/actualizacion.service';
import { Usuario } from '../../../entidades/usuario';

@Component({
    selector: 'app-registra-rf',
    templateUrl: './registra-rf.component.html',
    styleUrls: ['./registra-rf.component.scss']
})
export class RegistraRFComponent implements OnInit {
    public form: FormGroup;
    public tipoRegimen: AbstractControl;
    regimenFiscal: RegimenFiscal = new RegimenFiscal();
    public valor: number;
    public submitted: boolean = false;
    public mensajeError: string;
    public error: boolean;
    empresa: Empresa = new Empresa();
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalCertificados: number = 0;
    totalRegimenes: number = 0;
    query: string = '';
    empresaSesion: Empresa;
    @ViewChild('autocompleteRegimenes') autocompleteRegimen: AutocompleteGenericComponent;
    usuarioEmpresa: Usuario;
    constructor(fb: FormBuilder, private regimenFiscalService: RegimenFiscalService, private certificadoService: CertificadoService, private empresaService: EmpresaService, private mailService: MailService, private actualizacionService: ActualizacionService) {
        this.form = fb.group({
            'tipoRegimen': ['',
                Validators.required
            ],
        });
        this.tipoRegimen = this.form.controls['tipoRegimen'];
    }

    ngOnInit() {
        this.actualizacionService.usuarioCambios.subscribe(
            (usuario: Usuario) => {
                // this.nombre= nombre;
                console.log("Obtengo datos", usuario);
                localStorage.setItem('emailDefault', usuario.correo);
                this.usuarioEmpresa = usuario;

            }, (error) => {
                console.log(error);
            }
        );
    }
    btnNext() {
        $("#rfModal").modal("hide");
        window.location.reload();
    }
    btnPrev() {
        let csdCondition: boolean = false;
        // let certificates : any;
        this.empresaService.getDetalle().then((dataEmp: any) => {
            this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {
                this.totalCertificados = dataCert.total;
                // certificates = dataCert;
                this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {
                    this.totalRegimenes = dataReg.total;
                    this.empresa = dataEmp;
                    // let condicionDFE = dataEmp.rfc == null || dataEmp.registroPatronal == null || dataEmp.riesgoPuesto.id == null || dataEmp.lugarExpedicion == null;
                    // let condicionCFDI = dataEmp.logo == null || dataEmp.cedulaIdentificacionFiscal == null;
                    // let condicionCSD = this.totalCertificados == 0;
                    // let condicionRF = this.totalRegimenes == 0;
                    let certificates: any[] = dataCert.data;
                    let cfdiCondition;
                    let dfeCondition = dataEmp.rfc && dataEmp.CP
                    // console.log(certificates[0].archivoCertificado,cfdiCondition[0].archivoLlave);
                    // console.log(dataCert.archivoLlave);
                    console.log(dataReg);


                    if (certificates[0].archivoCertificado != undefined && certificates[0].archivoLlave != undefined) {
                        csdCondition = true;
                        $("#rfModal").modal("hide");
                        setTimeout(() => { $('#csdModal').modal({ backdrop: 'static', keyboard: false }, "show") }, 800);
                    } else {
                        $("#rfModal").modal("hide");
                    }

                    // if (csdCondition) {
                    //   $("#rfModal").modal("hide");
                    //   $('#csdModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    // }
                    // else if ( dataEmp.logo && dataEmp.cedulaIdentificacionFiscal ) {
                    //   $("#rfModal").modal("hide");
                    //   $('#cfdiModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    // }
                    // else if (cfdiCondition && dfeCondition) {
                    //   $("#rfModal").modal("hide");
                    //   $('#dfeModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    // }
                    // else {
                    //   $("#rfModal").modal("hide");
                    // }
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
        $("#rfModal").modal("hide");
    }
    onSubmitRegimenes() {
        this.mensajeError = undefined;
        this.submitted = true;
        if (this.form.valid) {
            let datosRegimen: RegimenFiscal = new RegimenFiscal();
            datosRegimen.tipoRegimen = new TipoRegimen();
            datosRegimen.empresa = new Empresa();
            datosRegimen.correo = true;
            datosRegimen.tipoRegimen.id = this.form.get('tipoRegimen').value;
            this.regimenFiscalService.create(datosRegimen).then((data: any) => {
                console.log("El regimen se ha agregado correctamente");
                // this.btnNext();
                $("#rfModal").modal("hide");
                // this.mailService.sendMailBienvenida(this.usuarioEmpresa.correo).then((response)=>{
                //   console.log(response);
                // });
                window.location.reload();
            }).catch((error) => {
                console.log("Algo salió mal: ", error);
            });
        }
        else {
            console.log("Favor de llenar los datos");
            this.error = true;
        }
    }
    onIdRegimenesSelected(tipoRegimen: any) {
        if (tipoRegimen !== undefined && tipoRegimen != null && tipoRegimen > 0) {
            this.form.get('tipoRegimen').setValue(tipoRegimen);
            //console.log("Obtengo el CP "+ tipoRegimen);
        } else {
            this.form.get('tipoRegimen').setValue(0);
        }
    }
}
