import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Nomina } from '../entidades/nomina';
import { TrabajadorIncidencia } from '../entidades/trabajador-incidencia';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';
import { PeriodicidadPago } from '../entidades/periodicidad-pago';

@Injectable()
export class NominaService {

    private headers = HttpHelper.headersJSON;
    private nominaUrl = HttpHelper.url + 'nomina';
    private fileURL = HttpHelper.urlFILEREST + "/download/5"

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('NominaService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number): Promise<Nomina> {
        const url = `${this.nominaUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Nomina>)
                .catch(this.handleError);
        }
    }


    update(dataNomina: Nomina): Promise<any> {
        const url = `${this.nominaUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataNomina), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    create(dataNomina: Nomina): Promise<any> {
        const url = `${this.nominaUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataNomina), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.nominaUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    cancelar(id: number): Promise<any> {
        const url = `${this.nominaUrl}/cancelarNomina/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getLastCfdis() {
        const url = `${this.nominaUrl}/listConsultarCfdis`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCfdis(periodicidad: number, filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number, anio: Number, mesInicio: Number, mesFin: Number, idTrabajador: Number) {
        const url = `${this.nominaUrl}/listConsultarCfdis`;
        let params = new URLSearchParams();
        // console.log(periodicidad);

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
        if (periodicidad != undefined) {
            params.append('periodicidad', periodicidad + '');
        }

        if (anio !== undefined) {
            params.append('anio', anio + '');
        }
        if (mesInicio !== undefined) {
            params.append('mesInicio', mesInicio + '');
        }

        if (mesFin !== undefined) {
            params.append('mesFin', mesFin + '');
        }

        if (idTrabajador !== undefined) {
            params.append('idTrabajador', idTrabajador + '');
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

    //BOTON DE CONSULTAR NOMINAS
    getNominas(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number, estatus: number, periodicidad: PeriodicidadPago, anio: Number, mesInicio: Number, mesFin: Number, idTrabajador: Number) {
        const url = `${this.nominaUrl}/list`;
        let params = new URLSearchParams();
        // console.log(periodicidad);

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
        if (estatus) {
            params.append('estatus', estatus + '');
        }
        if (periodicidad != undefined) {
            params.append('periodicidad', periodicidad.id + '');
        }

        if (anio !== undefined) {
            params.append('anio', anio + '');
        }
        if (mesInicio !== undefined) {
            params.append('mesInicio', mesInicio + '');
        }

        if (mesFin !== undefined) {
            params.append('mesFin', mesFin + '');
        }

        if (idTrabajador !== undefined) {
            params.append('idTrabajador', idTrabajador + '');
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

    listTrabajadorIncidencia(id: number): Promise<any> {
        const url = `${this.nominaUrl}/listTrabajadorIncidencia`;
        let params = new URLSearchParams();

        if (id !== undefined) {
            params.append('idTrabajador', id + '');
            let token = localStorage.getItem("token");
            if (token) {
                this.headers.set('token', token);
                let options = new RequestOptions({ headers: this.headers, search: params.toString() });
                return this.http.get(url, options)
                    .toPromise()
                    .then(response => response.json() as Promise<any>)
                    .catch(this.handleError);
            }
        }

    }

    getDetalleTrabajadorIncidencia(id: number): Promise<TrabajadorIncidencia> {
        const url = `${this.nominaUrl}/detalleTrabajadorIncidencia/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<TrabajadorIncidencia>)
                .catch(this.handleError);
        }
    }


    updateTrabajadorIncidencia(dataTIncidencia: TrabajadorIncidencia): Promise<any> {
        const url = `${this.nominaUrl}/updateTrabajadorIncidencia`;
        // console.log('npercepcion: '+dataTIncidencia.nNominasPercepcion);
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataTIncidencia), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    createTrabajadorIncidencia(dataTIncidencia: TrabajadorIncidencia): Promise<any> {
        const url = `${this.nominaUrl}/crearTrabajadorIncidencia`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataTIncidencia), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    removeTrabajadorIncidencia(id: number): Promise<any> {
        const url = `${this.nominaUrl}/eliminarTrabajadorIncidencia/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    autocompleteTipoIncidencia(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.nominaUrl}/autocompleteTipoIncidencia`;
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

    crearPdf(id: number): Promise<any> {
        const url = `${this.nominaUrl}/crearPDF/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    generaXml(idNomina: number): Promise<any> {
        const url = `${this.nominaUrl}/generaXML/${idNomina}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    descargarPDF(idNomina: any) {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.fileURL}/${idNomina}.pdf/${token}`;
            window.location.href = url;
        }
    }

    descargarXML(idNomina: any) {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.fileURL}/${idNomina}.xml/${token}`;
            window.location.href = url;
        }
    }

    getNominaCSV(periodicidad: number) {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.nominaUrl}/nominaCSV/${token}/${periodicidad}`;
            window.location.href = url;
        }
    }

    generateNominaByTrabajadores(periodicidad: any): Promise<any> {
        const url = `${this.nominaUrl}/crearNominasByTrabajadores`
        let token = localStorage.getItem("token");
        let params = new URLSearchParams();
        params.append("periodicidad", periodicidad);
        if (token) {
            this.headers.set("token", token);
            return this.http.post(url, {}, { headers: this.headers, search: params.toString() })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    listNominas(periodicidad: number, filterQuery: string, sortBy: string, sortOrder: string, rowsOnPage: number, page: number): Promise<any> {
        let urlNomina: string;
        const url = `${this.nominaUrl}/listNominasPeriodicidadSinTimbrar/`;
        let params = new URLSearchParams();
        if (periodicidad > 0) {
            const url = `${this.nominaUrl}/listNominasPeriodicidadSinTimbrar/${periodicidad}`;
            urlNomina = url;
        } else {
            const url = `${this.nominaUrl}/listNominasPeriodicidadSinTimbrar/`;
            urlNomina = url;
        }
        console.log("url---> periodicidad");
        console.log(periodicidad);
        console.log(urlNomina);

        if (periodicidad > 0) params.append('periodicidad', periodicidad + '');

        params.append('filterQuery', filterQuery);

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


        let token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);
            console.log(params);
            return this.http.get(url, { headers: this.headers, search: params.toString() })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    timbradoMasivo(idConfiguracion: string, fechaInicio: string, fechaFin: string) {
        const url = `${this.nominaUrl}/timbradoMasivo`;
        let token = localStorage.getItem("token");
        let params = new URLSearchParams();
        params.append("idConfiguracion", idConfiguracion);
        params.append("fechaInicio", fechaInicio);
        params.append("fechaFin", fechaFin);
        if (token) {
            this.headers.set("token", token);
            return this.http.post(url, "", { headers: this.headers, search: params.toString() })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    timbradoSeleccion(listaIds: string) {
        const url = `${this.nominaUrl}/timbradoSeleccion`;
        let token = localStorage.getItem("token");
        let params = new URLSearchParams();
        params.append("listIds", listaIds);
        if (token) {
            this.headers.set("token", token);
            return this.http.post(url, {}, { headers: this.headers, search: params.toString() })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    timbradoManual(id: number) {
        const url = `${this.nominaUrl}/timbrar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set("token", token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    eliminarNomina(id: number) {
        const url = `${this.nominaUrl}/eliminar/${id}`;
        let token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);

            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    selectIncidencia() {
        let params = new URLSearchParams();
        const url = `${this.nominaUrl}/autocompleteTipoIncidencia`;
        params.append('filterQuery', "");
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

    selectIncapacidad() {
        let params = new URLSearchParams();
        const url = `${this.nominaUrl}/autocompleteTipoIncapacidad`;
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

}
