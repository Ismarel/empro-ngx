import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosComponent } from './ingresos.component';

describe('IngresosComponent', () => {
    let component: IngresosComponent;
    let fixture: ComponentFixture<IngresosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IngresosComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IngresosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
