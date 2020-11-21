import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NominaConsultaComponent } from './nomina-consulta.component';

describe('NominaConsultaComponent', () => {
    let component: NominaConsultaComponent;
    let fixture: ComponentFixture<NominaConsultaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NominaConsultaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NominaConsultaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
