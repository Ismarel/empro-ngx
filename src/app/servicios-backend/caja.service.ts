import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Caja } from '../entidades/caja';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable()
export class CajaService {

    private headers = HttpHelper.headersJSON;
    private cajaUrl = HttpHelper.url + 'caja';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('CajaService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number): Observable<any> {
        const url = `${this.cajaUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .map(response => response.json());
        }
    }


    update(dataCaja: Caja): Promise<any> {
        const url = `${this.cajaUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataCaja), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    updateStatus(id: number, estatus: number): Promise<any> {
        const url = `${this.cajaUrl}/updateStatus/${id}`;
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


    create(dataCaja: Caja): Promise<any> {
        const url = `${this.cajaUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataCaja), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.cajaUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCajas(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.cajaUrl}/list`;
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
        const url = `${this.cajaUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCSVInfo() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.cajaUrl}/cajaCSV/${token}`;
            window.location.href = url;
        }

    }

}
