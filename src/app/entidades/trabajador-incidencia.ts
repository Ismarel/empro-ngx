import { Concepto } from './concepto';
import { Trabajador } from './trabajador';
import { TipoIncidencia } from './tipo-incidencia';
import { NominaDeduccion } from './nomina-deduccion';
import { TipoIncapacidad } from './tipo-incapacidad';
import { NominaPercepcion } from './nomina-percepcion';

export class TrabajadorIncidencia {
    id: number;
    tipo: number; // 0 Percepcion, 1 Deduccion, 2 Incidencia
    trabajador: Trabajador;
    fechaModificacion: number;
    fechaCreacion: number;

    // Percepcion
    nominaPercepcion: NominaPercepcion;
    conceptoPercepcion: String;
    montoPercepcion: any;
    diasPercepcion: number;
    nNominasPercepcion: number;

    // Deduccion
    nominaDeduccion: NominaDeduccion;
    conceptoDeduccion: String;
    montoDeduccion: any;
    diasDeduccion: number;
    nNominasDeduccion: number;

    // Incidencia
    tipoIncidencia: TipoIncidencia;
    tipoIncapacidad: TipoIncapacidad;
    fechaInicio: number;
    fechaFin: number;
}
