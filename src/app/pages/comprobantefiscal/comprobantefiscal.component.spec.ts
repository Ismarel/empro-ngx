import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantefiscalComponent } from './comprobantefiscal.component';

describe('ComprobantefiscalComponent', () => {
    let component: ComprobantefiscalComponent;
    let fixture: ComponentFixture<ComprobantefiscalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComprobantefiscalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComprobantefiscalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
