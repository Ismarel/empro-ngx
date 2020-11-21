import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { Empresa } from 'app/entidades/empresa';
import { NgForm, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RiesgoPuesto } from 'app/entidades/riesgo-puesto';
import { AutocompleteGenericComponent } from "app/comun/components/autocomplete-generic";
import { CpService } from "app/servicios-backend/cp.service";
import { DropzoneService } from 'app/servicios-backend/dropzone.service';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { GlobalState } from '../../global.state';


@Component({
    selector: 'empresa',
    templateUrl: './empresa.html',
    styleUrls: ['./empresa.scss'],
})
export class EmpresaComponent implements OnInit {
    empresaService: EmpresaService;
    empresa: Empresa = new Empresa();
    formEmpresa: FormGroup;
    cpService: CpService;
    @ViewChild('autocompleteRiesgo') autocompleteRiesgo: AutocompleteGenericComponent;
    @ViewChild('autocompleteCodigoPostal') autocompleteCodigoP: AutocompleteGenericComponent;

    colonias = [];
    valueRequiered: Boolean = false;

    public nomEmp: boolean;
    public rfcEmp: boolean;
    public calleEmp: boolean;
    public numEmp: boolean;
    public cpEmp: boolean;
    public paisEmp: boolean;
    public onRiesgo: boolean;
    public isMenuCollapsed: boolean = false;

