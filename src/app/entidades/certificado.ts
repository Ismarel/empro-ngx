import { Empresa } from './empresa';
export class Certificado {
    id: number;
    archivoCertificado: string;
    numeroCertificado: String;
    validoDesde: number;
    validoHasta: number;
    archivoLlave: string;
    fechaRegistro: number;
    fechaModificacion: number;
    empresa: Empresa;
    password: String;
}