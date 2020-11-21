import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from "@angular/router";
import { UsuarioService } from 'app/servicios-backend/usuario.service';
import { Injectable } from "@angular/core";
@Injectable()
export class Seguridad implements CanActivate, CanLoad {
    constructor(private usuarioService: UsuarioService, private router: Router) { }

    canLoad(r: Route): Promise<boolean> {
        return this.canActivate();
    }

    canActivate(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.usuarioService.authenticated().then((data) => {
                if (!data) {
                    resolve(false);
                }
                resolve(true);
            }).catch((error) => {
                this.router.navigate(['login']);
                resolve(false);
            });

        });
    }

}