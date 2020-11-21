import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Cp } from '../entidades/cp';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CpService {

    private headers = HttpHelper.headersJSON;
    private cpUrl = HttpHelper.url + 'cp';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('cpService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }

    getDetalle(id: number) {
        const url = `${this.cpUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers }).map((response: Response) => {
                return response.json();
            });
        }
    }

    autocomplete(filterQuery: String): Promise<any> {
        const url = `${this.cpUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    public consultarLocalizacion(codigo: String): Promise<any> {
        const url = `${this.cpUrl}/consultarLocalizacion/${codigo}`;
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
