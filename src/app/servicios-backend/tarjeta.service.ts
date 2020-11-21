import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Tarjeta } from '../entidades/tarjeta';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TarjetaService {

    private headers = HttpHelper.headersJSON;
    private tarjetaUrl = HttpHelper.url + 'tarjeta';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('TarjetaService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }



    getDetalle(id: number): Promise<Tarjeta> {
        const url = `${this.tarjetaUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Tarjeta>)
                .catch(this.handleError);
        }
    }


    update(dataTarjeta: Tarjeta): Promise<any> {
        const url = `${this.tarjetaUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataTarjeta), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    updateStatus(id: number, estatus: number): Promise<any> {
        const url = `${this.tarjetaUrl}/updateStatus/${id}`;
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


    create(dataTarjeta: Tarjeta): Promise<any> {
        const url = `${this.tarjetaUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataTarjeta), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.tarjetaUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getTarjetas(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.tarjetaUrl}/list`;
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
        const url = `${this.tarjetaUrl}/autocomplete/${filterQuery}`;
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
            const url = `${this.tarjetaUrl}/tarjetaCSV/${token}`;
            window.location.href = url;
        }

    }
}
