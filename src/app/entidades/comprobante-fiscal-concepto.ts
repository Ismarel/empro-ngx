import { Concepto } from './concepto';
import { ComprobanteFiscal } from './comprobante-fiscal';
export class ComprobanteFiscalConcepto {
    id: number;
    precioUnitario: any;
    importe: number;
    impuesto: number;// Mandar 0 ->IVA, 1 -> ISR y 2 -> IEPS
    cantidad: number;
    concepto: Concepto;
    comprobanteFiscal: ComprobanteFiscal;
    fechaCreacion: number;
    fechaModificacion: number;
    impuestoText: string;
    claveIdentificacion: string;
    descripcion: any;
    tasaCuota: number;
    descuento: number;
    ivaRetenido: number;
    isrRetenido: boolean;
    iepsRetenido: number;
    ieps: number;
    iva: boolean;
    ivaExcento: boolean;
}