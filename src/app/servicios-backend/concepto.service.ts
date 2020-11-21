import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Concepto } from '../entidades/concepto';
import { Producto } from '../entidades/producto';
import { Unidad } from '../entidades/unidad';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConceptoService {

    private headers = HttpHelper.headersJSON;
    private conceptoUrl = HttpHelper.url + 'conceptos';

    constructor(private http: Http) { }

    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('ConceptoService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }

    getDetalle(id: number) {
        const url = `${this.conceptoUrl}/detalle/${id}`;
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

    update(dataConcepto: Concepto): Promise<any> {
        const url = `${this.conceptoUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataConcepto), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    create(dataConcepto: Concepto): Promise<any> {
        const url = `${this.conceptoUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            console.log('url: ' + url);
            return this.http
                .post(url, JSON.stringify(dataConcepto), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.conceptoUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getList(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.conceptoUrl}/list`;
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

    getDummyData(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
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
        console.log(params);
    }

    autocomplete(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.conceptoUrl}/autocomplete`;
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

    autocompleteUnidad(filterQuery: String): Promise<any> {
        const url = `${this.conceptoUrl}/autocompleteUnidad/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocompleteProducto(filterQuery: String): Promise<any> {
        const url = `${this.conceptoUrl}/autocompleteProducto/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getDetalleProducto(id: number) {
        const url = `${this.conceptoUrl}/detalleProducto/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }

    getDetalleUnidad(id: number) {
        const url = `${this.conceptoUrl}/detalleUnidad/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }

    getCSVInfo() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.conceptoUrl}/conceptoCSV/${token}`;
            window.location.href = url;
        }

    }

    getDetalleConcepto(id: number) {
        const url = `${this.conceptoUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }
}
