import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios-backend/usuario.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Usuario, Recuperacion } from 'app/entidades/usuario';
import { Router, Params } from '@angular/router';
import { ActualizacionService } from 'app/comun/actualizacion.service';
@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
})

export class LoginComponent {

    form: FormGroup;
    formRec: FormGroup;
    emailRec: AbstractControl;
    email: AbstractControl;
    password: AbstractControl;
    submitted: boolean = false;
    isValid: boolean;
    usuarioService: UsuarioService;

    public mensajeError: string;
    public msjError: String;

    constructor(fb: FormBuilder, usuarioService: UsuarioService, private router: Router, private actualizacionService: ActualizacionService) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });

        this.formRec = fb.group({
            'emailRec': [''],
        })
        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
        this.emailRec = this.formRec.controls['emailRec'];
        this.usuarioService = usuarioService;
        $(document).ready(
            function() {
                $('.toggletab').click(function() {
                    $(this).removeClass('active');
                });
            });
    }

    onAbrirModal() {
        this.form.reset();
        this.mensajeError = null;
    }

    onSubmit(values: Object): void {
        if (this.form.valid) {
            this.submitted = true;
            let usuario: Usuario = new Usuario();
            usuario.correo = this.form.get('email').value;
            usuario.password = this.password.value;
            // console.log(usuario);
            this.usuarioService.getLogin(usuario)
                .then((data: any) => {
                    if (data.error != null) {
                        this.mensajeError = data.error;
                        // console.log(data.error);
                    }
                    else {
                        //console.log("USUARIO....",data);
                        setTimeout(() => {
                            this.actualizacionService.usuarioCambios.next(data);
                        }, 500);
                        // this.actualizacionService.nombreUsuario = data.nombre;

                        localStorage.setItem('token', data.token);
                        localStorage.setItem('nombreUsuario', data.nombre);
                        $("#myModal").modal("hide");
                        $('html').attr('style', '');
                        this.router.navigate(['dashboard']);
                    }
                })
                .catch((error) => {

                });
        }
    }

    ngOnInit() {
        this.usuarioService.authenticated()
            .then((data) => {
                //console.log('DATOS------------' + data);
                if (!data) {
                    this.router.navigate(['login']);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        // document.children[0].style = "overflow:hidden;";
        $('html').attr('style', 'overflow:hidden');
    }

    restoredPassword() {
        let recuperar: Recuperacion = new Recuperacion();
        recuperar.email = this.formRec.get('emailRec').value;
        this.usuarioService.recoverPassword(recuperar).then((data: any) => {
            console.log("YA SALIO Y DATA ES: ", data);
            $('#emailRecuperacion').val('');
            if (data.ok != undefined) {
                console.log(data.ok);
                $('#myModal').modal('toggle');
                $('#modal-tab-recovery').removeClass('active');
                $('#modal-tab-login').addClass('active');
                //emailRecuperacion
            } else {
                this.msjError = "Algo salio mal";
            }

        })
            .catch((error) => {
                $('#emailRecuperacion').val('');
                console.log("ALGO SALIO MAL: ", error)
                this.msjError = "Algo salio mal";
            })
    }
}
