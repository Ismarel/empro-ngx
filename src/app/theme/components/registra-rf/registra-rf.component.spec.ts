import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraRFComponent } from './registra-rf.component';

describe('RegistraRFComponent', () => {
    let component: RegistraRFComponent;
    let fixture: ComponentFixture<RegistraRFComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistraRFComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistraRFComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
