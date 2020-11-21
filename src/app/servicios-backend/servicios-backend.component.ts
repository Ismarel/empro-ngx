import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios-backend/usuario.service';
import { Usuario } from '../entidades/usuario';
import { Empresa } from '../entidades/empresa';
import { EmpresaService } from '../servicios-backend/empresa.service';
import { Certificado } from '../entidades/certificado';
import { CertificadoService } from '../servicios-backend/certificado.service';
import { Folios } from '../entidades/folios';
import { FoliosService } from '../servicios-backend/folios.service';
import { RegimenFiscal } from '../entidades/regimen-fiscal';
import { RegimenFiscalService } from '../servicios-backend/regimen-fiscal.service';
import { TipoRegimen } from '../entidades/tipo-regimen';
import { Concepto } from '../entidades/concepto';
import { Unidad } from '../entidades/unidad';
import { Producto } from '../entidades/producto';
import { ConceptoService } from '../servicios-backend/concepto.service';
import { Sucursal } from '../entidades/sucursal';
import { SucursalService } from '../servicios-backend/sucursal.servicio';
import { ClienteProveedor } from '../entidades/cliente-proveedor';
import { ClienteProveedorService } from '../servicios-backend/cliente-proveedor.service';
import { CpService } from '../servicios-backend/cp.service';
import { Cuenta } from '../entidades/cuenta';
import { CuentaService } from '../servicios-backend/cuenta.service';
import { Banco } from '../entidades/banco';
import { Tarjeta } from '../entidades/tarjeta';
import { TarjetaService } from '../servicios-backend/tarjeta.service';
import { TipoTarjeta } from '../entidades/tipo-tarjeta';
import { ComprobanteFiscal } from '../entidades/comprobante-fiscal';
import { ComprobanteFiscalService } from '../servicios-backend/comprobante-fiscal.service';
import { UsoCfdi } from '../entidades/uso-cfdi';
import { ComprobanteFiscalConcepto } from '../entidades/comprobante-fiscal-concepto';
import { FormasPago } from '../entidades/formas-pago';
import { Documento } from '../entidades/documento';
import { Trabajador } from '../entidades/trabajador';
import { TipoContrato } from '../entidades/tipo-contrato';
import { TipoJornada } from '../entidades/tipo-jornada';
import { PeriodicidadPago } from '../entidades/periodicidad-pago';
import { TrabajadorService } from '../servicios-backend/trabajador.service';
import { IngresoEgreso } from '../entidades/ingreso-egreso';
import { IngresoEgresoService } from '../servicios-backend/ingreso-egreso.service'
import { ConfiguracionNominaService } from '../servicios-backend/configuracion-nomina.service'
import { NominaService } from '../servicios-backend/nomina.service'
import { ConfiguracionNomina } from '../entidades/configuracion-nomina';
import { Nomina } from '../entidades/nomina';
import { TrabajadorIncidencia } from '../entidades/trabajador-incidencia';
import { TipoDeduccion } from '../entidades/tipo-deduccion';
import { TipoPercepcion } from '../entidades/tipo-percepcion';
import { TipoIncapacidad } from '../entidades/tipo-incapacidad';
import { TipoIncidencia } from '../entidades/tipo-incidencia';
import { DropzoneService } from 'app/servicios-backend/dropzone.service';

@Component({
    selector: 'servicios',
    templateUrl: './servicios-backend.html'
})
export class ServiciosBackendComponent implements OnInit {
    constructor(private usuarioService: UsuarioService, private empresaService: EmpresaService, private foliosService: FoliosService,
        private certificadoService: CertificadoService, private regimenFiscalService: RegimenFiscalService, private conceptoService: ConceptoService,
        private sucursalService: SucursalService, private clienteProveedorService: ClienteProveedorService, private cPService: CpService, private cuentaService: CuentaService
        , private tarjetaService: TarjetaService, private comprobanteFiscalService: ComprobanteFiscalService, private trabajadorService: TrabajadorService, private ingresoEgresoService: IngresoEgresoService,
        private nominaService: NominaService, private configuracionNominaService: ConfiguracionNominaService, private dropzoneService: DropzoneService) {//

    }

