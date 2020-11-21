import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GestioncuentasComponent } from './gestioncuentas.component';
import { CuentasModule } from '../cuentas.module';

describe('GestioncuentasComponent', () => {
    let component: GestioncuentasComponent;
    let fixture: ComponentFixture<GestioncuentasComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestioncuentasComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestioncuentasComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
