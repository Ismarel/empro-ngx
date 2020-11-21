import { Empresa } from './empresa';
export class Folios {
    id: number;
    folioInicial: number;
    folioActual: number;
    estatus: boolean;
    serie: string;
    fechaRegistro: number;
    fechaModificacion: number;
    empresa: Empresa;
    folio_ind: String;
}