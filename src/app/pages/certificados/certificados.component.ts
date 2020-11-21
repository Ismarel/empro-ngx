import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ConceptoService } from '../../servicios-backend/concepto.service';
import { CertificadoService } from '../../servicios-backend/certificado.service';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { Unidad } from '../../entidades/unidad';
import { Producto } from '../../entidades/producto';
import { Certificado } from 'app/entidades/certificado';
import { Empresa } from 'app/entidades/empresa';

@Component({
    selector: 'app-certificados',
    templateUrl: './certificados.component.html',
    styleUrls: ['./certificados.component.scss']
})
export class CertificadosComponent implements OnInit {
    form: any;
    FormControl: any;
    formcontrol: string;
    formCertificado: FormGroup;

    data: Certificado[];
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalCertificados: number = 0;

    loadingFirstTime: boolean = false;

    entidad_elimar: Certificado;
    valor: number;
    colonias = [];

    isEdit: boolean = false;
    /**
     * Variables para filtrar por query
     */
    query: string = '';
    delayBeforeSearch: number = 400; // Delay in miliseconds
    formularioFilterQuery: FormGroup;
    querySubscription$: Subscription;

    idEdit: number;
    certifi: File;
    keycertifi: File;
    currentDate: number;
    public pass: boolean;

    constructor(private certificadoService: CertificadoService, private _fb: FormBuilder, private router: Router) {
        this.certificadoService = certificadoService;
    }

    ngOnInit() {
        //this.getCertificado();
        this.currentDate = new Date().getTime();
        this.initFormularioCertificado();
        this.initFormQuery();
        this.buscar();
    }

    initFormularioCertificado() {
        this.formCertificado = new FormGroup({
            archivoCer: new FormControl(),
            //numeroCertificado: new FormControl(),
            //validoDesde: new FormControl(),
            //validoHasta: new FormControl(),
            archivoLlave: new FormControl(),
            password: new FormControl(),
        });
    }


