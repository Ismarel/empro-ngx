import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantesfiscalesComponent } from './comprobantesfiscales.component';

describe('ComprobantesfiscalesComponent', () => {
    let component: ComprobantesfiscalesComponent;
    let fixture: ComponentFixture<ComprobantesfiscalesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ComprobantesfiscalesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ComprobantesfiscalesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
