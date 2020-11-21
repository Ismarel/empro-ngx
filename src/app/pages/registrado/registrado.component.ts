import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-registrado',
    templateUrl: './registrado.component.html',
    styleUrls: ['./registrado.component.scss']
})
export class RegistradoComponent implements OnInit {
    public changeTable: number;
    public valor: number;
    public numerito: number;

    constructor() { }

    ngOnInit() {
        this.change(1);
    }

    change(valor) {
        if (valor == 1) {
            this.primero();
        }
        if (valor == 2) {
            this.segundo();
        }
        if (valor == 3) {
            this.tercero();
        }
        if (valor == 4) {
            this.cuarto();
        }
    }
    primero() {

    }
    segundo() {

    }
    tercero() {

    }
    cuarto() {

    }

}
