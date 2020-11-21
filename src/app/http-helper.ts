import { Headers } from '@angular/http';
export class HttpHelper {
    /**
     * Comentar o descomentar segun el servidor a apuntar
     */

    /**localhost Desarrollo */
    // static url: string = "http://localhost:8080/empro-service/empro/";
    // static urlFILEREST: string = "http://localhost:8080/file-service/webresources/file";

    /**localhost pruebas */
    //static url: string = "http://192.168.0.202:8080/empro-service/empro/";
    //static urlFILEREST: string = "http://192.168.0.202:8080/empro-service/empro/files";

    /**localhost local */
    static url: string = "http://localhost:8080/empro-service/empro/";
    static urlFILEREST: string = "http://localhost:8080/empro-service/empro/files"

    /**produccion */
    //static url: string = "https://api.empro.mx/empro-service/empro/";
    //static urlFILEREST: string = "https://api.empro.mx/empro-service/empro/files";
    //"https://api.empro.mx/file-service";
    /* FILEService */  // Url servicio archivos produccion

    static headersJSON: Headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*' });
}
