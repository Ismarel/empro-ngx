import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequerasComponent } from './chequeras.component';

describe('ChequerasComponent', () => {
    let component: ChequerasComponent;
    let fixture: ComponentFixture<ChequerasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChequerasComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChequerasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
