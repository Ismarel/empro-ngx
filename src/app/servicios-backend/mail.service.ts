import { Injectable } from "@angular/core";
import { HttpHelper } from "../http-helper";
import { Http } from "@angular/http";


@Injectable()
export class MailService {
    private headers = HttpHelper.headersJSON;
    private mailURL = HttpHelper.url + "mail";

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('IngresoEgresoService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }
    //servicio para enviar mail al concluir registro de ususario
    sendMailRegistro(mail: string): Promise<any> {
        const url = `${this.mailURL}/correoRegistro?to=${mail}`;//AGREGAR PARAMETROS AL TERMINAR EL SERVICIO
        // let token = localStorage.getItem("token");
        let params = new URLSearchParams();
        // params.append('to', mail+"");

        console.log(url);

        // if(token){
        // this.headers.set('token', token);

        return this.http
            .post(url, {}, { headers: this.headers })
            .toPromise()
            .then(response => response.json() as Promise<any>)
            .catch(this.handleError);
        // }
    }

    sendMailBienvenida(mail: string): Promise<any> {
        const url = `${this.mailURL}/correoBienvenida`;//AGREGAR PARAMETROS AL TERMINAR EL SERVICIO
        let token = localStorage.getItem("token");
        let params = new URLSearchParams();
        params.append("to", mail);

        if (token) {
            this.headers.set('token', token);

            return this.http
                .post(url, mail, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    sendMailIngreso(idIngreso: number, listMail: string): Promise<any> {
        const url = `${this.mailURL}/ingreso/${idIngreso}/${listMail}`;//AGREGAR PARAMETROS AL TERMINAR EL SERVICIO
        let token = localStorage.getItem("token");

        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    sendMailNomina(idNomina: number, listMail: string): Promise<any> {
        const url = `${this.mailURL}/nomina/${idNomina}/${listMail}`;//AGREGAR PARAMETROS AL TERMINAR EL SERVICIO
        let token = localStorage.getItem("token");

        if (token) {
            this.headers.set('token', token);

            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    sendMailFilesComprobante(mail: string, id: string): Promise<any> {
        const url = `${this.mailURL}/enviarComprobante/${id}?correos=${mail}`//AGREGAR PARAMETROS AL TERMINAR EL SERVICIO
        let token = localStorage.getItem("token");
        let params = new URLSearchParams();

        if (token) {
            this.headers.set('token', token);
            console.log(url);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

}