    ngOnInit() {
        console.log('Hola Mundo');
        this.login();
        this.crearUsuario();
        this.actualizarUsuario();
        this.detalleUsuario();
        this.eliminarUsuario();
        this.listUsuarios();
        this.detalleEmpresa();
        this.crearEmpresa();
        this.actualizaEmpresa();
        this.eliminarEmpresa();
        this.actualizaCertificado();
        this.detalleCertidicado();
        this.listCertificados();
        this.eliminarCertificado();
        this.autocompleteCertificado();
        this.registro();
        this.crearFolio();
        this.actualizaFolio();
        this.detalleFolio();
        this.listFolioss();
        this.eliminarFolio();
        this.autocompleteFolio();
        this.crearRegimenF();
        this.actualizaRegimenF();
        this.detalleRegimenF();
        this.listRegimenes();
        this.autocompleteRegimen();
        this.eliminarRegimenFiscal();
        this.crearConcepto();
        this.actualizarConcepto();
        this.detalleConcepto();
        this.listConceptos();
        this.autocompleteConcepto();
        this.eliminarConcepto();
        this.autocompleteUnidad();
        this.autocompleteProducto();
        this.crearSucursal();
        this.autocompleteSucursal();
        this.autocompleteRiesgoP();
        this.crearClienteProveedor();
        this.actualizaClienteProveedor();
        this.autocompleteClienteProveedor();
        this.detalleClienteProveedor();
        this.listClientesProveedores();
        this.eliminarClienteProveedor();
        this.autocompleteCp();
        this.detalleCp();
        this.listSucursales();
        this.crearCuenta();
        this.actualizarCuenta();
        this.detalleCuenta();
        this.listCuentas();
        this.autocompleteCuenta();
        this.crearTarjeta();
        this.actualizaTarjeta();
        this.detalleTarjeta();
        this.listTarjetas();
        this.autocompleteTarjeta();
        this.consultaLocalizacion();
        this.autocompleteBancos();
        this.autocompleteTipoRegimen();
        this.autocompleteTipoDocumento();
        this.autocompleteTipoRegimenByEmpresa();
        this.crearComprobanteFiscal();
        this.actualizarComprobanteFiscal();
        this.detalleComprobanteFiscal();
        this.listComprobantes();
        this.autocompleteComprobante();
        this.autocompleteUsoCfdi();
        this.eliminarComprobante();
        this.crearTrabajador();
        this.acturlizarTrabajador();
        this.detalleTrabajador();
        this.listTrabajador();
        this.autocompleteTrabajador();
        this.autocompleteTipoContrato();
        this.autocompletePeriodicidad();
        this.autocompleteTipoJornada();
        this.crearIngresoE();
        this.actualizarIngresoE();
        this.detalleIngreso();
        this.listIngresos();
        this.autocompleteIngresos();
        this.registro();
        this.autocompleteTComprobanteEgresoConCfdi();
        this.crearConfiguracionNomina();
        this.crearNomina();
        this.crearTrabajadorIncidencia();
        this.actualizaTrabajadorIncidencia();
        // this.listNominas();
    }


    login() {
        let u = new Usuario();
        //c.id = 20;
        u.correo = "cflores@nst.mx";
        u.password = "123";
        this.usuarioService.getLogin(u).then(resp => {
            console.log(resp);
        });
    }

    crearUsuario() {
        let u = new Usuario();
        u.nombre = 'José';
        u.correo = 'jlopez@empro.mx';
        u.estatus = 1;
        u.password = '123';
        let e = new Empresa();
        e.id = 1;
        u.empresa = e;
        this.usuarioService.create(u).then(resp => {
            console.log(resp);
        });
    }

    actualizarUsuario() {
        let u = new Usuario();
        u.id = 3;
        u.nombre = 'José Javier';
        u.correo = 'jlopez@empro.mx';
        u.estatus = 1;
        u.password = '123';
        let e = new Empresa();
        e.id = 1;
        u.empresa = e;
        this.usuarioService.update(u).then(resp => {
            console.log(resp);
        });
    }

