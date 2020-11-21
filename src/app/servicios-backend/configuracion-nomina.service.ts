import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { ConfiguracionNomina } from '../entidades/configuracion-nomina';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfiguracionNominaService {

    private headers = HttpHelper.headersJSON;
    private configuracionNominaUrl = HttpHelper.url + 'configuracionNomina';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('ConfiguracionNominaService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }

    getPeriodo(periodicidad: any) {
        const url = `${this.configuracionNominaUrl}/getPeriodo/${periodicidad}`;
        let token = localStorage.getItem("token");
        // let params= new URLSearchParams();
        // params.append("periodicidad", periodicidad);
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<ConfiguracionNomina>)
                .catch(this.handleError);
        }
    }

    getDetalle(id: number): Promise<any> {
        const url = `${this.configuracionNominaUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    existeConfiguracion(idPeriodicidad: number, idEmpresa: number): Promise<any> {
        const url = `${this.configuracionNominaUrl}/existeConfiguracion/${idEmpresa}/${idPeriodicidad}`;
        let token = localStorage.getItem("token");
        // let params=new URLSearchParams();
        // params.append('idEmpresa',idEmpresa+'');
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    update(dataConfiguracionNomina: ConfiguracionNomina): Promise<any> {
        const url = `${this.configuracionNominaUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataConfiguracionNomina), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataConfiguracionNomina: ConfiguracionNomina): Promise<any> {
        const url = `${this.configuracionNominaUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataConfiguracionNomina), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.configuracionNominaUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocompletePeriodicidad(filterQuery: string) {
        let params = new URLSearchParams();
        let token = localStorage.getItem('token');
        const url = `${this.configuracionNominaUrl}/autocompletePeriodicidad`
        params.append('filterQuery', filterQuery);
        if (token) {
            this.headers.set('token', token);
            // parametros para la peticion HTTP
            let queryParams = new RequestOptions(
                { headers: this.headers, search: params.toString() }
            );
            return this.http.get(url, queryParams)
                .map((response) => {
                    response.json();
                });
        }
    }

    autocompletePeriodicidadTrabajador(filterQuery: string) {
        let params = new URLSearchParams();
        let token = localStorage.getItem('token');
        const url = `${this.configuracionNominaUrl}/autocompletePeriodicidadTrabajador`
        params.append('filterQuery', filterQuery);
        if (token) {
            this.headers.set('token', token);
            // parametros para la peticion HTTP
            let queryParams = new RequestOptions(
                { headers: this.headers, search: params.toString() }
            );
            return this.http.get(url, queryParams)
                .map((response) => {
                    response.json();
                });
        }
    }

}
