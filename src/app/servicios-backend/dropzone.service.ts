import { Injectable, EventEmitter } from '@angular/core';
import { HttpHelper } from 'app/http-helper';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
declare var Dropzone: any;
@Injectable()
export class DropzoneService {

    renombrar(nombre) {
        let fecha = new Date();
        let segundos = fecha.getSeconds();
        let minutos = fecha.getMinutes();
        let horas = fecha.getHours();
        let milisegundos = fecha.getMilliseconds();
        let dia = fecha.getDate();
        let mes = fecha.getMonth();
        let anio = fecha.getFullYear();
        let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let lon = 4;
        let nombreCompleto = milisegundos + this.rand_code(chars, lon) + segundos + this.rand_code(chars, lon) + minutos + this.rand_code(chars, lon) + horas + this.rand_code(chars, lon) + dia + this.rand_code(chars, lon) + mes + this.rand_code(chars, lon) + anio;
        return nombreCompleto;
    }
    rand_code(chars, lon) {
        let code = "";
        for (let x = 0; x < lon; x++) {
            let rand = Math.floor(Math.random() * chars.length);
            code += chars.substr(rand, 1);
        }
        return code;
    }

    dropzone(idDZ, tArchivo, arAcept, tipo, modulo, submodulo, eventosDropzone: Subject<{ id: String, evento: String, valor: String }>, cond, existXml?: boolean) {
        var self: any = this;
        $(document).ready(function() {
            let token = localStorage.getItem("token");
            //console.log(Dropzone,'<-test');
            Dropzone.autoDiscover = false;
            $(idDZ).empty();
            $(idDZ).dropzone({
                url: HttpHelper.urlFILEREST + tipo,
                headers: { 'token': localStorage.getItem('token') },
                // autoProcessQueue: false,
                maxFiles: 1,
                parallelUploads: 1,
                acceptedFiles: arAcept,
                addRemoveLinks: true,
                dictDefaultMessage: 'Arrasta o has clic para subir un archivo (1 a la vez)',
                dictRemoveFile: 'Remover archivo',
                renameFile: function(file) {
                    if (cond == true) {
                        // console.log(file);

                        let nombre = self.renombrar(file.name) + tArchivo;
                        eventosDropzone.next({ id: idDZ, evento: 'rename', valor: nombre + '' })
                        return nombre;
                    }
                    else {
                        return file.name;
                    }
                },
                success: function(file, response) {
                    // let extenxionFile: string[]= file.name.split(".");
                    // console.log(response);
                    // console.log(file.name +"--ext--"+extenxionFile[1]);

                    // eventosDropzone.next({ id: idDZ, evento: 'success', valor: "3/"+ modulo+ "/" + submodulo +"/"+file.name });
                    eventosDropzone.next({ id: idDZ, evento: 'success', valor: file.name });
                    if (cond == false) {
                        file.previewElement.classList.add("dz-success");
                        // console.log("Successfully uploaded: " + file.name);
                        this.subirIMG1 = true;
                    }
                    else {
                        file.previewElement.classList.add("dz-success");
                        // console.log("Successfully uploaded: " + file.name);
                        this.subirIMG1 = true;
                    }
                },
                error: function(file, response) {
                    file.previewElement.classList.add("dz-error");
                    eventosDropzone.next({ id: idDZ, evento: "error", valor: response });
                },
                sending: function(file, xhr, formData) {
                    // console.log(file);
                    let extenxionFile: string[] = file.type.split("/");
                    // console.log( extenxionFile[1] );
                    formData.set("token", localStorage.getItem("token"));
                    formData.set("tipo", 3); //idProyecto  3->EMPRO
                    formData.set("subtipo", modulo); // carpeta file configuration
                    formData.set("id", submodulo);//idEmpresa 
                    // formData.set("renamefile","test"+"."+extenxionFile[1]);
                    // formData.set("type-thumbnail", 0); //Si el type-thumbnail es 0 generará todos los tipos (mini, minix, med, medx, high) y el 1 solo mini_ y med_
                },
                removedfile: function(file){
                    var urlImage;
                    if (idDZ == "#dZUpload2") {
                        urlImage = `${HttpHelper.url}files/delete/1`;
                    }else if (idDZ == "#dZUpload3"){
                        urlImage = `${HttpHelper.url}files/delete/2`;
                    }
                    $.ajaxSetup({
                        headers:{ 'token': localStorage.getItem('token') }
                     });
                    $.get(urlImage).done(function(){
                        file.previewElement.remove();
                    });
                },
                //funcion para agregar preview de archivo en dropZone
                init: function() {
                    this.on('removedfile', function(file) {
                        console.log("Archivo eliminado");
                    });
                    this.addCustomFile = function(file, thumbnail_url, responce) {
                        this.emit("addedfile", file);
                        this.emit("thumbnail", file, thumbnail_url);
                        //this.emit("success", file, responce , false);
                        this.emit("complete", file);
                    }
                    if (idDZ == "#dZUpload2") {
                        let imageServer = localStorage.getItem("cedulaServerUrl");
                        if (imageServer != "NA") {
                            let urlImage = `${HttpHelper.url}files/download/1/${token}`;
                            this.addCustomFile(
                                {
                                    processing: true,
                                    accepted: true,
                                    name: "Cedula de Identificación Fiscal",
                                    size: 12345,
                                    type: 'image',
                                    status: Dropzone.SUCCESS
                                },
                                urlImage,
                                {
                                    status: "success"
                                }
                            );
                        }
                    } else if (idDZ == "#dZUpload3") {
                        let imageServer = localStorage.getItem("logoServerUrl");
                        if (imageServer != "NA") {
                            let urlImage = `${HttpHelper.url}files/download/2/${token}`;
                            this.addCustomFile(
                                {
                                    processing: true,
                                    accepted: true,
                                    name: "Logo Empresa",
                                    size: 12345,
                                    type: 'image',
                                    status: Dropzone.SUCCESS
                                },
                                urlImage,
                                {
                                    status: "success"
                                }
                            );
                        }
                    }
                },
            });
        });
    }
    getUrlServer(type: String) {
        let token = localStorage.getItem("token");
        if (type == "cedula") {
            return `${HttpHelper.url}files/download/1/${token}`;
        } else if (type == "logo") {
            return `${HttpHelper.url}files/download/2/${token}`;
        }
    }
}
