import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Certificado } from '../entidades/certificado';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CertificadoService {

    private headers = HttpHelper.headersJSON;
    private certificadoUrl = HttpHelper.url + 'certificado';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('certificadoService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }



    getDetalle(id: number): Promise<Certificado> {
        const url = `${this.certificadoUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Certificado>)
                .catch(this.handleError);
        }
    }

    upload(formdata: FormData): Promise<any> {
        let url = `${HttpHelper.urlFILEREST}/upload`;
        return this.http
            .post(url, formdata)
            .toPromise()
            .then(data => data).catch(this.handleError);
    }

    update(dataCertificado: Certificado): Promise<any> {
        const url = `${this.certificadoUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataCertificado), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataCertificado: Certificado): Promise<any> {
        const url = `${this.certificadoUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataCertificado), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.certificadoUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCertidicados(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.certificadoUrl}/list`;
        let params = new URLSearchParams();
        if (filterQuery) params.append('filterQuery', filterQuery);

        if (sortBy) params.append('sortBy', sortBy);

        if (sortOrder) {
            params.append('sortOrder', sortOrder);
        }
        if (rowsOnPage) {
            params.append('rowsOnPage', rowsOnPage + '');
        }
        if (page) {
            params.append('page', page + '');
        }
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            let options = new RequestOptions({ headers: this.headers, search: params.toString() }); // Create a request option
            return this.http.get(url, options).map(
                (response: Response) => {
                    return response.json();
                }
            );


        }
    }

    autocomplete(filterQuery: String): Promise<any> {
        const url = `${this.certificadoUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

}
