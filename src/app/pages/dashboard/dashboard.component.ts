import { Component } from '@angular/core';
import { UsuarioService } from 'app/servicios-backend/usuario.service';
import { Router } from '@angular/router';
import { GlobalState } from '../../global.state';

@Component({
    selector: 'dashboard',
    styleUrls: ['./dashboard.scss'],
    templateUrl: './dashboard.html',
})
export class DashboardComponent {
    public isMenuCollapsed: boolean = false;

    constructor(private _state: GlobalState) {
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }

    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }
}
