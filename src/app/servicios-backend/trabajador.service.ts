import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Trabajador } from '../entidades/trabajador';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TrabajadorService {

    private headers = HttpHelper.headersJSON;
    private trabajadorUrl = HttpHelper.url + 'trabajador';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('TrabajadorService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number): Promise<Trabajador> {
        const url = `${this.trabajadorUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Trabajador>)
                .catch(this.handleError);
        }
    }

    update(dataTrabajador: Trabajador): Promise<any> {
        const url = `${this.trabajadorUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataTrabajador), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataTrabajador: Trabajador): Promise<any> {
        const url = `${this.trabajadorUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);

        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataTrabajador), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.trabajadorUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getTrabajadores(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.trabajadorUrl}/list`;
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
        const url = `${this.trabajadorUrl}/autocomplete`;
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

    autocompleteTipoContrato(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.trabajadorUrl}/autocompleteTipoContrato`;
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

    autocompleteTipoJornada(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.trabajadorUrl}/autocompleteTipoJornada`;
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

    obtenerJornadas() {
        let params = new URLSearchParams();
        const url = `${this.trabajadorUrl}/autocompleteTipoJornada`;
        params.append('filterQuery', "@@@");
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

    autocompletePeriodicidadPago(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.trabajadorUrl}/autocompletePeriodicidadPago`;
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

    getCSVInfoTrabajador() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.trabajadorUrl}/trabajadorCSV/${token}`;
            window.location.href = url;
        }
    }
}
