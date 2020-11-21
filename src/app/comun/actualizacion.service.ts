import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Usuario } from 'app/entidades/usuario';

@Injectable()
export class ActualizacionService {
    usuarioCambios: Subject<Usuario> = new Subject();
    usuarioCambiosNombreEmitter: EventEmitter<string> = new EventEmitter();


}