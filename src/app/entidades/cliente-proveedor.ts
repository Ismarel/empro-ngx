import { Empresa } from './empresa';
import { Sucursal } from './sucursal';
export class ClienteProveedor {
    id: number;
    nombre: string;
    correo: string;
    rfc: string;
    estatus: number;
    mails: string;//Nota: este variable solo es para los clientes
    comentarios: string;//Nota: este variable solo es para los clientes
    tipo: number; //mandar 1 para clientes y 2 para proveedores 
    tipoCliente: number;// mandar 1 nacional y 2 internacional Nota: este variable solo es para los clientes
    sucursal: Sucursal;
    empresa: Empresa;
    fechaCreacion: number;
    fechaModificacion: number;
    cp: String;
    calle: String;
    numeroInterior: String;
    numeroExterior: String;
    colonia: String;
    localidad: String;
    municipio: String;
    estado: String;
    pais: string;
}