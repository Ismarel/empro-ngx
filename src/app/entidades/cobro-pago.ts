import { IngresoEgreso } from './ingreso-egreso';
import { Caja } from './caja';
import { Cuenta } from './cuenta';
export class CobroPago {
    id: number;
    fechaCreacion: number;
    fecha: number;
    monto: any;
    tipoPago: number; // mandar  tipoPago->0 para banco,   tipoPago->1 para efectivo, tipoPago->2 para transferencia, tipoPago->3 para cheque  
    cuenta: Cuenta;
    ingresoEgreso: IngresoEgreso;
    caja: Caja;
    tipoPagoText: string;

}