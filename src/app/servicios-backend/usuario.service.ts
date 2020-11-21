import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import { Usuario, Recuperacion } from '../entidades/usuario';
import { HttpHelper } from '../http-helper';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {

    private headers = HttpHelper.headersJSON;
    private usuarioUrl = HttpHelper.url + 'usuario';

    private permisosUrl = {
        'bancos': HttpHelper.url + 'empresa/permisoBancos',
        'nomina': HttpHelper.url + 'empresa/permisoNominas',
        'dashboard': HttpHelper.url + 'empresa/permisoDashboard',
        'reportes': HttpHelper.url + 'empresa/permisoReportes',
        'listaIngresos': HttpHelper.url + 'empresa/permisoIngresos',
        'listaEgresos': HttpHelper.url + 'empresa/permisoEgresos',
        'comprobantesFiscales': HttpHelper.url + 'empresa/permisoCFDI',
        'miempresa': HttpHelper.url + 'empresa/permisoEmpresa'
    };

    constructor(private http: Http) { }

    getLogin(usuario: Usuario): Promise<Usuario> {
        const url = `${this.usuarioUrl}/login`;
        console.log('url: ' + url);
        return this.http.post(url, JSON.stringify(usuario), { headers: this.headers })
            .toPromise()
            .then(response => response.json() as Promise<Usuario>)
            .catch(this.handleError);
    }

    recoverPassword(data: Recuperacion): Promise<Recuperacion> {
        const url = `${HttpHelper.url}mail/correoRecuperacion`;
        return this.http.post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(response => response.json() as Promise<Recuperacion>)
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        let resp = error.json();
        if (resp.error) {
            console.error('usuarioService - ERROR: ', resp.error);
            return resp;
        }
        return Promise.reject(error.message || error);
    }

    authenticated(): Promise<boolean> {
        const url = `${this.usuarioUrl}/valida`;
        const token = localStorage.getItem('token');
        if (!token) {
            return Promise.resolve<boolean>(false);
        } else {
            this.headers.set('token', token);
            return this.http.post(url, {}, { headers: this.headers })
                .toPromise()
                .then(response => {
                    // console.log(response.json());                           
                    if (response.ok && response.json().ok) {
                        if (response.json().token) {
                            localStorage.setItem('token', response.json().token);
                        }
                        // response => Promise.resolve<boolean>(true)
                        return Promise.resolve<boolean>(true);
                    } else {
                        // response => Promise.resolve<boolean>(false)
                        return Promise.resolve<boolean>(false);
                    }
                })
                .catch(this.handleError);
        }
    }

    roleAuth(view: string): Promise<boolean> {
        const url = this.permisosUrl[view];
        const token = localStorage.getItem('token');
        if (!token) {
            return Promise.resolve<boolean>(false);
        } else {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => {
                    // console.log(response.json());                           
                    if (response.ok && response.json().ok) {
                        // response => Promise.resolve<boolean>(true)
                        return Promise.resolve<boolean>(true);
                    } else {
                        // response => Promise.resolve<boolean>(false)
                        return Promise.resolve<boolean>(false);
                    }
                })
                .catch(error => {
                    return Promise.resolve<boolean>(false);
                });
        }
    }

    logout(): Promise<boolean> {
        const url = `${this.usuarioUrl}/logout`;
        const token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);
            return this.http.post(url, {}, { headers: this.headers })
                .toPromise()
                .then(response => {
                    localStorage.removeItem('token');
                    return Promise.resolve<boolean>(true);
                })
                .catch(this.handleError);
        }
        return Promise.resolve<boolean>(false);
    }

    getDetalle(id: number): Promise<Usuario> {
        const url = `${this.usuarioUrl}/detalle/${id}`;
        const token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Usuario>)
                .catch(this.handleError);
        }
    }


    update(dataUsuario: Usuario): Promise<any> {
        const url = `${this.usuarioUrl}/update`;
        const token = localStorage.getItem('token');
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataUsuario), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }

    changepass(dataUsuario: Usuario, mtoken: string): Promise<any> {
        const url = `${this.usuarioUrl}/changepass`;
        const token = mtoken;
        this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataUsuario), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
    }


    create(dataUsuario: Usuario): Promise<any> {
        const url = `${this.usuarioUrl}/crear`;
        let token = localStorage.getItem("token");
        this.headers.set('token', token);
        //  if (token) {
        //  this.headers.set('token', token);
        return this.http
            .post(url, JSON.stringify(dataUsuario), { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Promise<any>)
            .catch(this.handleError);
        // }
    }


    remove(id: number): Promise<any> {
        const url = `${this.usuarioUrl}/eliminar/${id}`;
        const token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    getUsuarios(filterQuery: string, sortBy: string, sortOrder: string,
        rowsOnPage: number, page: number) {
        const url = `${this.usuarioUrl}/list`;
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
        const url = `${this.usuarioUrl}/autocomplete/${filterQuery}`;
        let token = localStorage.getItem("token");
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<any>)
                .catch(this.handleError);
        }
    }

    registrate(dataUsuario: Usuario): Observable<any> {
        const url = `${this.usuarioUrl}/registrate`;
        return this.http
            .post(url, JSON.stringify(dataUsuario), { headers: this.headers }).map((response) => { response.json() });

    }

    getDetalleUsuarioSesion(): Promise<Usuario> {
        const url = `${this.usuarioUrl}/detalleUsuarioSesion`;
        const token = localStorage.getItem('token');
        if (token) {
            this.headers.set('token', token);
            return this.http.get(url, { headers: this.headers })
                .toPromise()
                .then(response => response.json() as Promise<Usuario>)
                .catch(this.handleError);
        }
    }

    getCSVInfo() {
        let token = localStorage.getItem("token");
        if (token) {
            const url = `${this.usuarioUrl}/usuarioCSV/${token}`;
            window.location.href = url;
        }

    }

    urlImageServer() {
        let token = localStorage.getItem("token");
        const urlImage = `${HttpHelper.url}files/download/3/imgProfile.jpg/${token}`;
        if (token) {
            return urlImage;
        }
    }

}
