import { Chequera } from './chequera';
import { Sucursal } from './sucursal';
import { ClienteProveedor } from './cliente-proveedor';
export class Cheques {
    id: number;
    folio: number;
    monto: any;
    estatus: number;
    fechaCreacion: number;
    fechaModificacion: number;
    chequera: Chequera;
    beneficiario: ClienteProveedor;
}