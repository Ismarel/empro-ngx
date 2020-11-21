import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Sucursal } from '../entidades/sucursal';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SucursalService {

    private headers = HttpHelper.headersJSON;
    private sucursalUrl = HttpHelper.url + 'sucursal';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('SucursalService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }



    getDetalle(id: number) {
        const url = `${this.sucursalUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }


    update(dataSucursal: Sucursal): Promise<any> {
        const url = `${this.sucursalUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataSucursal), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataSucursal: Sucursal): Promise<any> {
        const url = `${this.sucursalUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataSucursal), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.sucursalUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getSucursales(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.sucursalUrl}/list`;
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
        const url = `${this.sucursalUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocompleteSucursales(filterQuery: String): Promise<any> {
        const url = `${this.sucursalUrl}/autocompleteSucursales/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCSVInfoSucursal() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.sucursalUrl}/sucursalCSV/${token}`;
            window.location.href = url;
        }
    }

}
