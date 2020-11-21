import { Injectable } from '@angular/core';

@Injectable()
export class ComprobanteidService {

    editarComprobante: string = '';

    constructor() { }

    public incrementValue(item) {
        //console.log('Contador aumentando', item);
        this.editarComprobante = item;
    }
}