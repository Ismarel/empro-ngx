import { Cuenta } from './cuenta';
import { Tarjeta } from './tarjeta';
import { Sucursal } from './sucursal';
export class Transferencia {
    id: number;
    tipo: boolean;
    monto: any;
    estatus: number;
    fechaCreacion: number;
    fechaModificacion: number;
    cuentaEmision: Cuenta;
    cuentaRecepcion: Cuenta;
    tarjetaEmision: Tarjeta;
    tarjetaRecepcion: Tarjeta;
    sucursal: Sucursal;
}