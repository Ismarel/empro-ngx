import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { UsuarioService } from 'app/servicios-backend/usuario.service';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private usuarioService: UsuarioService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> | boolean {
        return new Promise<boolean>((resolve, reject) => {
            this.usuarioService.roleAuth(route.data.path).then((data) => {
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