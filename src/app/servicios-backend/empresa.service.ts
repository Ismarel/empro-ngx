import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Empresa } from '../entidades/empresa';
import { RiesgoPuesto } from '../entidades/riesgo-puesto';
import { Banco } from '../entidades/banco';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class EmpresaService {

    private headers = HttpHelper.headersJSON;
    private empresaUrl = HttpHelper.url + 'empresa';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('empresaService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }



    getDetalle(): Promise<Empresa> {
        const url = `${this.empresaUrl}/detalle`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Empresa>)
                .catch(this.handleError);
        }
    }


    update(dataEmpresa: Empresa): Promise<any> {
        const url = `${this.empresaUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataEmpresa), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataEmpresa: Empresa): Promise<any> {
        const url = `${this.empresaUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataEmpresa), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(): Promise<any> {
        const url = `${this.empresaUrl}/eliminar`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocomplete(filterQuery: String): Promise<any> {
        const url = `${this.empresaUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocompleteRiesgo(filterQuery: String): Promise<any> {
        const url = `${this.empresaUrl}/autocompleteRiesgo/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getDetalleRiesgo(id: number) { // Se estandariza los detalles como observables, para autocomplete generico
        const url = `${this.empresaUrl}/detalleRiesgo/${id}`;
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


    getDetalleBanco(id: number): Promise<Banco> {
        const url = `${this.empresaUrl}/detalleBanco/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Banco>)
                .catch(this.handleError);
        }
    }
}
