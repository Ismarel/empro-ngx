/* import { Injectable } from '@angular/core';
import { HttpHelper } from '../http-helper';
import { Headers, Http } from '@angular/http';
//import { FileUploader } from 'ng2-file-upload';

@Injectable()
export class FileService {

    private headers = HttpHelper.headersJSON;
    private fileUrl = HttpHelper.url;

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        //console.error('An error occurred', error.statu); // for demo purposes only
        return Promise.reject(error.message || error);
    }


    getUrlUpload(): string {
        return `${this.fileUrl}`;
    }

    /* prepareUploadSimple(tipo:number): FileUploader {
        this.fileUrl=HttpHelper.url;
        switch (tipo) {
            case 1: this.fileUrl+='ingresoEgreso/guardarXMLToIngresoEgreso';break; //leer xml y guardar egreso cuando seleccionan gasto general
            case 2: this.fileUrl+='ingresoEgreso/getConceptosXML';break;//leer xml y obtener conceptos cuando seleccionan compra para inventario
            case 3: this.fileUrl+='comprobanteFiscal/guardarXMLToCFDI';break;
            case 4: this.fileUrl+='comprobanteFiscal/getCFDIToXML';break;

            default:
                break;
        }
        let uploader: FileUploader = new FileUploader({
            url: `${this.fileUrl}`,
        });
        uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        };
        return uploader;
    } */


/**
 *
 * @param subtipo:  es la carpeta del modulo, ejemplo: subdominio=0
 * @param id
 * @param typeThumbnail : 0-> (mini, minix, med, medx, hight)  1->(mini y med)
 */
/* prepareUpload(token: String): FileUploader {
    let uploader: FileUploader = new FileUploader({
        url: `${this.fileUrl}`,
         uploader.onBeforeUploadItem = (item) => {
        item.withCredentials = false;
    };
    uploader.onBuildItemForm = (fileItem: any, form: any) => {
        return this.onBuildItemForm(fileItem, form, token);
    };
    return uploader;
} */

/**
 *
 * @param fileItem:
 * @param form
 * @param subtipo: la carpeta de modulo, ejemplo:     0 ->grupo
 * @param id:      el id del modulo
 * @param typeThumbnail
 * @param renamefile
uildItemForm(fileItem: any, form: any, token: String) {
    if (token && token !== null) {
       form.append('token', token);
        return { fileItem, form };
    } else {
        console.log('error-token');

    }
}



} */