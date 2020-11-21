import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Cheques } from '../entidades/cheques';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChequesService {

    private headers = HttpHelper.headersJSON;
    private chequesUrl = HttpHelper.url + 'cheques';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('ChequesService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number): Promise<Cheques> {
        const url = `${this.chequesUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Cheques>)
                .catch(this.handleError);
        }
    }


    update(dataCheques: Cheques): Promise<any> {
        const url = `${this.chequesUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataCheques), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataCheques: Cheques): Promise<any> {
        const url = `${this.chequesUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataCheques), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.chequesUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCheques(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.chequesUrl}/list`;
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
        const url = `${this.chequesUrl}/autocomplete/${filterQuery}`;
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
