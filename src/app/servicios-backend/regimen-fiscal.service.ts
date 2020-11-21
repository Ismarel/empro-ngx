import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { RegimenFiscal } from '../entidades/regimen-fiscal';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RegimenFiscalService {

    private headers = HttpHelper.headersJSON;
    private regimenFiscalUrl = HttpHelper.url + 'regimenFiscal';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('RegimenFiscalService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }



    getDetalle(id: number) {
        const url = `${this.regimenFiscalUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map(
                (response: Response) => {
                    return response.json();
                }
            );
        }
    }


    update(dataRegimenFiscal: RegimenFiscal): Promise<any> {
        const url = `${this.regimenFiscalUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataRegimenFiscal), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataRegimenFiscal: RegimenFiscal): Promise<any> {
        const url = `${this.regimenFiscalUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataRegimenFiscal), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.regimenFiscalUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getRegimenes(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.regimenFiscalUrl}/list`;
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
        const url = `${this.regimenFiscalUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocompleteTipoRegimen(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.regimenFiscalUrl}/autocompleteTipoRegimen`;
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

    autocompleteDocumentoByTipoRegimen(filterQuery: string, idTipoRegimen: number) {
        let params = new URLSearchParams();
        const url = `${this.regimenFiscalUrl}/autocompleteDocumentoByTipoRegimen`;
        if (filterQuery) { params.append('filterQuery', filterQuery); }

        if (idTipoRegimen) params.append('idTipoRegimen', idTipoRegimen + '');
        console.log('id' + idTipoRegimen);
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

    autocompleteTipoRegimenByEmpresa(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.regimenFiscalUrl}/autocompleteTipoRegimenByEmpresa`;
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

}
