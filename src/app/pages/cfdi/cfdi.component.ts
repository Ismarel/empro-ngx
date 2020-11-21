import { Component, OnInit, ViewChild } from '@angular/core';
import { AutocompleteGenericComponent } from '../../comun/components/autocomplete-generic';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PeriodicidadPago } from '../../entidades/periodicidad-pago';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { NominaService } from '../../servicios-backend/nomina.service';
import { Nomina } from '../../entidades/nomina';
import { GlobalState } from '../../global.state';

@Component({
    selector: 'app-cfdi',
    templateUrl: './cfdi.component.html',
    styleUrls: ['./cfdi.component.scss']
})

export class CfdiComponent implements OnInit {


    public changeOption: number;
    public isMenuCollapsed: boolean = false;

    constructor(private _state: GlobalState, private _fb: FormBuilder) {
    }

    ngOnInit() {
        if(window.innerWidth < 1200){
            this.toggleMenu();
        }
        this.changeOption = 1;
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }
    
    change(valor) {
        this.changeOption = valor;
    }
}