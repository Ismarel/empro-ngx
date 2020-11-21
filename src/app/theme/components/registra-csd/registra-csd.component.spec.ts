import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraCSDComponent } from './registra-csd.component';

describe('RegistraCSDComponent', () => {
    let component: RegistraCSDComponent;
    let fixture: ComponentFixture<RegistraCSDComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistraCSDComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistraCSDComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
