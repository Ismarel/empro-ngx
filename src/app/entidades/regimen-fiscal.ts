import { Empresa } from './empresa';
import { TipoRegimen } from './tipo-regimen';
export class RegimenFiscal {
    id: number;
    tipoRegimen: TipoRegimen;
    fechaRegistro: number;
    fechaModificacion: number;
    empresa: Empresa;
    correo: boolean;//variable para saber si se envia correo , true -> envia correo de Bienvenida,false -> cualquier otro caso

}