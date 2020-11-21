import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraCFDIComponent } from './registra-cfdi.component';

describe('RegistraCFDIComponent', () => {
    let component: RegistraCFDIComponent;
    let fixture: ComponentFixture<RegistraCFDIComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistraCFDIComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistraCFDIComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
