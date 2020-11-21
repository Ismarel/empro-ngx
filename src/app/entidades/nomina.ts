import { Trabajador } from './trabajador';
import { ConfiguracionNomina } from './configuracion-nomina';
export class Nomina {
    id: number;
    archivoPdf: String;
    archivoXml: String;
    fechaModificacion: number;
    fechaCreacion: number;
    estatus: number; //2 Timbrada, 1 espera de timbrado , 0 no trimbrada
    trabajador: Trabajador;
    configuracion: ConfiguracionNomina;
}