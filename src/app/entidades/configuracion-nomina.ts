import { Empresa } from './empresa';
import { Sucursal } from './sucursal';
import { PeriodicidadPago } from './periodicidad-pago';
export class ConfiguracionNomina {
    id: number;
    periodicidad: PeriodicidadPago;//1->diario , 2-> semanal, 3-> quincenal, 4-> mensual
    //indica el dia que inicia a generarse las nominas, en el caso semanal se coloca la fecha completa(ej. 1529280000000), en los casos quincenales se guarda el primer dia de la quincena es decir 1 o 16 y en los casos mensuales se guarda solamente el numero 1 para indicar el primer dia de mes
    periodo: number;
    //se guardara el valor del index del mes (ej. 1->Enenro, 8->Agosto,12->Dic... )
    mes: number;
    fechaModificacion: number;
    fechaCreacion: number;
    empresa: Empresa;
    sucursal: Sucursal;
}
