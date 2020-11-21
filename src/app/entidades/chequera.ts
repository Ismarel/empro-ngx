import { Cuenta } from './cuenta';
export class Chequera {
    id: number;
    folioInicial: number;
    folioFinal: number;
    folioActual: number;
    estatus: number;
    fechaCreacion: number;
    fechaModificacion: number;
    cuenta: Cuenta;

}