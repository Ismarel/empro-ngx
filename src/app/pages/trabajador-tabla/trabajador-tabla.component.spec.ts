import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorTablaComponent } from './trabajador-tabla.component';

describe('TrabajadorTablaComponent', () => {
    let component: TrabajadorTablaComponent;
    let fixture: ComponentFixture<TrabajadorTablaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrabajadorTablaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrabajadorTablaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