    public datos: string;
    public idDZa = "#dZUpload2"; // Logotipo de la empresa
    public idDZb = "#dZUpload3"; // Cedula de identificación Fiscal
    public tArchivo: string = ".jpg";
    public arAcept: string = ".jpeg,.jpg,.pdf,.png";
    public tipo = "/upload";
    public eventosDropzone: Subject<{ id: String, evento: String, valor: String }> = new Subject();
    constructor(empresaService: EmpresaService, cpService: CpService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private dropzoneService: DropzoneService, private http: Http, private _state: GlobalState) {
        this.empresaService = empresaService;
        this.cpService = cpService;
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.checkUrlImages();
        this.getEmpresa();
        this.dropzoneInfo();
        this.formEmpresa = this.fb.group({
            'nombre': [''],
            'rfc': [''],
            'calle': [''],
            'numInterior': [''],
            'numExterior': [''],
            'colonia': [''],
            'localidad': [''],
            'referencia': [''],
            'municipio': [''],
            'estado': [''],
            'pais': [''],
            'lugarExpedicion': [''],
            'registroPatronal': [''],
            'riesgoPuesto': [''],
        });
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    dropzoneInfo() {
        this.empresaService.getDetalle().then(
            (data) => {
                if (data != undefined && data.id != undefined) {
                    let id = data.id;
                    this.dropzoneService.dropzone(this.idDZa, this.tArchivo, this.arAcept, this.tipo, 1, id, this.eventosDropzone, false);
                    this.dropzoneService.dropzone(this.idDZb, this.tArchivo, this.arAcept, this.tipo, 3, id, this.eventosDropzone, false);
                }
            }
        )
            .catch();
    }

    checkUrlImages() {
        localStorage.setItem('cedulaServerUrl', "NA");
        let urlCedula = this.dropzoneService.getUrlServer("cedula");
        this.http.get(urlCedula).subscribe((data) => {
            if (data.status == 200) {
                if (data.statusText == "OK") {
                    localStorage.setItem('cedulaServerUrl', "TRUE");
                }
            }
        });
        localStorage.setItem('logoServerUrl', "NA");
        let urlLogo = this.dropzoneService.getUrlServer("logo");
        this.http.get(urlLogo).subscribe((data) => {
            if (data.status == 200) {
                if (data.statusText == "OK") {
                    localStorage.setItem('logoServerUrl', "TRUE");
                }
            }
        });
    }

    onIdRiesgoSelected(id: any) {
        if (id !== undefined && id != null && id > 0) {
            this.formEmpresa.get('riesgoPuesto').setValue(id);
        } else {
            this.formEmpresa.get('riesgoPuesto').setValue(0);
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
            this.rfcEmp = true;
            resultado.classList.add("ok");
        } else {
            this.rfcEmp = false
            resultado.classList.remove("ok");
        }
    }

    getEmpresa() {
        this.empresaService.getDetalle().then((data: any) => {
            this.empresa = data;
            // console.log(data);
            // console.log(data.token);
        }).catch((error) => {
            // console.log(error);
        });
    }

    cerrarModal() {
        //$('#myModal').modal('hide');
        //$('#myModal').trigger("reset");
    }

    fillDataFormulario(empresa: Empresa) {
        this.formEmpresa.get('nombre').setValue(empresa.nombre);
        this.formEmpresa.get('rfc').setValue(this.empresa.rfc);
        this.formEmpresa.get('calle').setValue(empresa.calle);
        this.formEmpresa.get('numInterior').setValue(empresa.numInterior);
        this.formEmpresa.get('numExterior').setValue(empresa.numExterior);
        if (empresa.lugarExpedicion != undefined && empresa.lugarExpedicion > 0) {
            this.formEmpresa.get('lugarExpedicion').setValue(empresa.lugarExpedicion);
            if (empresa.colonia != undefined && empresa.colonia != '') {
                this.formEmpresa.get('colonia').setValue(empresa.colonia);
            } else {
                this.formEmpresa.get('lugarExpedicion').setValue(null);
            }
            this.formEmpresa.get('localidad').setValue(empresa.localidad);
            this.formEmpresa.get('referencia').setValue(empresa.referencia);
            this.formEmpresa.get('municipio').setValue(empresa.municipio);
            this.formEmpresa.get('estado').setValue(empresa.estado);
            this.formEmpresa.get('pais').setValue(empresa.pais);
            this.formEmpresa.get('registroPatronal').setValue(empresa.registroPatronal);
            this.formEmpresa.get('riesgoPuesto').setValue(empresa.riesgoPuesto['nombre']);
        }
        const inputValue = this.formEmpresa.get('rfc').value;
        var rfc = inputValue, resultado = document.getElementById("rfc");
        var rfcCorrecto = this.rfcValido(rfc);
        if (rfcCorrecto) {
            resultado.classList.add("ok");
            this.rfcEmp = true
        } else {
            this.rfcEmp = false
            resultado.classList.remove("ok");
        }
    }

    onSubmitEdit() {
        let dataEmpresa: Empresa = new Empresa();
        dataEmpresa.riesgoPuesto = new RiesgoPuesto();
        dataEmpresa.id = this.empresa.id;
        dataEmpresa.nombre = this.formEmpresa.get('nombre').value.replace(/(^\s+|\s+$)/g, "");
        dataEmpresa.rfc = this.formEmpresa.get('rfc').value;
        dataEmpresa.calle = this.formEmpresa.get('calle').value.replace(/(^\s+|\s+$)/g, "");
        dataEmpresa.numInterior = this.formEmpresa.get('numInterior').value;
        dataEmpresa.numExterior = this.formEmpresa.get('numExterior').value.replace(/(^\s+|\s+$)/g, "");
        dataEmpresa.colonia = this.formEmpresa.get('colonia').value;
        dataEmpresa.localidad = this.formEmpresa.get('localidad').value;
        dataEmpresa.referencia = this.formEmpresa.get('referencia').value;
        dataEmpresa.municipio = this.formEmpresa.get('municipio').value;
        dataEmpresa.estado = this.formEmpresa.get('estado').value;
        dataEmpresa.pais = this.formEmpresa.get('pais').value.replace(/(^\s+|\s+$)/g, "");
        dataEmpresa.lugarExpedicion = this.formEmpresa.get('lugarExpedicion').value;
        dataEmpresa.registroPatronal = this.formEmpresa.get('registroPatronal').value;
        if (this.formEmpresa.get('riesgoPuesto').value >= 1 && this.formEmpresa.get('riesgoPuesto').value <= 5 && this.formEmpresa.get('riesgoPuesto').value != null) {
            dataEmpresa.riesgoPuesto.id = this.formEmpresa.get('riesgoPuesto').value;
        } else {
            dataEmpresa.riesgoPuesto.id = 0;
        }
        this.checkValidators();
        if (this.valueRequiered == true) {
            this.empresaService.update(dataEmpresa).then((data: any) => {
                //location.reload();
                //this.router.navigate(['/clientes'], {relativeTo: this.route});
                this.getEmpresa();
                $('#myModal').modal('hide');
            }).catch((error) => {
                console.log(error);
                //this.router.navigate(['/empresa']);
                this.getEmpresa();
                $('#myModal').modal('hide');
            });
        }
    }

    checkValidators() {
        var nombreEmpresa = this.formEmpresa.get('nombre').value.replace(/(^\s+|\s+$)/g, "").length;
        var calle = this.formEmpresa.get('calle').value.replace(/(^\s+|\s+$)/g, "").length;
        var numExt = this.formEmpresa.get('numExterior').value.replace(/(^\s+|\s+$)/g, "").length;
        var pais = this.formEmpresa.get('pais').value.replace(/(^\s+|\s+$)/g, "").length;
        if (nombreEmpresa == 0) {
            this.valueRequiered = false;
            this.nomEmp = false;
        } else { this.nomEmp = true }
        if (calle == 0) {
            this.valueRequiered = false;
            this.calleEmp = false
        } else { this.calleEmp = true; }
        if (numExt == 0) {
            this.valueRequiered = false;
            this.numEmp = false;
        } else { this.numEmp = true; }
        if (pais == 0 || pais == null) {
            this.valueRequiered = false;
            this.paisEmp = false;
        } else { this.paisEmp = true; }
        if (nombreEmpresa != 0 && calle != 0 && numExt != 0 && pais != 0 && pais != 0 && this.rfcEmp == true) {
            this.valueRequiered = true
        }
    }

    prepareEdit() {
        this.fillDataFormulario(this.empresa);

        if (this.empresa.registroPatronal.length == 0) {
            this.formEmpresa.get('riesgoPuesto').setValue(null);
            this.onRiesgo = false;
        } else { this.onRiesgo = true; }

        if (this.empresa.riesgoPuesto && this.empresa.riesgoPuesto.id > 0) {
            this.autocompleteRiesgo.getDetalle(this.empresa.riesgoPuesto.id);
            this.formEmpresa.get('riesgoPuesto').setValue(this.empresa.riesgoPuesto.id);
        }

        if (this.empresa.lugarExpedicion) {
            this.autocompleteCodigoP.getLugarExpedicion(this.empresa.lugarExpedicion);
            this.formEmpresa.get('lugarExpedicion').setValue(this.empresa.lugarExpedicion);
        }
    }

    activeRiesgo(text: any) {
        var texto = text.target.value;
        if (texto.replace(/(^\s+|\s+$)/g, "").length == 0) {
            this.formEmpresa.get('registroPatronal').setValue(null);
            this.formEmpresa.get('riesgoPuesto').setValue(null);
            this.onRiesgo = false;
        } else {
            this.onRiesgo = true;
        }
    }

    onCodigoPostalSelected(lugarExpedicion: any) {
        if (lugarExpedicion != null) {
            this.cpEmp = true;
            this.formEmpresa.get('colonia').setValue(null);
        } else {
            this.cpEmp = false;
            this.formEmpresa.get('colonia').setValue(null);
        }
        this.colonias = [];
        if (lugarExpedicion !== undefined && lugarExpedicion != null && lugarExpedicion > 0) {
            this.formEmpresa.get('lugarExpedicion').setValue(lugarExpedicion);
            this.cpService.consultarLocalizacion(lugarExpedicion).then((data) => {
                this.formEmpresa.get('municipio').setValue(data.data.municipio);
                this.formEmpresa.get('estado').setValue(data.data.estado);
                for (let colonia of data.data.colonia) {
                    this.colonias.push(colonia);
                }
            }).catch((error) => {
                console.log("Error");
            });
        } else {
            this.formEmpresa.get('lugarExpedicion').setValue(0);
        }
    }
}