    initFormQuery() {
        this.formularioFilterQuery = this._fb.group({
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

    buscar() {
        this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe(
            (dataxyz) => {
                this.totalCertificados = dataxyz.total;
                this.data = dataxyz.data;

            }, (errorxyz) => {
                //console.log('error', errorxyz);
            }
        );
    }

    onFileUpload(event: EventTarget, type: String) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        console.log(type);
        if (type == "certificado") {
            this.certifi = files[0];
        }
        if (type == "llave") {
            this.keycertifi = files[0];
        }
        console.log(files[0]);
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

    onSubmitAgregar() {
        var formcer = new FormData();
        formcer.append("token", localStorage.getItem("token"));
        formcer.append("tipo", "3");
        formcer.append("subtipo", "0");
        formcer.append("file", this.certifi, this.certifi.name);

        var formkey = new FormData();
        formkey.append("token", localStorage.getItem("token"));
        formkey.append("tipo", "3");
        formkey.append("subtipo", "0");
        formkey.append("file", this.keycertifi, this.keycertifi.name);

        let datosCertificados = new Certificado();
        datosCertificados.empresa = new Empresa();
        /*/this.datosCertificados.empresa.id = new Empresa();
        //-----Transform date a timestamp-----
        var dateD = this.formCertificado.get('validoDesde').value;
        var dateH = this.formCertificado.get('validoHasta').value;
        var fechaDesde = (new Date(dateD).getTime()) + 86400000;
        var fechaHasta = (new Date(dateH).getTime()) + 86400000;*/
        //-----Get name file-----
        const FILE_NAME_REGEX = (/^.*[\\\/]/);
        let fileCer = this.formCertificado.get('archivoCer').value;
        let fileKey = this.formCertificado.get('archivoLlave').value;
        var fileNameCer = fileCer.replace(FILE_NAME_REGEX, '');
        var fileNameKey = fileKey.replace(FILE_NAME_REGEX, '');
        //-----Send data create-----
        datosCertificados.archivoCertificado = fileNameCer;//this.formCertificado.get('archivoCer').value;
        //datosCertificados.numeroCertificado = this.formCertificado.get('numeroCertificado').value;
        //datosCertificados.validoDesde = fechaDesde;//this.formCertificado.get('validoDesde').value;
        //datosCertificados.validoHasta = fechaHasta;//this.formCertificado.get('validoHasta').value;
        datosCertificados.archivoLlave = fileNameKey;//this.formCertificado.get('archivoLlave').value;
        let password = this.formCertificado.get('password').value;
        let truePassword = password.replace(/(^\s+|\s+$)/g, "");
        datosCertificados.password = truePassword;//this.formCertificado.get('password').value;
        if (truePassword) {
            this.pass = true;
            this.certificadoService.create(datosCertificados).then((x) => {
                console.log(x.id);
                formcer.append("file_id", x.id);
                this.certificadoService.upload(formcer).then((data) => {
                    if (data.type == 1 && data.bytesLoaded && data.totalBytes) {
                        console.log(data.bytesLoaded);
                    } else if (data.ok) {
                        console.log("Data Uploaded");
                        this.certificadoService.upload(formkey).then((data) => {
                            if (data.type == 1 && data.bytesLoaded && data.totalBytes) {
                                console.log(data.bytesLoaded);
                            } else if (data.ok) {
                                console.log("Data Uploaded");
                                this.buscar();
                                $('#Certificado').modal('hide');
                            }
                        }).catch((y) => {
                            console.log("Error ocurrido: ", y)
                        });
                    }
                }).catch((y) => {
                    console.log("Error ocurrido: ", y)
                });

            }).catch((y) => {
                console.log("Error ocurrido: ", y)
            });
        } else {
            this.pass = false;
        }

        /*this.certificadoService.create(datosCertificados).then((x) => {
          this.buscar();
          $('#Certificado').modal('hide');
    
        }).catch((y) => {
            console.log("Error ocurrido: ", y)
        });*/
    }

    onClick_edit(entity_edit: any) {
        this.idEdit = entity_edit.id;
        //this.formCertificado.get('archivoCer').setValue(entity_edit.archivoCer);
        //this.formCertificado.get('numeroCertificado').setValue(entity_edit.numeroCertificado);
        //this.formCertificado.get('validoDesde').setValue(entity_edit.validoDesde);
        //this.formCertificado.get('validoHasta').setValue(entity_edit.validoHasta);
        //this.formCertificado.get('archivoLlave').setValue(entity_edit.archivoLlave);
        this.formCertificado.get('password').setValue(entity_edit.password);


        this.valor = entity_edit.id;

        //dataCertificados.empresa.id = 1;

    }

    prepareEdit(item: any) {
        this.formCertificado.reset();
        this.isEdit = true;
        this.onClick_edit(item);

    }

    fillDataFormulario(certificado: Certificado) {
        //console.log("Tengo dato", this.formCertificado.get('numeroCertificado'));
        this.formCertificado.get('archivoCer').setValue(certificado.archivoCertificado);
        //this.formCertificado.get('numeroCertificado').setValue(certificado.numeroCertificado);
        //this.formCertificado.get('validoDesde').setValue(certificado.validoDesde);
        //this.formCertificado.get('validoHasta').setValue(certificado.validoHasta);
        this.formCertificado.get('archivoLlave').setValue(certificado.archivoLlave);
        this.formCertificado.get('password').setValue(certificado.password);

    }

    checkPassword(event) {
        const password = event.target.value;
        let truePassword = password.replace(/(^\s+|\s+$)/g, "");
        let text = String(password);
        if (text.length > 0) {
            if (truePassword) {
                this.pass = true;
            } else {
                this.pass = false
            }
        } else if (text.length == 0) {
            this.pass = true
        }
    }

    prepareAdd() {
        this.formCertificado.reset();
        //$('#Certificado').modal('show');

        this.isEdit = false;
    }

    onSubmitEditar() {
        var formcer = new FormData();
        formcer.append("token", localStorage.getItem("token"));
        formcer.append("tipo", "3");
        formcer.append("subtipo", "0");
        formcer.append("file", this.certifi, this.certifi.name);

        var formkey = new FormData();
        formkey.append("token", localStorage.getItem("token"));
        formkey.append("tipo", "3");
        formkey.append("subtipo", "0");
        formkey.append("file", this.keycertifi, this.keycertifi.name);

        //-----Transform date a timestamp-----
        //var dateDes  = this.formCertificado.get('validoDesde').value;
        //var dateHas = this.formCertificado.get('validoHasta').value;
        //var fechaDesde = (new Date(dateDes).getTime()) + 86400000;
        //var fechaHasta = (new Date(dateHas).getTime()) + 86400000;
        //-----Get name file-----
        const FILE_NAME_REGEX = (/^.*[\\\/]/);
        let fileCer = this.formCertificado.get('archivoCer').value;
        let fileKey = this.formCertificado.get('archivoLlave').value;
        var fileNameCer = fileCer.replace(FILE_NAME_REGEX, '');
        var fileNameKey = fileKey.replace(FILE_NAME_REGEX, '');

        let dataCertificados: Certificado = new Certificado();
        dataCertificados.empresa = new Empresa();
        //dataCertificados.id = this.valor;

        dataCertificados.archivoLlave = fileNameKey;//this.formCertificado.get('archivoLlave').value;
        //dataCertificados.archivoCertificado = fileNameCer;
        //dataCertificados.numeroCertificado = this.formCertificado.get('numeroCertificado').value;
        //dataCertificados.validoDesde = fechaDesde;//this.formCertificado.get('validoDesde').value;
        //dataCertificados.validoHasta = fechaHasta;//this.formCertificado.get('validoHasta').value;
        let password = this.formCertificado.get('password').value;
        let truePassword = password.replace(/(^\s+|\s+$)/g, "");
        dataCertificados.password = truePassword;//this.formCertificado.get('password').value;
        dataCertificados.id = this.idEdit;
        if (truePassword) {
            this.pass = true;
            this.certificadoService.update(dataCertificados).then((x) => {

                formcer.append("file_id", this.idEdit.toString());

                this.certificadoService.upload(formcer).then((data) => {
                    if (data.type == 1 && data.bytesLoaded && data.totalBytes) {
                        console.log(data.bytesLoaded);
                    } else if (data.ok) {
                        console.log("Data Uploaded");
                        this.certificadoService.upload(formkey).then((data) => {
                            if (data.type == 1 && data.bytesLoaded && data.totalBytes) {
                                console.log(data.bytesLoaded);
                            } else if (data.ok) {
                                console.log("Data Uploaded");
                                this.buscar();
                                $('#Certificado').modal('hide');
                            }
                        }).catch((y) => {
                            console.log("Error ocurrido: ", y)
                        });
                    }
                }).catch((y) => {
                    console.log("Error ocurrido: ", y)
                });
            }).catch((error) => {
                console.log(error);
                this.buscar();
                $('#Certificado').modal('hide');
            });
        } else {
            this.pass = false;
        }

    }


    onClick_elim(entity: any) {
        //this.myGroup.reset();
        this.formCertificado.reset();

        this.entidad_elimar = entity;
    }

    removeCertificado(id: number) {
        this.certificadoService.remove(id).then((data) => {
            this.buscar();
        }).catch((error) => {
            console.log(error);

        });
        $('#eliminarCertificado').modal('hide');
    }

    //////////////////////////////////////



    onSubmitCertificados() {
        if (this.isEdit) {
            this.onSubmitEditar();
        } else {
            this.onSubmitAgregar()
        }
    }
}