import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { IngresoEgreso } from '../entidades/ingreso-egreso';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';
import { CobroPago } from '../entidades/cobro-pago';

@Injectable()
export class IngresoEgresoService {

    private headers = HttpHelper.headersJSON;
    private ingresoEgresoUrl = HttpHelper.url + 'ingresoEgreso';
    private downloadFileURL = HttpHelper.urlFILEREST + "/download/6"

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('IngresoEgresoService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }


    getDetalle(id: number) {
        const url = `${this.ingresoEgresoUrl}/detalle/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .map(response => response.json());
        }
    }

    getDetalleComprobante(id: number) {
        const url = `${this.ingresoEgresoUrl}/detalleComprobante/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .map(response => response.json());
        }
    }

    update(dataIngresoEgreso: any): Promise<any> {
        const url = `${this.ingresoEgresoUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);

        return this.http
            .post(url, JSON.stringify(dataIngresoEgreso), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    updateMonto(dataIngresoEgreso: any): Promise<any> {
        const url = `${this.ingresoEgresoUrl}/updateMonto/${dataIngresoEgreso.id}`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        let params = new URLSearchParams();
        params.append('monto', dataIngresoEgreso.monto);
        params.append('fecha', dataIngresoEgreso.fecha);
        //console.log(JSON.stringify(dataIngresoEgreso));
        return this.http
            .get(url, { headers: this.headers, search: params.toString() })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataIngresoEgreso: IngresoEgreso): Promise<any> {
        const url = `${this.ingresoEgresoUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        console.log(dataIngresoEgreso);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(dataIngresoEgreso), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    remove(id: number): Promise<any> {
        const url = `${this.ingresoEgresoUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getIngresoEgresos(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number, tipo: boolean, pendienteCobrar?: boolean) {
        const url = `${this.ingresoEgresoUrl}/list`;
        let params = new URLSearchParams();
        params.append('filterQuery', filterQuery);

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

        if (tipo) {
            params.append('tipo', tipo + '');
        }
        if (pendienteCobrar) {
            params.append('pendienteCobrar', pendienteCobrar + '');
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

    autocomplete(filterQuery: string, tipo: boolean) {
        let params = new URLSearchParams();
        const url = `${this.ingresoEgresoUrl}/autocomplete`;
        if (filterQuery) { params.append('filterQuery', filterQuery); }
        if (tipo) {
            params.append('tipo', tipo + '');
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


    autocompleteTComprobanteEgresoConCfdi(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.ingresoEgresoUrl}/autocompleteTComprobanteEgresoConCfdi`;
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

    autocompleteTComprobanteEgresoSinComprobante(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.ingresoEgresoUrl}/autocompleteTComprobanteEgresoSinComprobante`;
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

    autocompleteTComprobanteOtroEgreso(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.ingresoEgresoUrl}/autocompleteTComprobanteOtroEgreso`;
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

    autocompleteTComprobanteIngreso(filterQuery: string) {
        let params = new URLSearchParams();
        const url = `${this.ingresoEgresoUrl}/autocompleteTComprobanteIngreso`;
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

    crearPagoCobro(CobroPago: CobroPago) {
        const url = `${this.ingresoEgresoUrl}/crearCobroPago`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        if (token) {
            this.headers.set('token', token);
            return this.http
                .post(url, JSON.stringify(CobroPago), { headers: this.headers })
                .toPromise()
                .then(res => res.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getCSVIngreso() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.ingresoEgresoUrl}/csvIngreso/${token}`;
            window.location.href = url;
        }
    }

    descargaCSV() {
        let token = localStorage.getItem('token');
        const url = `${this.ingresoEgresoUrl}/csvCobroPago/${token}`
        if (token) {
            window.location.href = url;
        }
    }

    descargarXML(rfcEmpresa: number, fileName: string) {
        let token = localStorage.getItem('token');
        const url = `${this.downloadFileURL}/${fileName}/${token}`;
        console.log("--------------" + url);
        location.href = url;
        // var win = window.open("www.google.com",'_blank');
        // win.focus();
    }

    descargarPDF(rfcEmpresa: number, fileName: string) {
        let token = localStorage.getItem('token');
        const url = `${this.downloadFileURL}/${fileName}/${token}`;
        console.log("+++++++++++++++" + url);
        location.href = url;
    }

    descargarArchivo(rfcEmpresa: number, fileName: string) {
        let token = localStorage.getItem('token');
        const url = `${this.downloadFileURL}/${fileName}/${token}`;
        console.log("............." + url);
        location.href = url;
    }

    generaXml(idIngreso: number): Promise<any> {
        const url = `${this.ingresoEgresoUrl}/generaXML/${idIngreso}`;
        let token = localStorage.getItem("token");
        // console.log(idNomina);

        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    xmlToIngresoEgreso(fd: FormData) {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.ingresoEgresoUrl}/guardarXMLToIngresoEgreso`;
            this.headers.set('token', token);

            return this.http
                .post(url, fd, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    listAllCobroPago(filterQuery: string, sortBy: string, sortOrder: string, roswOnPage: number, page: number, idCuenta?: number): Promise<any> {
        let token = localStorage.getItem('token');
        let params = new URLSearchParams();

        if (filterQuery) {
            params.append('filterQuery', filterQuery);
        }
        if (sortBy) {
            params.append('sortBy', sortBy);
        }
        if (sortOrder) {
            params.append('sortOrder', sortOrder);
        }
        if (roswOnPage) {
            params.append('rowsOnPage', roswOnPage + '');
        }
        if (page) {
            params.append('page', page + '');
        }
        // parametro para filtrar por id de cuenta
        if (idCuenta) {
            params.append('idCuenta', idCuenta + "");
        }

        if (token) {
            const url = `${this.ingresoEgresoUrl}/listCobroPago`;
            this.headers.set('token', token);

            return this.http.get(url, { headers: this.headers, search: params.toString() })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

}
