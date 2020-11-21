import { RiesgoPuesto } from './riesgo-puesto';
import { Certificado } from './certificado';
import { RegimenFiscal } from './regimen-fiscal';
import { Sucursal } from './sucursal';
export class Empresa {
    id: number;
    nombre: string;
    rfc: String;
    calle: String;
    numInterior: String;
    numExterior: String;
    colonia: String;
    localidad: String;
    referencia: String;
    municipio: String;
    estado: String;
    pais: String;
    lugarExpedicion: number;
    registroPatronal: String;
    cedulaIdentificacionFiscal: String;
    logo: String;
    fechaCreacion: number;
    fechaModificacion: number;
    riesgoPuesto: RiesgoPuesto;
    certificadoList: Array<Certificado>;
    regimenFiscalList: Array<RegimenFiscal>;
    sucursalList: Array<Sucursal>;
}