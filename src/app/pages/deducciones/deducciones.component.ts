import { Component, OnInit } from '@angular/core';
import { GlobalState } from '../../global.state';

@Component({
    selector: 'app-deducciones',
    templateUrl: './deducciones.component.html',
    styleUrls: ['./deducciones.component.scss']
})
export class DeduccionesComponent implements OnInit {

    public changeTable: string;
    public valorid: number;
    public isMenuCollapsed: boolean = false;

    constructor(private _state: GlobalState) {
        this.changeTable = '1';
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

    valor_dos(valor_id) {
        this.valorid = valor_id;
    }

}
