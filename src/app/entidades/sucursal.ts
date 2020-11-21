import { Empresa } from './empresa';
import { Usuario } from './usuario';
export class Sucursal {
    id: number;
    nombre: string;
    empresa: Empresa;
    fechaCreacion: number;
    fechaModificacion: number;
    responsable: Usuario;
    calle: String;
    cp: String;
    numeroInterior: String;
    numeroExterior: String;
    colonia: String;
    localidad: String;
    municipio: String;
    estado: String;
    pais: String;
}