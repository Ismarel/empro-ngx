import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../../../global.state';

@Component({
    selector: 'app-gestionchequeras',
    templateUrl: './gestionchequeras.component.html',
    styleUrls: ['./gestionchequeras.component.scss']
})

export class GestionchequerasComponent implements OnInit {

    public changeTable: boolean;
    public isMenuCollapsed: boolean = false;

    constructor(private _state: GlobalState) {
        this.changeTable = true;
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
    
    change(valor) {
        this.changeTable = valor;

    }
}