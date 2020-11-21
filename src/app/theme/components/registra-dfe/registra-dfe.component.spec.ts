import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraDFEComponent } from './registra-dfe.component';

describe('RegistraDFEComponent', () => {
    let component: RegistraDFEComponent;
    let fixture: ComponentFixture<RegistraDFEComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistraDFEComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistraDFEComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
