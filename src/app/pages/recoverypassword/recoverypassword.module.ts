import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { RecoverypasswordComponent } from './recoverypassword.component';
import { routing } from './recoverypassword.routing';
import { RegisterComponent } from '../register/register.component';


@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
    ],
    declarations: [
        RecoverypasswordComponent,
        RegisterComponent,
    ],
})
export class RecoverypasswordModule { }
