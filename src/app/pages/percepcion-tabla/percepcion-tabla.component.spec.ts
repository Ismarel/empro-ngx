import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercepcionTablaComponent } from './percepcion-tabla.component';

describe('PercepcionTablaComponent', () => {
    let component: PercepcionTablaComponent;
    let fixture: ComponentFixture<PercepcionTablaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PercepcionTablaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PercepcionTablaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
