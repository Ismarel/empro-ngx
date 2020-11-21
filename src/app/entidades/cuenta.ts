import { Empresa } from './empresa';
import { Banco } from './banco';
import { Sucursal } from './sucursal';
export class Cuenta {
    id: number;
    banco: Banco;
    estatus: number;
    empresa: Empresa;
    fechaModificacion: number;
    fechaCreacion: number;
    fechaAlta: number;
    numeroCuenta: number;
    saldo: any;
    observaciones: string;
    tipoBanco: number;
    sucursal: Sucursal;
    nombre: String;
}