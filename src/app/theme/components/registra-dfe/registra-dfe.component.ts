import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { CertificadoService } from 'app/servicios-backend/certificado.service';
import { Empresa } from 'app/entidades/empresa';
import { NgForm, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RiesgoPuesto } from 'app/entidades/riesgo-puesto';
import { AutocompleteGenericComponent } from 'app/comun/components/autocomplete-generic';
import { RegimenFiscalService } from 'app/servicios-backend/regimen-fiscal.service';
import { CpService } from 'app/servicios-backend/cp.service';

@Component({
    selector: 'app-registra-dfe',
    templateUrl: './registra-dfe.component.html',
    styleUrls: ['./registra-dfe.component.scss']
})
export class RegistraDFEComponent implements OnInit {
    empresa: Empresa = new Empresa();
    formDFE: FormGroup;
    public rfc: AbstractControl;
    public registroPatronal: AbstractControl;
    public riesgoPuesto: AbstractControl;
    public calle: AbstractControl;
    public numInterior: AbstractControl;
    public numExterior: AbstractControl;
    public lugarExpedicion: AbstractControl;
    public submitted: boolean = false;
    public mensajeError: string;
    public error: boolean;
    public showRed: String;
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalCertificados: number = 0;
    totalRegimenes: number = 0;
    query: string = '';
    rfcValid: String;
    sucursal: String;
    @ViewChild('autocompleteRiesgo') autocompleteRiesgo: AutocompleteGenericComponent;
    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;
    constructor(private empresaService: EmpresaService, private certificadoService: CertificadoService, fb: FormBuilder, private regimenFiscalService: RegimenFiscalService, private cpService: CpService) {
        this.formDFE = fb.group({
            'id': [''],
            'nombre': [''],
            'colonia': [''],
            'localidad': [''],
            'referencia': [''],
            'municipio': [''],
            'estado': [''],
            'pais': [''],
            'rfc': ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(13),
                //Validators.pattern(/^[A-Z]{3,4}\d{6}(?:[A-Z\d]{3})?$/)
            ]],
            'registroPatronal': ['', [
                Validators.minLength(5),
                Validators.maxLength(20)
            ]],
            'riesgoPuesto': ['',
            ],
            'calle': ['',
                Validators.maxLength(100)
            ],
            'numInterior': ['',
                Validators.maxLength(10)
            ],
            'numExterior': ['',
                Validators.maxLength(10)
            ],
            'lugarExpedicion': ['',
                Validators.required
            ],
        });

        this.rfc = this.formDFE.controls['rfc'];
        this.registroPatronal = this.formDFE.controls['registroPatronal'];
        this.riesgoPuesto = this.formDFE.controls['riesgoPuesto'];
        this.calle = this.formDFE.controls['calle'];
        this.numInterior = this.formDFE.controls['numInterior'];
        this.numExterior = this.formDFE.controls['numExterior'];
        this.lugarExpedicion = this.formDFE.controls['lugarExpedicion'];

    }

    ngOnInit() {
        this.llenarFormDFE();
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
        var rfc = inputValue, resultado = document.getElementById("resultRFC");
        var rfcCorrecto = this.rfcValido(rfc);
        if (rfcCorrecto) {
            this.rfcValid = "si"
            resultado.classList.add("ok");
        } else {
            this.rfcValid = "no"
            resultado.classList.remove("ok");
        }
    }

    checkRFC(rfc: String) {
        const inputValue = rfc;
        var rfc = inputValue, resultado = document.getElementById("resultRFC");
        var rfcCorrecto = this.rfcValido(rfc);
        if (rfcCorrecto) {
            this.rfcValid = "si"
            resultado.classList.add("ok");
        } else {
            this.rfcValid = "no"
            resultado.classList.remove("ok");
        }
    }

    btnNext() {
        this.empresaService.getDetalle().then((dataEmp: any) => {
            this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {
                this.totalCertificados = dataCert.total;
                this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {
                    this.totalRegimenes = dataReg.total;
                    this.empresa = dataEmp;
                    let dLogo = dataEmp.logo == undefined || dataEmp.logo == null || dataEmp.logo == 0 || dataEmp.logo == " ";
                    let dCeId = dataEmp.cedulaIdentificacionFiscal == undefined || dataEmp.cedulaIdentificacionFiscal == null || dataEmp.cedulaIdentificacionFiscal == 0 || dataEmp.cedulaIdentificacionFiscal == " ";
                    let condicionCFDI = dLogo && dCeId;
                    let condicionCSD = this.totalCertificados == 0;
                    let condicionRF = this.totalRegimenes == 0;
                    if (condicionCFDI) {
                        $("#dfeModal").modal("hide");
                        $('#cfdiModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (condicionCSD) {
                        $("#dfeModal").modal("hide");
                        $('#csdModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else if (condicionRF) {
                        $("#dfeModal").modal("hide");
                        $('#rfModal').modal({ backdrop: 'static', keyboard: false }, "show")
                    }
                    else {
                        $("#dfeModal").modal("hide");
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
        $("#dfeModal").modal("hide");
    }

    onSubmitDFE() {
        this.mensajeError = undefined;
        this.submitted = true;
        var codPost = this.formDFE.get('lugarExpedicion').value;
        if (this.rfcValid == "si") {
            if (codPost != " " && codPost != 0 && this.sucursal != undefined)/*(this.formDFE.valid)*/ {
                let dataEmpresa: Empresa = new Empresa();
                let riesgoPuesto = new RiesgoPuesto();
                dataEmpresa.id = this.formDFE.get('id').value;
                dataEmpresa.nombre = this.formDFE.get('nombre').value;
                dataEmpresa.colonia = this.formDFE.get('colonia').value;
                dataEmpresa.localidad = this.formDFE.get('localidad').value;
                dataEmpresa.referencia = this.formDFE.get('referencia').value;
                dataEmpresa.municipio = this.formDFE.get('municipio').value;
                dataEmpresa.estado = this.formDFE.get('estado').value;
                dataEmpresa.pais = this.formDFE.get('pais').value;
                dataEmpresa.rfc = this.formDFE.get('rfc').value;
                dataEmpresa.registroPatronal = this.formDFE.get('registroPatronal').value;
                console.log(this.formDFE.get('riesgoPuesto').value);
                if (this.formDFE.get('riesgoPuesto').value >= 1 && this.formDFE.get('riesgoPuesto').value <= 5) {
                    riesgoPuesto.id = this.formDFE.get('riesgoPuesto').value;
                } else {
                    riesgoPuesto.id = 0;
                    //riesgoPuesto=null;
                    //dataEmpresa.riesgoPuesto = null;
                }
                dataEmpresa.riesgoPuesto = riesgoPuesto;
                dataEmpresa.calle = this.formDFE.get('calle').value;
                dataEmpresa.numInterior = this.formDFE.get('numInterior').value;
                dataEmpresa.numExterior = this.formDFE.get('numExterior').value;
                dataEmpresa.lugarExpedicion = this.formDFE.get('lugarExpedicion').value;
                console.log(dataEmpresa);
                this.empresaService.update(dataEmpresa).then((data: any) => {
                    this.btnNext();
                    console.log(data);
                }).catch((error) => {
                    console.log(error);
                });
            }
            else {
                this.mensajeError = "Favor de llenar los campos obligatorios marcados con *"
                this.showRed = "si";
                this.error = true;
            }
        } else if (this.rfcValid == "no") {
            this.mensajeError = "El RFC no es valido";
            this.showRed = "no"
            this.error = true;
        }
    }

    llenarFormDFE() {
        this.empresaService.getDetalle().then((dataEmp: any) => {
            this.formDFE.get('id').setValue(dataEmp.id);
            this.formDFE.get('nombre').setValue(dataEmp.nombre);
            this.formDFE.get('colonia').setValue(dataEmp.colonia);
            this.formDFE.get('localidad').setValue(dataEmp.localidad);
            this.formDFE.get('referencia').setValue(dataEmp.referencia);
            this.formDFE.get('pais').setValue(dataEmp.pais);
            this.formDFE.get('rfc').setValue(dataEmp.rfc);
            this.formDFE.get('registroPatronal').setValue(dataEmp.registroPatronal);
            this.formDFE.get('calle').setValue(dataEmp.calle);
            this.formDFE.get('numInterior').setValue(dataEmp.numInterior);
            this.formDFE.get('numExterior').setValue(dataEmp.numExterior);
            this.formDFE.get('colonia').setValue(dataEmp.colonia);
            this.formDFE.get('riesgoPuesto').setValue(dataEmp.riesgoPuesto);
            if (dataEmp.lugarExpedicion) {
                this.autocompleteCodigoP.getLugarExpedicion(dataEmp.lugarExpedicion);
                this.formDFE.get('lugarExpedicion').setValue(dataEmp.lugarExpedicion);
            }
            this.checkRFC(dataEmp.rfc);
        })
    }

    onCodigoPostalSelected(lugarExpedicion: any) {
        if (lugarExpedicion !== undefined && lugarExpedicion != null && lugarExpedicion > 0) {
            // console.log("Obtengo el CP "+ lugarExpedicion);
            this.cpService.consultarLocalizacion(lugarExpedicion).then((data) => {
                this.formDFE.get('municipio').setValue(data.data.municipio);
                this.formDFE.get('estado').setValue(data.data.estado);
                this.formDFE.get('lugarExpedicion').setValue(lugarExpedicion);
            }).catch((error) => {
            });
        }
        else {
            this.formDFE.get('lugarExpedicion').setValue(" ");
        }
    }

    checkSucursal() {
        this.sucursal = "checado"
    }

    activeRiesgo(text: any) {
        var texto = text.target.value;
        if (texto.replace(/(^\s+|\s+$)/g, "").length == 0) {
            this.formDFE.get('registroPatronal').setValue(null);
            this.formDFE.get('riesgoPuesto').setValue(null);
            this.formDFE.get('riesgoPuesto').disable();
        } else {
            this.formDFE.get('riesgoPuesto').enable();
        }
    }
    // onIdRiesgoSelected(id: any) {
    //   if (id !== undefined && id != null && id > 0) {
    //     this.formDFE.get('riesgoPuesto').setValue(id);
    //   } else {
    //     this.formDFE.get('riesgoPuesto').setValue(0);
    //   }
    // }
}
