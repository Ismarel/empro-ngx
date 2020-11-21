import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoscuentaComponent } from './estadoscuenta.component';

describe('EstadoscuentaComponent', () => {
    let component: EstadoscuentaComponent;
    let fixture: ComponentFixture<EstadoscuentaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EstadoscuentaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EstadoscuentaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
