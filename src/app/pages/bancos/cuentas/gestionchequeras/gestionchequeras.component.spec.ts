import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionchequerasComponent } from './gestionchequeras.component';

describe('GestionchequerasComponent', () => {
    let component: GestionchequerasComponent;
    let fixture: ComponentFixture<GestionchequerasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionchequerasComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionchequerasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
