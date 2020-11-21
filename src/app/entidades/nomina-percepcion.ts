
import { TipoPercepcion } from './tipo-percepcion';
import { Empresa } from './empresa';

export class NominaPercepcion {
    id: number;
    empresa: Empresa;
    percepcion: TipoPercepcion;
    nombre: string;
    fechaCreacion: string;
}