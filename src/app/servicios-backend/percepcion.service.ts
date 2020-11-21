import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { NominaPercepcion } from '../entidades/nomina-percepcion';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PercepcionService {

    private headers = HttpHelper.headersJSON;
    private percepcionUrl = HttpHelper.url + 'nomina';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('PercepcionService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }

    getDetalle(id: number): Promise<NominaPercepcion> {
        const url = `${this.percepcionUrl}/detalleNominaPercepcion/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<NominaPercepcion>)
                .catch(this.handleError);
        }
    }

    update(dataPercepcion: NominaPercepcion): Promise<any> {
        const url = `${this.percepcionUrl}/updateNominaPercepcion`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataPercepcion), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    create(dataPercepcion: NominaPercepcion): Promise<any> {
        const url = `${this.percepcionUrl}/crearNominaPercepcion`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);

        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataPercepcion), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.percepcionUrl}/eliminarNominaPercepcion/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getPercepciones(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.percepcionUrl}/listNominaPercepcion`;
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
        const url = `${this.percepcionUrl}/autocompleteNominaDeduccion`;
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
