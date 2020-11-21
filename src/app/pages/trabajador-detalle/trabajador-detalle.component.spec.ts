import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorDetalleComponent } from './trabajador-detalle.component';

describe('TrabajadorDetalleComponent', () => {
    let component: TrabajadorDetalleComponent;
    let fixture: ComponentFixture<TrabajadorDetalleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrabajadorDetalleComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrabajadorDetalleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
