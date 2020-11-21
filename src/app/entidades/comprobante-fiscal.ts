import { Empresa } from './empresa';
import { ClienteProveedor } from './cliente-proveedor';
import { Folios } from './folios';
import { UsoCfdi } from './uso-cfdi';
import { RegimenFiscal } from './regimen-fiscal';
import { Documento } from './documento';
import { FormasPago } from './formas-pago';
import { ComprobanteFiscalConcepto } from './comprobante-fiscal-concepto';
export class ComprobanteFiscal {
    id: number;
    moneda: number;// Mandar    0 -> MXN (pesos mexicanos)  1-> $ (Dólares)  y  2-> € (Euros)
    monedaText: String;
    observacion: String;
    descuento: any;
    motivoDescuento: String;
    subtotal: any;
    montoIva: any;
    total: any;
    condicionPago: String;
    numeroCuenta: String;
    tipoComprobante: number;  // Mandar    0 -> Ingreso  y  1 -> Egreso
    tipoComprobanteTetx: String;
    metodoPago: number; //Mandar   0 ->Pago en una sola exhibición  1-> Pago en parcialidades  y    2->Diferido
    metodoPagoText: String;
    fechaAlta: number;
    fechaCreacion: number;
    fechaModificacion: number;
    empresa: Empresa;
    serie: Folios;
    usoCfdi: UsoCfdi;
    regimen: RegimenFiscal;
    cliente: ClienteProveedor;
    documento: Documento;
    formaPago: FormasPago;
    cp: string;
    tipoImpuesto: number;// Mandar 0 ->IVA, 1 -> ISR y 2 -> IEPS
    tipoImpuestoText: string;
    tipoFactor: number; //Mandar 0 ->TASA y 1 -> CUOTA 2 ->Exento
    tipoFactorText: string;
    comprobanteFiscalConceptoList: Array<ComprobanteFiscalConcepto>;

    uuid: string;
    folio_ind: string;
    tipoCambio: string;


}