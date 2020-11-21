import { Cuenta } from './cuenta';
import { TipoTarjeta } from './tipo-tarjeta';
import { Sucursal } from './sucursal';
export class Tarjeta {
    id: number;
    nombre: String;
    numeroTarjeta: number;
    tipoTarjeta: TipoTarjeta;
    saldo: any;
    estatus: number;
    fechaAlta: number;
    fechaCreacion: number;
    fechaModificacion: number;
    cuenta: Cuenta;
    sucursal: Sucursal;

}