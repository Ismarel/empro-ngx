
import { TipoDeduccion } from './tipo-deduccion';
import { Empresa } from './empresa';

export class NominaDeduccion {
    id: number;
    empresa: Empresa;
    deduccion: TipoDeduccion;
    nombre: string;
    fechaCreacion: string;
}