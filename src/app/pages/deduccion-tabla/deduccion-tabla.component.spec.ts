import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionTablaComponent } from './deduccion-tabla.component';

describe('DeduccionTablaComponent', () => {
    let component: DeduccionTablaComponent;
    let fixture: ComponentFixture<DeduccionTablaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeduccionTablaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeduccionTablaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
