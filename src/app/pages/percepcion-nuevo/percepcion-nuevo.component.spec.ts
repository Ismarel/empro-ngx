import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercepcionNuevoComponent } from './percepcion-nuevo.component';

describe('PercepcionNuevoComponent', () => {
    let component: PercepcionNuevoComponent;
    let fixture: ComponentFixture<PercepcionNuevoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PercepcionNuevoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PercepcionNuevoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
