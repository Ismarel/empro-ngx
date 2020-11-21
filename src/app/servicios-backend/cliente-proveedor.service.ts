import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { ClienteProveedor } from '../entidades/cliente-proveedor';
import { HttpHelper } from '../http-helper'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClienteProveedorService {

    private headers = HttpHelper.headersJSON;
    private clienteProveedorUrl = HttpHelper.url + 'clienteProveedor';

    constructor(private http: Http) { }


    private handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('ClienteProveedorService - ERROR: ', resp.error);
            //return resp;
        }
        return Promise.reject(error.message || error);
    }

    getDetalle(id: number) {
        const url = `${this.clienteProveedorUrl}/detalle/${id}`;
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


    update(dataClienteProveedor: ClienteProveedor): Promise<any> {
        const url = `${this.clienteProveedorUrl}/update`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataClienteProveedor), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataClienteProveedor: ClienteProveedor): Promise<any> { //para crear clientes en la variable tipo pandar 1 y para proveedores 2
        const url = `${this.clienteProveedorUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        //----->Se comento esta linea para que registre de una vez la sucursal if (token) {
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataClienteProveedor), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
        //}
    }

    remove(id: number): Promise<any> {
        const url = `${this.clienteProveedorUrl}/eliminar/${id}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getClienteProveedor(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number, tipo: number) {
        //NOTA: MANDAR EN TIPO 1 PARA OBTENER LISTADO DE CLIENTES Y 2 PARA OBTENER LISTADO
        //DE PROVEEDORES
        const url = `${this.clienteProveedorUrl}/list`;
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
        if (tipo) {
            params.append('tipo', tipo + '');//para obtener el listado de clientes mandar en la variable tipo 1 y para listar proveedores 2
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
    autocomplete(filterQuery: String, tipo: number) {//para el autocomplete de clientes mandar en la variable tipo 1 y para el autocomplete de proveedores 2
        let params = new URLSearchParams();
        const url = `${this.clienteProveedorUrl}/autocomplete/${filterQuery}/${tipo}`;
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


    getCSVInfoCliente() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.clienteProveedorUrl}/clienteCSV/${token}`;
            window.location.href = url;
        }
    }

    getCSVInfoProveedor() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.clienteProveedorUrl}/proveedorCSV/${token}`;
            window.location.href = url;
        }
    }

    autocompleteRFC(filterQuery: String, tipo: number) {//para el autocomplete de clientes mandar en la variable tipo 1 y para el autocomplete de proveedores 2
        let params = new URLSearchParams();
        const url = `${this.clienteProveedorUrl}/autocompleteRFC/${filterQuery}/${tipo}`;
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
