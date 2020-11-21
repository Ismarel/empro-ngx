import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios-backend/usuario.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from 'app/theme/validators';
import { Usuario, Recuperacion } from 'app/entidades/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ActualizacionService } from 'app/comun/actualizacion.service';


@Component({
    selector: 'recoverypassword',
    templateUrl: './recoverypassword.html',
    styleUrls: ['./recoverypassword.scss'],
})
export class RecoverypasswordComponent {

    public formRec: FormGroup;
    public password: AbstractControl;
    public repeatPassword: AbstractControl;
    public passwords: FormGroup;

    submitted: boolean = false;
    isValid: boolean;
    usuarioService: UsuarioService;
    token: string;
    userId: number;

    public mensajeError: string;
    public msjError: String;
    private timeoutTracker;

    constructor(fb: FormBuilder, usuarioService: UsuarioService, private router: Router, private actualizacionService: ActualizacionService, private activatedRoute: ActivatedRoute) {
        this.formRec = fb.group({
            'passwords': fb.group({
                'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') }),
        });


        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.token = params.token;
            this.userId = params.userId;
        });



        this.passwords = <FormGroup>this.formRec.controls['passwords'];
        this.password = this.passwords.controls['password'];
        this.repeatPassword = this.passwords.controls['repeatPassword'];
        this.usuarioService = usuarioService;

    }

    restoredPassword() {
        let pass = this.password.value;
        let conpass = this.repeatPassword.value;
        if (pass == conpass) {
            let usuario: Usuario = new Usuario();
            usuario.password = pass;
            usuario.id = this.userId;
            this.usuarioService.changepass(usuario, this.token).then(resp => {
                console.log(resp);
                if (resp.error === undefined) {
                    console.log("cambio correcto");
                    var myWindow = window.open("https://app.empro.mx/#/login", "_self");
                    this.router.navigate(['#']);
                } else {
                    if (resp.error == "permisos") {
                        this.msjError = "Su link de restauración ha cadudado";
                    } else {
                        this.msjError = "Error al cambiar la contraseña.";
                    }
                }
            });

        } else {
            this.msjError = "La contraseñas no coinciden.";
            $('.alert').show();
        }

    }

    getURL() {
        var arr = window.location.href.split("/");
        delete arr[arr.length - 1];
        return arr.join("/");
    }

    closealert() {
        $('.alert').hide();
    }

}
