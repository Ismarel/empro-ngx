import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { LoginComponent } from './login.component';
import { routing } from './login.routing';
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
        LoginComponent,
        RegisterComponent,
    ],
})
export class LoginModule { }