    detalleUsuario() {
        let id = 1;
        this.usuarioService.getDetalle(id).then(resp => {
            console.log(resp);
        });
    }

    eliminarUsuario() {
        let id = 2;
        this.usuarioService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    listUsuarios() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.usuarioService.getUsuarios(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    detalleEmpresa() {
        this.empresaService.getDetalle().then(resp => {
            console.log(resp);
        });
    }

    crearEmpresa() {
        let e = new Empresa();
        e.nombre = 'Empresa 3';
        e.calle = 'Cuautemoc ';
        e.cedulaIdentificacionFiscal = "4242ksf";
        e.colonia = "Cuautemoc";
        // e.lugarExpedicion = "Cuautemoc";
        e.numExterior = "20";
        this.empresaService.create(e).then(resp => {
            console.log(resp);
        });
    }

    actualizaEmpresa() {
        let e = new Empresa();
        e.id = 2;
        e.nombre = 'Empresa 1 actualizada';
        e.calle = 'Cuautemoc ';
        e.cedulaIdentificacionFiscal = "4242ksf";
        e.colonia = "Cuautemoc";
        //e.lugarExpedicion = "Cuautemoc";
        e.numExterior = "20";
        this.empresaService.update(e).then(resp => {
            console.log(resp);
        });
    }

    eliminarEmpresa() {
        this.empresaService.remove().then(resp => {
            console.log(resp);
        });
    }

    crearCertificado() {
        let c = new Certificado();
        c.archivoLlave = 'archivo2';
        c.numeroCertificado = "2";
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.certificadoService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizaCertificado() {
        let c = new Certificado();
        c.id = 3;
        c.archivoLlave = 'archivo3.cer';
        c.numeroCertificado = "3";
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.certificadoService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleCertidicado() {
        let id = 1;
        this.certificadoService.getDetalle(id).then(resp => {
            console.log(resp);
        });
    }

    eliminarCertificado() {
        let id = 3;
        this.certificadoService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    listCertificados() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'numeroCertificado';
        let sortOrder = 'asc';
        let page: number = 1;

        this.certificadoService.getCertidicados(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteCertificado() {
        this.certificadoService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    registro() {
        // let u = new Usuario();
        // u.nombre = 'Veronica';
        // u.correo = 'vlopez@nueva.mx';
        // u.password = '123';

        // u.nombreEmpresa = "Nueva";
        // this.usuarioService.registrate(u).then(resp => {
        //     console.log(resp);
        // });
    }


    crearFolio() {
        let c = new Folios();
        c.serie = 'E';
        c.estatus = true;
        c.folioInicial = 1;
        c.folioActual = 7;
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.foliosService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizaFolio() {
        let c = new Folios();
        c.id = 1;
        c.serie = 'A actualizado';
        c.estatus = true;
        c.folioInicial = 1;
        c.folioActual = 3;
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.foliosService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleFolio() {
        let id = 1;
        this.foliosService.getDetalle(id).then(resp => {
            console.log(resp);
        });
    }

    eliminarFolio() {
        let id = 3;
        this.foliosService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    listFolioss() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'serie';
        let sortOrder = 'asc';
        let page: number = 1;

        this.foliosService.getFolios(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteFolio() {
        this.foliosService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    crearRegimenF() {
        let c = new RegimenFiscal();
        let tr = new TipoRegimen();
        tr.id = 4;
        c.tipoRegimen = tr;

        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.regimenFiscalService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizaRegimenF() {
        let c = new RegimenFiscal();
        let tr = new TipoRegimen();
        c.id = 1;
        tr.id = 1;
        c.tipoRegimen = tr;

        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.regimenFiscalService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleRegimenF() {
        let id = 1;
        // this.regimenFiscalService.getDetalle(id).then(resp => {
        //     console.log(resp);
        // });
    }

    eliminarRegimenFiscal() {
        let id = 3;
        this.regimenFiscalService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    listRegimenes() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'tipoRegimen.nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.regimenFiscalService.getRegimenes(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteRegimen() {
        this.regimenFiscalService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    crearConcepto() {
        let c = new Concepto();
        let u = new Unidad();
        u.id = 1;
        c.unidad = u;
        let p = new Producto();
        p.id = 1;
        c.producto = p;
        c.estatus = 1;
        c.nombre = "Elimminar";
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.conceptoService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizarConcepto() {
        let c = new Concepto();
        c.id = 1;
        let u = new Unidad();
        u.id = 1;
        c.unidad = u;
        let p = new Producto();
        p.id = 1;
        c.producto = p;
        c.estatus = 1;
        c.nombre = "Autopartes Actualizado";
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.conceptoService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleConcepto() {
        let id = 1;
        this.conceptoService.getDetalle(id).subscribe(resp => {
            console.log(resp);
        });
    }

    eliminarConcepto() {
        let id = 7;
        this.conceptoService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    listConceptos() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.conceptoService.getList(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteConcepto() {
        this.conceptoService.autocomplete('@@@').subscribe(resp => {
            console.log(resp);
        });
    }

    autocompleteUnidad() {
        this.conceptoService.autocompleteUnidad('a').then(resp => {
            console.log(resp);
        });
    }
    autocompleteProducto() {
        this.conceptoService.autocompleteProducto('a').then(resp => {
            console.log(resp);
        });
    }

    crearSucursal() {
        let c = new Sucursal();
        let u = new Usuario();
        u.id = 1;
        c.responsable = u;
        c.calle = "Paseo De La Reforma No. 389 Piso 7";

        c.nombre = "Cuauhtémoc";
        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.sucursalService.create(c).then(resp => {
            console.log(resp);
        });
    }

    autocompleteSucursal() {
        this.sucursalService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    autocompleteRiesgoP() {
        this.empresaService.autocompleteRiesgo('@@@').then(resp => {
            console.log(resp);
        });
    }

    crearClienteProveedor() {
        let c = new ClienteProveedor();
        let e = new Empresa();
        e.id = 1;
        let s = new Sucursal();
        //  s.id = 2;
        let u = new Usuario();
        u.id = 1;
        s.responsable = u;
        s.calle = "Calle chihuahua No. 334 Piso 7";
        s.nombre = "Chihuahua";
        s.empresa = e;
        c.sucursal = s;

        c.estatus = 1;
        c.nombre = "Proveedor9";
        c.tipo = 2;
        //c.tipoCliente = 1;
        c.correo = "proveedor9@nst.mx";
        c.rfc = "JAX9ZD01ZZ27";


        c.empresa = e;
        this.clienteProveedorService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizaClienteProveedor() {
        let c = new ClienteProveedor();
        c.id = 1;
        let s = new Sucursal();
        s.id = 1;
        c.sucursal = s;

        c.estatus = 1;
        c.nombre = "Cliente1 actualizado";
        c.tipo = 1;
        c.tipoCliente = 1;
        c.correo = "cliente1@nst.mx";
        c.rfc = "3938FJFD04DE42";

        let e = new Empresa();
        e.id = 1;
        c.empresa = e;
        this.clienteProveedorService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleClienteProveedor() {
        let id = 1;
        this.clienteProveedorService.getDetalle(id).subscribe(resp => {
            console.log(resp);
        });
    }

    eliminarClienteProveedor() {
        let id = 9;
        this.clienteProveedorService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    listClientesProveedores() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.clienteProveedorService.getClienteProveedor(filterQuery, sortBy, sortOrder, rowsOnPage, page, 2).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteClienteProveedor() {
        this.clienteProveedorService.autocomplete('@@@', 1).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteCp() {
        this.cPService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    detalleCp() {
        let id = 2360757;
        this.cPService.getDetalle(id).subscribe(resp => {
            console.log(resp);
        });
    }

    listSucursales() {
        let filterQuery = 'a';
        let rowsOnPage = 10;
        let sortBy = 'nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.sucursalService.getSucursales(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    crearCuenta() {
        let c = new Cuenta();
        let s = new Sucursal();
        //  s.id = 2;
        let b = new Banco();
        b.id = 4;
        c.estatus = 1;
        c.numeroCuenta = 545124454816578;
        c.saldo = 655482;
        c.observaciones = "Es una prueba3";
        c.tipoBanco = 1;
        c.banco = b;

        this.cuentaService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizarCuenta() {
        let c = new Cuenta();
        let s = new Sucursal();
        //  s.id = 2;
        c.id = 3;
        let b = new Banco();
        b.id = 4;
        c.estatus = 1;
        c.numeroCuenta = 545124454816578;
        c.saldo = 655482;
        c.observaciones = "Es una prueba3 actualizada";
        c.tipoBanco = 1;
        c.banco = b;

        this.cuentaService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleCuenta() {
        let id = 1;
        this.cuentaService.getDetalle(id).subscribe(resp => {
            console.log(resp);
        });
    }

    listCuentas() {
        let filterQuery = '5';
        let rowsOnPage = 10;
        let sortBy = 'numeroCuenta';
        let sortOrder = 'asc';
        let page: number = 1;

        this.cuentaService.getCuentas(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteCuenta() {
        this.cuentaService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    crearTarjeta() {
        let t = new Tarjeta();
        let s = new Sucursal();
        //  s.id = 2;
        let c = new Cuenta();
        c.id = 3;
        let tipoT = new TipoTarjeta();
        tipoT.id = 1;
        t.estatus = 1;
        t.numeroTarjeta = 571128984816578;
        t.saldo = 900482;
        t.tipoTarjeta = tipoT;
        t.cuenta = c;


        this.tarjetaService.create(t).then(resp => {
            console.log(resp);
        });
    }

    actualizaTarjeta() {
        let t = new Tarjeta();
        let s = new Sucursal();
        //  s.id = 2;
        let c = new Cuenta();
        c.id = 1;
        t.id = 1;
        let tipoT = new TipoTarjeta();
        tipoT.id = 1;
        t.estatus = 1;
        t.numeroTarjeta = 545123484816578;
        t.saldo = 955482;
        t.tipoTarjeta = tipoT;
        t.cuenta = c;


        this.tarjetaService.update(t).then(resp => {
            console.log(resp);
        });
    }

    detalleTarjeta() {
        let id = 1;
        this.tarjetaService.getDetalle(id).then(resp => {
            console.log(resp);
        });
    }

    listTarjetas() {
        let filterQuery = '5';
        let rowsOnPage = 10;
        let sortBy = 'numeroTarjeta';
        let sortOrder = 'asc';
        let page: number = 1;

        this.tarjetaService.getTarjetas(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteTarjeta() {
        this.tarjetaService.autocomplete('@@@').then(resp => {
            console.log(resp);
        });
    }

    consultaLocalizacion() {
        let id = 1;
        this.cPService.consultarLocalizacion("2400").then(resp => {
            console.log(resp);
        });
    }

    autocompleteBancos() {
        this.cuentaService.autocompleteBancos('@@@').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteTipoRegimen() {
        this.regimenFiscalService.autocompleteTipoRegimen('@@@').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteTipoDocumento() {
        this.regimenFiscalService.autocompleteDocumentoByTipoRegimen('@@@', 3).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteTipoRegimenByEmpresa() {
        this.regimenFiscalService.autocompleteTipoRegimenByEmpresa('@@@').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    crearComprobanteFiscal() {
        let c = new ComprobanteFiscal();
        let cl = new ClienteProveedor();
        cl.id = 1;
        let cfdi = new UsoCfdi();
        cfdi.id = 1;
        let s = new Sucursal();
        //  s.id = 2;
        let rf = new RegimenFiscal();
        rf.id = 18;
        let f = new Folios();
        f.id = 1;
        let formaPago = new FormasPago();
        formaPago.id = 1;
        c.formaPago = formaPago;
        c.condicionPago = "condicion2";
        c.descuento = 20;
        c.cliente = cl;
        c.montoIva = 16;
        c.moneda = 0;
        c.motivoDescuento = "descuento2";
        c.usoCfdi = cfdi;
        c.numeroCuenta = "545855555158";
        c.observacion = "observaciones2";
        c.regimen = rf;
        c.serie = f;
        c.subtotal = 3000;
        c.tipoComprobante = 1;
        c.total = 4000;
        c.metodoPago = 0;
        let concepto = new Concepto();
        let u = new Unidad();
        u.id = 2;
        concepto.unidad = u;
        let p = new Producto();
        p.id = 1;
        concepto.producto = p;
        concepto.estatus = 1;
        concepto.nombre = "CONCEPTO NUEVO2";
        let cfc = new ComprobanteFiscalConcepto();
        cfc.cantidad = 1;
        cfc.importe = 3000;
        cfc.precioUnitario = 3000;
        cfc.concepto = concepto;
        let listC = new Array<ComprobanteFiscalConcepto>();
        listC[0] = cfc;
        c.comprobanteFiscalConceptoList = listC;
        this.comprobanteFiscalService.create(c).then(resp => {
            console.log(resp);
        });
    }

    actualizarComprobanteFiscal() {
        let c = new ComprobanteFiscal();
        c.id = 1;
        let cl = new ClienteProveedor();
        cl.id = 1;
        let cfdi = new UsoCfdi();
        cfdi.id = 1;
        let s = new Sucursal();
        //  s.id = 2;
        let rf = new RegimenFiscal();
        rf.id = 18;
        let f = new Folios();
        f.id = 1;
        let fp = new FormasPago();
        fp.id = 1;
        c.formaPago = fp;
        c.condicionPago = "condicion";
        c.descuento = 20;
        c.cliente = cl;
        c.montoIva = 16;
        c.moneda = 0;
        c.motivoDescuento = "descuento";
        c.usoCfdi = cfdi;
        c.numeroCuenta = "5545455545";
        c.observacion = "observaciones";
        c.regimen = rf;
        c.serie = f;
        c.subtotal = 3000;
        c.tipoComprobante = 1;
        c.total = 4000;
        c.metodoPago = 0;
        c.id = 1;
        c.cp = "7020";
        let doc = new Documento();
        doc.id = 1;
        c.documento = doc;
        let concepto = new Concepto();
        concepto.id = 1;
        let cfc = new ComprobanteFiscalConcepto();
        cfc.cantidad = 1;
        cfc.importe = 3000;
        cfc.precioUnitario = 3000;
        cfc.concepto = concepto;
        let listC = new Array<ComprobanteFiscalConcepto>();
        listC[0] = cfc;
        c.comprobanteFiscalConceptoList = listC;
        this.comprobanteFiscalService.update(c).then(resp => {
            console.log(resp);
        });
    }

    detalleComprobanteFiscal() {
        let id = 1;
        this.comprobanteFiscalService.getDetalle(id).then(resp => {
            console.log(resp);
        });
    }

    listComprobantes() {
        let filterQuery = '5';
        let rowsOnPage = 10;
        let sortBy = 'numeroCuenta';
        let sortOrder = 'asc';
        let page: number = 1;

        this.comprobanteFiscalService.getComprobanteFiscales(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }

    autocompleteComprobante() {
        this.comprobanteFiscalService.autocomplete(null).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteUsoCfdi() {
        this.comprobanteFiscalService.autocompleteUsoCfdi('').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    eliminarComprobante() {
        let id = 3;
        this.comprobanteFiscalService.remove(id).then(resp => {
            console.log(resp);
        });
    }

    crearTrabajador() {
        let t = new Trabajador();
        let tj = new TipoJornada();
        let pp = new PeriodicidadPago();
        let tc = new TipoContrato();
        tj.id = 1;
        pp.id = 1;
        tc.id = 1;
        let s = new Sucursal();
        s.id = 1;
        let tr = new TipoRegimen();
        tr.id = 1;
        let b = new Banco();
        b.id = 1;
        t.area = "Desarrollo";
        t.banco = b;
        t.calle = "Arica";
        t.claveInterbancaria = "25645897456324125";
        t.colonia = "Tepeyact Insurgentes";
        t.cp = "7020";
        t.curp = "JUZE890512HTL"
        t.estado = "Ciudad de México";
        t.jornada = tj;
        t.localidad = "Tepeyact";
        t.municipio = "Gustavo A Madero";
        t.nombre = "Ernesto Juárez";
        t.nss = "554fsf214sf";
        t.numeroEmpleado = 1;
        t.numeroExterior = "12";
        t.pais = "México";
        t.periodicidad = pp;
        t.puesto = "Desarrollador";
        t.referencia = "Entre calle Ricarte";
        t.registroPatronal = "5454fgsfsgsw4"
        t.rfc = "JUZE890512HTL";
        t.salarioBase = 20000;
        t.salarioDiario = 1000;
        t.sucursal = s;
        t.tipoContrato = tc;
        t.tipoRegimen = tr;
        t.tipoTrabajador = false;

        this.trabajadorService.create(t).then(resp => {
            console.log(resp);
        });
    }

    acturlizarTrabajador() {
        let t = new Trabajador();
        t.id = 1;
        let tj = new TipoJornada();
        let pp = new PeriodicidadPago();
        let tc = new TipoContrato();
        tj.id = 1;
        pp.id = 1;
        tc.id = 1;
        let s = new Sucursal();
        s.id = 1;
        let tr = new TipoRegimen();
        tr.id = 1;
        let b = new Banco();
        b.id = 1;
        t.area = "Desarrollo";
        t.banco = b;
        t.calle = "Arica";
        t.correo = "ejuarez@nst.mx";
        t.claveInterbancaria = "25645897456324125";
        t.colonia = "Tepeyact Insurgentes";
        t.cp = "7020";
        t.curp = "JUZE890512HTL"
        t.estado = "Ciudad de México";
        t.jornada = tj;
        t.localidad = "Tepeyact";
        t.municipio = "Gustavo A Madero";
        t.nombre = "Ernesto Juárez";
        t.nss = "554fsf214sf";
        t.numeroEmpleado = 1;
        t.numeroExterior = "12";
        t.pais = "México";
        t.periodicidad = pp;
        t.puesto = "Desarrollador";
        t.referencia = "Entre calle Ricarte";
        t.registroPatronal = "5454fgsfsgsw4"
        t.rfc = "JUZE890512HTL";
        t.salarioBase = 20000;
        t.salarioDiario = 1000;
        t.sucursal = s;
        t.tipoContrato = tc;
        t.tipoRegimen = tr;
        t.tipoTrabajador = false;

        this.trabajadorService.update(t).then(resp => {
            console.log(resp);
        });
    }

    detalleTrabajador() {
        let id = 3;
        this.trabajadorService.getDetalle(id).then(resp => {
            console.log(resp);
        });
    }

    listTrabajador() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.trabajadorService.getTrabajadores(filterQuery, sortBy, sortOrder, rowsOnPage, page).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }


    autocompleteTrabajador() {
        this.trabajadorService.autocomplete('').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }
    autocompleteTipoContrato() {
        this.trabajadorService.autocompleteTipoContrato('').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteTipoJornada() {
        this.trabajadorService.autocompleteTipoJornada('').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompletePeriodicidad() {
        this.trabajadorService.autocompletePeriodicidadPago('').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    crearIngresoE() {
        let ie = new IngresoEgreso();
        let c = new Cuenta();
        let d = new Documento();
        let con = new Concepto();

        c.id = 1;
        d.id = 1;
        let b = new Banco();
        // con.id = 1;
        b.id = 5;
        ie.archivoPdf = "archivo6.pdf";
        ie.archivoXml = "archivoXml6.xml";
        ie.banco = b;
        ie.cuenta = c;
        ie.estatus = 1;
        ie.fecha = 1504036319973;
        ie.monto = 30000;
        ie.subtotal = 30000;
        ie.iva = 34800;
        ie.total = 34800;
        ie.tipo = true;
        ie.tipoPago = 1;
        ie.conceptos = "concepto";

        this.ingresoEgresoService.create(ie).then(resp => {
            console.log(resp);
        });
    }

    actualizarIngresoE() {
        let ie = new IngresoEgreso();
        let c = new Cuenta();
        let d = new Documento();
        let con = new Concepto();
        ie.id = 2;
        c.id = 1;
        d.id = 1;
        let b = new Banco();
        con.id = 1;
        b.id = 5;
        ie.archivoPdf = "archivo5.pdf";
        ie.archivoXml = "archivoXml5.xml";
        ie.banco = b;
        ie.cuenta = c;
        ie.estatus = 1;
        ie.fecha = 1504036319973;
        ie.monto = 30000;
        ie.subtotal = 30000;
        ie.iva = 34800;
        ie.total = 34800;
        ie.tipo = true;
        ie.tipoPago = 1;
        ie.conceptos = "con";

        this.ingresoEgresoService.update(ie).then(resp => {
            console.log(resp);
        });
    }

    detalleIngreso() {
        console.log('Por que entra aqui?');

        /*
        let id = 3;
        this.ingresoEgresoService.getDetalle(id).then(resp => {
            console.log(resp);
        });*/
    }

    listIngresos() {
        let filterQuery = '';
        let rowsOnPage = 10;
        let sortBy = 'nombre';
        let sortOrder = 'asc';
        let page: number = 1;

        this.ingresoEgresoService.getIngresoEgresos(filterQuery, sortBy, sortOrder, rowsOnPage, page, false).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los contactos, ', error);
            });
    }


    autocompleteIngresos() {
        this.ingresoEgresoService.autocomplete('', false).subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    autocompleteTComprobanteEgresoConCfdi() {
        this.ingresoEgresoService.autocompleteTComprobanteEgresoConCfdi('').subscribe(
            (resp) => {
                console.log(resp);
            },
            (error) => {
                console.warn('Error al buscar todos los bancos, ', error);
            });
    }

    crearConfiguracionNomina() {
        let c = new ConfiguracionNomina();
        let s = new Sucursal();
        s.id = 1;
        c.periodicidad.id = 2;
        c.periodo = 15;
        c.sucursal = s;

        this.configuracionNominaService.create(c).then(resp => {
            console.log(resp);
        });
    }

    crearNomina() {
        let c = new ConfiguracionNomina();
        c.id = 2;
        let s = new Sucursal();
        let n = new Nomina();
        let t = new Trabajador();
        n.archivoPdf = "nomina1.pdf";
        n.archivoXml = "nomina1.xml";
        n.configuracion = c;
        n.estatus = 0;
        t.id = 3;
        n.trabajador = t;

        this.nominaService.create(n).then(resp => {
            console.log(resp);
        });
    }

    crearTrabajadorIncidencia() {
        let ti = new TrabajadorIncidencia();
        let tp = new TipoPercepcion();
        tp.id = 22;
        let t = new Trabajador();
        t.id = 3;
        ti.montoPercepcion = 5000;
        ti.nNominasPercepcion = 3;
        ti.nominaPercepcion.percepcion = tp;
        ti.trabajador = t;


        this.nominaService.createTrabajadorIncidencia(ti).then(resp => {
            console.log(resp);
        });
    }

    actualizaTrabajadorIncidencia() {
        let ti = new TrabajadorIncidencia();
        ti.id = 1;
        let tp = new TipoPercepcion();
        tp.id = 22;
        let t = new Trabajador();
        t.id = 3;
        ti.montoPercepcion = 5000;
        ti.nNominasPercepcion = 4;
        ti.nNominasDeduccion = 1;
        ti.nominaPercepcion.percepcion = tp;
        ti.trabajador = t;


        this.nominaService.updateTrabajadorIncidencia(ti).then(resp => {
            console.log(resp);
        });
    }

    /* listNominas() {
          let filterQuery = '';
          let rowsOnPage = 10;
          let sortBy = 'nombre';
          let sortOrder = 'asc';
          let page: number = 1;
          let estatus;
          let periodicidad;
          let anio;
          let mesInicio;
          let mesFin;
          let idTrabajador;
          this.nominaService.getNominas(filterQuery, sortBy, sortOrder, rowsOnPage, page, estatus, periodicidad, anio, mesInicio, mesFin, idTrabajador).subscribe(
              (resp) => {
                  console.log(resp);
              },
              (error) => {
                  console.warn('Error al buscar todos los contactos, ', error);
              });
      } */



}
