import { Empresa } from './empresa';
import { Unidad } from './unidad';
import { Producto } from './producto';
import { Sucursal } from './sucursal';
export class Concepto {
    id: number;
    nombre: String;
    estatus: number;
    inventario: number;
    unidad: Unidad;
    fechaRegistro: number;
    fechaModificacion: number;
    empresa: Empresa;
    producto: Producto;
    sucursal: Sucursal;
}
