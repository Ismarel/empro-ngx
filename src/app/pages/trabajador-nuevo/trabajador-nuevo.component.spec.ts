import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorNuevoComponent } from './trabajador-nuevo.component';

describe('TrabajadorNuevoComponent', () => {
    let component: TrabajadorNuevoComponent;
    let fixture: ComponentFixture<TrabajadorNuevoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrabajadorNuevoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrabajadorNuevoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
