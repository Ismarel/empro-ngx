import { Empresa } from './empresa';
import { UsuarioSucursal } from './usuario-sucursal';
export class Usuario {
    id: number;
    nombre: string;
    apellidoPaterno: String;
    apellidoMaterno: String;
    correo: string;
    password: string;
    estatus: number;
    dashboard: boolean;
    empresas: boolean;
    bancos: boolean;
    facturas: boolean;
    nominas: boolean;
    ingresos: boolean;
    egresos: boolean;
    reportes: boolean;
    empresa: Empresa;
    fechaCreacion: number;
    fechaRegistro: number;

    fechaModificacion: number;
    nombreEmpresa: String;
    usuarioSucursalList: Array<UsuarioSucursal>;
    idsSucursalList: Array<Number>;
}
export class Recuperacion {
    email: string;
}