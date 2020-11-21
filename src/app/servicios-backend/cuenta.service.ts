import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Cuenta } from '../entidades/cuenta';
import { Banco } from '../entidades/banco';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CuentaService {

    private headers = HttpHelper.headersJSON;
    private cuentaUrl = HttpHelper.url + 'cuenta';
    private empresaUrl = HttpHelper.url + 'empresa';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('CuentaService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number) {
        const url = `${this.cuentaUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }

    update(dataCuenta: Cuenta): Promise<any> {
        const url = `${this.cuentaUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataCuenta), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    updateStatus(id: number, estatus: number): Promise<any> {
        const url = `${this.cuentaUrl}/updateStatus/${id}`;
        let token = localStorage.getItem("token");
        let params = new URLSearchParams();
        // this.headers.set("token", token);
        params.append('estatus', estatus + '');
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers, search: params.toString() })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }


    create(dataCuenta: Cuenta): Promise<any> {
        const url = `${this.cuentaUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataCuenta), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.cuentaUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCuentas(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.cuentaUrl}/list`;
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

    autocomplete(filterQuery: String): Promise<any> {
        const url = `${this.cuentaUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }


    autocompleteBancos(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.cuentaUrl}/autocompleteBancos`;
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

    getCSVInfo() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.cuentaUrl}/cuentaCSV/${token}`;
            window.location.href = url;
        }

    }

    getDetalleBanco(id: number) {
        const url = `${this.empresaUrl}/detalleBanco/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }
}
