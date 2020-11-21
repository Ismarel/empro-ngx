import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NominaNuevaComponent } from './nomina-nueva.component';

describe('NominaNuevaComponent', () => {
    let component: NominaNuevaComponent;
    let fixture: ComponentFixture<NominaNuevaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NominaNuevaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NominaNuevaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
