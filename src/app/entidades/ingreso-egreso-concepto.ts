import { Concepto } from './concepto';
import { IngresoEgreso } from './ingreso-egreso';
export class IngresoEgresoConcepto {
    precioUnitario: any;
    importe: any;
    impuesto: any;// Mandar 0 ->IVA, 1 -> ISR y 2 -> IEPS
    cantidad: number;
    concepto: Concepto;
    ingresoEgreso: IngresoEgreso;
    fechaCreacion: number;
    fechaModificacion: number;
    impuestoText: string;
    claveIdentificacion: string;
    tasaCuota: any;
    existeConcepto: boolean;
    guardarConcepto: boolean;
    agregarInventario: boolean;

}