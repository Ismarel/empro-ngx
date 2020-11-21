import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionNuevoComponent } from './deduccion-nuevo.component';

describe('DeduccionNuevoComponent', () => {
    let component: DeduccionNuevoComponent;
    let fixture: ComponentFixture<DeduccionNuevoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeduccionNuevoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeduccionNuevoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
