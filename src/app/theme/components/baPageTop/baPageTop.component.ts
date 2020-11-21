import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { UsuarioService } from 'app/servicios-backend/usuario.service';
import { Router } from '@angular/router';
import { ActualizacionService } from 'app/comun/actualizacion.service';
import { Usuario } from 'app/entidades/usuario';
import { Subscription } from 'rxjs/Subscription';
import { Empresa } from 'app/entidades/empresa';
import { EmpresaService } from 'app/servicios-backend/empresa.service';
import { CertificadoService } from 'app/servicios-backend/certificado.service';
import { RegimenFiscalService } from '../../../servicios-backend/regimen-fiscal.service';
import { Http } from '@angular/http';

@Component({
    selector: 'ba-page-top',
    templateUrl: './baPageTop.html',
    styleUrls: ['./baPageTop.scss']
})
export class BaPageTop implements OnInit, OnDestroy {
    quitarBoton: boolean = false;
    empresa: Empresa = new Empresa();
    varCer: boolean = false;
    varReg: boolean = false;
    rowsOnPage: number = 10;
    sortBy: string;
    sortOrder: string = 'asc';
    page: number = 1;
    totalCertificados: number = 0;
    totalRegimenes: number = 0;
    query: string = '';
    _cosita: number = 0;
    valorBoton: String;
    variable1: Boolean;
    variable2: Boolean;
    variable3: Boolean;
    variable4: Boolean;
    set cosita(value: number) {
        this._cosita = value;
        this.cositaCambio();
    }
    get cosita() {
        return this._cosita;
    }
    public isScrolled: boolean = false;
    public isMenuCollapsed: boolean = false;
    subscriptionUsuarioCambios: Subscription;
    _nombre: string;
    get nombre(): string {
        return this._nombre;
    }
    set nombre(value: string) {
        this._nombre = value;
    }
    usuarioEmpresa: Usuario = new Usuario();
    url = '';
    constructor(private _state: GlobalState, private usuarioService: UsuarioService, private router: Router, private actualizacionService: ActualizacionService, private empresaService: EmpresaService, private certificadoService: CertificadoService, private regimenFiscalService: RegimenFiscalService, private http: Http) {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
        //this.nombre = actualizacionService.nombreUsuario;
        this.nombre = localStorage.getItem("nombreUsuario");
    }
    ngOnInit() {
        this.actualizacionService.usuarioCambios.subscribe(
            (usuario: Usuario) => {
                // this.nombre= nombre;
                console.log("Obtengo datos", usuario);
                this.usuarioEmpresa = usuario;

            }, (error) => {
                console.log(error);
            }
        );
        this.onCheckEmpty();
        this.checkImageServer();
    }

    checkImageServer() {
        const urlImage = this.usuarioService.urlImageServer();
        this.http.get(urlImage).subscribe((data) => {
            if (data.status == 200) {
                if (data.statusText == "OK") {
                    this.url = urlImage;
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscriptionUsuarioCambios && this.subscriptionUsuarioCambios.closed) {
            this.subscriptionUsuarioCambios.unsubscribe();
        }
    }
    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }
    public scrolledChanged(isScrolled) {
        this.isScrolled = isScrolled;
    }
    Signout() {
        this.usuarioService.logout().then((data) => {
            // console.log('cierro sesion ' + data);
            if (data) {
                this.router.navigate(['login']);
            }
        }).catch((error) => {
            // console.log(error);
        });
    }
    cositaCambio() {
        if (this.cosita == 0) {
            $('#dfeModal').modal({ backdrop: 'static', keyboard: false }, "show")
            this.quitarBoton = true;
            this.valorBoton = "0%";
            this.variable1 = true;
        }
        else if (this.cosita == 1) {
            $('#cfdiModal').modal({ backdrop: 'static', keyboard: false }, "show")
            this.quitarBoton = true;
            this.valorBoton = "25%";
            this.variable2 = true;
        }
        else if (this.cosita == 2) {
            $('#csdModal').modal({ backdrop: 'static', keyboard: false }, "show")
            this.quitarBoton = true;
            this.valorBoton = "50%";
            this.variable3 = true;
        }
        else if (this.cosita == 3) {
            $('#rfModal').modal({ backdrop: 'static', keyboard: false }, "show")
            this.quitarBoton = true;
            this.valorBoton = "75%";
            this.variable4 = true;
        }
        else if (this.cosita == 4) {
            this.quitarBoton = false;
            let valorBoton: String = "100%";
        }
        else {
            console.log("Hay error");
        }
    }
    onCheckEmpty() {
        this.usuarioService.authenticated().then((data) => {
            if (!data) {
                this.router.navigate(['login']);
            }
            this.empresaService.getDetalle().then((dataEmp: any) => {
                this.certificadoService.getCertidicados(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataCert) => {
                    this.totalCertificados = dataCert.total;
                    this.regimenFiscalService.getRegimenes(this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page).subscribe((dataReg) => {
                        this.totalRegimenes = dataReg.total;
                        this.empresa = dataEmp;
                        //let dRFC = dataEmp.rfc == undefined || dataEmp.rfc == null || dataEmp.rfc == 0 || dataEmp.rfc == " ";
                        let dRePa = dataEmp.registroPatronal == undefined || dataEmp.registroPatronal == null || dataEmp.registroPatronal == 0 || dataEmp.registroPatronal == " ";
                        let dRiPu = dataEmp.riesgoPuesto.id == undefined || dataEmp.riesgoPuesto.id == null || dataEmp.riesgoPuesto.id == 0 || dataEmp.riesgoPuesto.id == " ";
                        let dLuEx = dataEmp.lugarExpedicion == undefined || dataEmp.lugarExpedicion == null || dataEmp.lugarExpedicion == 0 || dataEmp.lugarExpedicion == " ";
                        //let dLogo = dataEmp.logo == undefined || dataEmp.logo == null || dataEmp.logo == 0 || dataEmp.logo == " ";
                        let dCeId = dataEmp.cedulaIdentificacionFiscal == undefined || dataEmp.cedulaIdentificacionFiscal == null || dataEmp.cedulaIdentificacionFiscal == 0 || dataEmp.cedulaIdentificacionFiscal == " ";
                        let condicionDFE = /*dRFC &&*/ dRePa && dRiPu && dLuEx;
                        let condicionCFDI = /*dLogo ||*/ dCeId;
                        let condicionCSD = this.totalCertificados == 0;
                        let condicionRF = this.totalRegimenes == 0;
                        if (condicionDFE) {
                            this.cosita = 0;
                        }
                        else if (condicionCFDI) {
                            this.cosita = 1;
                        }
                        else if (condicionCSD) {
                            this.cosita = 2;
                        }
                        else if (condicionRF) {
                            this.cosita = 3;
                        }
                        else {
                            this.cosita = 4;
                            // window.location.reload();
                        }
                    }, (error) => {
                        console.log("Hubo un error", error);
                    }
                    );
                }, (error) => {
                    console.log("Hubo un error", error);
                }
                );
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }
}
