import { Empresa } from './empresa';
import { Banco } from './banco';
import { TipoComprobante } from './tipo-comprobante';
import { Cheques } from './cheques';
import { Cuenta } from './cuenta';
import { Concepto } from './concepto';
import { ClienteProveedor } from './cliente-proveedor';
import { CobroPago } from './cobro-pago';
import { Caja } from 'app/entidades/caja';
import { Trabajador } from './trabajador';
import { IngresoEgresoConcepto } from './ingreso-egreso-concepto';

export class IngresoEgreso {
    id: number;
    archivoPdf: String;
    archivoXml: String;
    fechaModificacion: number;
    fechaCreacion: number;
    fecha: number;
    tipo: boolean;//mantar tipo-> false para  ingreso y tipo ->true para egreso
    monto: any;
    subtotal: any;
    total: any;
    iva: any;
    estatus: number; //
    tipoPago: number; // mandar  tipoPago->0 para banco,   tipoPago->1 para efectivo, tipoPago->2 para transferencia, tipoPago->3 para cheque  
    tipoImpuesto: number;// mandar  tipoImpuesto->0 para IMSS,   tipoImpuesto->1 para SAT, tipoImpuesto->2 para tesoreria, tipoImpuesto->3 para INFONAVIT
    tipoComprobante: TipoComprobante;
    cuenta: Cuenta;
    banco: Banco;
    empresa: Empresa;
    cheque: Cheques;
    caja: Caja;
    conceptos: string;
    tipoPagoText: string;
    tipoImpuestoText: string;
    nombreCliente: String
    rfcCliente: String;
    ivaRetenido: any;
    isrRetenido: any;
    archivo: String;
    tipoEgreso: number; // 0->gasto general, 1->compra para inventario
    nombreProveedor: String;
    rfcProveedor: String;
    cliente: ClienteProveedor;
    proveedor: ClienteProveedor;
    cobroPagoList: Array<CobroPago>;
    trabajador: Trabajador;
    ingresoEgresoConceptoList: Array<IngresoEgresoConcepto>;


}