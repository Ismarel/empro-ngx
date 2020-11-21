import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { ComprobanteFiscal } from '../entidades/comprobante-fiscal';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ComprobanteFiscalService {

    private headers = HttpHelper.headersJSON;
    private comprobanteFiscalUrl = HttpHelper.url + 'comprobanteFiscal';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('ComprobanteFiscalService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number): Promise<ComprobanteFiscal> {
        const url = `${this.comprobanteFiscalUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<ComprobanteFiscal>)
                .catch(this.handleError);
        }
    }

    update(dataComprobanteFiscal: ComprobanteFiscal): Promise<any> {
        const url = `${this.comprobanteFiscalUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataComprobanteFiscal), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataComprobanteFiscal: ComprobanteFiscal): Promise<any> {
        const url = `${this.comprobanteFiscalUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataComprobanteFiscal), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    timbrado(id: number) {
        const url = `${this.comprobanteFiscalUrl}/timbrar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    cancelar(id: number) {
        const url = `${this.comprobanteFiscalUrl}/cancelar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.comprobanteFiscalUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getComprobanteFiscales(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.comprobanteFiscalUrl}/list`;
        let params = new URLSearchParams();
        if (filterQuery) { params.append('filterQuery', filterQuery); }

        if (sortBy) { params.append('sortBy', sortBy); }

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

    autocomplete(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.comprobanteFiscalUrl}/autocomplete`;
        if (filterQuery) { params.append('filterQuery', filterQuery); }
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

    autocompleteUsoCfdi(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.comprobanteFiscalUrl}/autocompleteUsoCfdi`;
        if (filterQuery) { params.append('filterQuery', filterQuery); }
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

    crearXml(id: number) {
        const url = `${this.comprobanteFiscalUrl}/generaXML/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    downloadXML(id: number) {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${HttpHelper.url}files/download/4/${id}.xml/${token}`;
            window.location.href = url;
        }
    }

    crearPDF(id: number) {
        const url = `${this.comprobanteFiscalUrl}/crearPDF/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    downloadPDF(id: number) {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${HttpHelper.url}files/download/4/${id}.pdf/${token}`;
            window.location.href = url;
        }
    }

    getCSVInfo() {
        let token = localStorage.getItem("token");
        console.log("csv");
        if (token) {
            const url = `${this.comprobanteFiscalUrl}/exportReport/${token}`;
            window.location.href = url;
        }
    }
}
