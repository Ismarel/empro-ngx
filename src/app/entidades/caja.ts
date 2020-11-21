import { Empresa } from './empresa';
export class Caja {
    id: number;
    estatus: number;
    empresa: Empresa;
    fechaModificacion: number;
    fechaCreacion: number;
    fechaAlta: number;
    saldo: any;
    observaciones: string;
    nombre: string;
}