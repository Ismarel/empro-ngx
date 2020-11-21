import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
    selector: 'pages',
    template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix container" style="position: fixed">
      <span class="left">© 2016, Derechos reservados EMPRO</span>
      <!--<span class="center">Desarrollado por <font color="green">Nordstern Technologies</font></span>-->
      <span class="right">Términos y condiciones | Aviso de privacidad</span>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `,
})
export class PagesComponent {

    constructor(private _menuService: BaMenuService, private router: Router) {
    }

    ngOnInit() {
        const token = localStorage.getItem('token');

        if (token) {
            // console.log('**** token:', token);
            this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        } else {
            // console.log('usuario no valido');
            this.router.navigate(['login']);
        }

    }
}
