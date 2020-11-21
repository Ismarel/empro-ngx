import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestiontarjetasComponent } from './gestiontarjetas.component';

describe('GestiontarjetasComponent', () => {
    let component: GestiontarjetasComponent;
    let fixture: ComponentFixture<GestiontarjetasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestiontarjetasComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestiontarjetasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
