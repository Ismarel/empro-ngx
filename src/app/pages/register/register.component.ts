import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator } from '../../theme/validators';
import { Router } from '@angular/router';
import { UsuarioService } from 'app/servicios-backend/usuario.service';
import { Usuario } from 'app/entidades/usuario';
import { Empresa } from 'app/entidades/empresa';
import { MailService } from '../../servicios-backend/mail.service';
import { ActualizacionService } from 'app/comun/actualizacion.service';

@Component({
    selector: 'register',
    templateUrl: './register.html',
    styleUrls: ['./register.scss']
})
export class RegisterComponent {

    public handleError;
    public form: FormGroup;
    public name: AbstractControl;
    public email: AbstractControl;
    public password: AbstractControl;
    public repeatPassword: AbstractControl;
    public passwords: FormGroup;
    public empresa: AbstractControl;
    public rfc: AbstractControl;
    public submitted: boolean = false;
    public barLabel: string = "Password strength:";
    public mensajeError: string;
    public rfcValidator: Boolean;

    constructor(fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private mailService: MailService, private actualizacionService: ActualizacionService) {

        this.form = fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
            'rfc': ['', Validators.compose([Validators.required])],
            'passwords': fb.group({
                'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') }),
            'empresa': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        });

        this.name = this.form.controls['name'];
        this.email = this.form.controls['email'];
        this.passwords = <FormGroup>this.form.controls['passwords'];
        this.password = this.passwords.controls['password'];
        this.repeatPassword = this.passwords.controls['repeatPassword'];
        this.empresa = this.form.controls['empresa'];
        this.rfc = this.form.controls['rfc'];

    }

    public onSubmit(values: Object): void {
        this.mensajeError = undefined;
        this.submitted = true;
        if (this.form.valid) {
            let agregar_usuario: Usuario = new Usuario();
            agregar_usuario.empresa = new Empresa();
            agregar_usuario.nombre = this.form.get('name').value;
            agregar_usuario.correo = this.form.get('email').value;
            agregar_usuario.password = this.form.get('passwords.password').value;
            agregar_usuario.nombreEmpresa = this.form.get('empresa').value;
            agregar_usuario.empresa.nombre = this.form.get('empresa').value;
            agregar_usuario.empresa.rfc = this.form.get('rfc').value;
            agregar_usuario.estatus = 1;
            agregar_usuario.dashboard = true;
            agregar_usuario.empresas = true;
            agregar_usuario.bancos = true;
            agregar_usuario.facturas = true;
            agregar_usuario.nominas = true;
            agregar_usuario.ingresos = true;
            agregar_usuario.egresos = true;
            agregar_usuario.reportes = true;
            // console.log("Usuario: " + agregar_usuario);
            // this.usuarioService.registrate(agregar_usuario).then((data) => {
            //   $("#registroModal").modal("hide");
            // }).catch((error) => {
            //   alert(error);
            //   console.log(error);
            // });
            this.sendMail(agregar_usuario.correo);
            if (this.rfcValidator == true) {
                this.usuarioService.registrate(agregar_usuario).subscribe(
                    (data) => {
                        $("#registroModal").modal("hide");
                        console.log(data);
                        // this.sendMail(agregar_usuario.correo);
                        this.login();
                    },
                    (error) => {
                        if (error && error.json() && error.json().error) {
                            this.mensajeError = error.json().error;
                            //Show error messaje user
                        }
                        console.log(agregar_usuario);

                    },
                    () => {
                        console.log('finally');
                    }
                );

            } else {
                this.mensajeError = "El rfc ingresado no es valido";
            }

        }
    }

    onAbrirModal() {
        this.form.reset();
        this.mensajeError = null;
    }

    ngOnInit() {
        this.usuarioService.authenticated().then((data) => {
            // console.log('DATOS ' + data);
            if (!data) {
                this.router.navigate(['login']);
            }

        }).catch((error) => {
            console.log(error);

        });
    }

    rfcValido(rfc, aceptarGenerico = true) {
        const re = (/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/);
        var validado = rfc.match(re);

        if (!validado)  //Coincide con el formato general del regex?
            return false;

        //Separar el dígito verificador del resto del RFC
        const digitoVerificador = validado.pop(),
            rfcSinDigito = validado.slice(1).join(''),
            len = rfcSinDigito.length,

            //Obtener el digito esperado
            diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
            indice = len + 1;
        var suma,
            digitoEsperado;

        if (len == 12) suma = 0
        else suma = 481; //Ajuste para persona moral

        for (var i = 0; i < len; i++)
            suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
        digitoEsperado = 11 - suma % 11;
        if (digitoEsperado == 11) digitoEsperado = 0;
        else if (digitoEsperado == 10) digitoEsperado = "A";

        //El dígito verificador coincide con el esperado?
        // o es un RFC Genérico (ventas a público general)?
        if ((digitoVerificador != digitoEsperado)
            && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
            return false;
        else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
            return false;
        return rfcSinDigito + digitoVerificador;
    }

    onKey(event) {
        const inputValue = event.target.value;
        var rfc = inputValue, resultado = document.getElementById("inputRfc3");

        var rfcCorrecto = this.rfcValido(rfc);   // ⬅️ Acá se comprueba
        if (rfcCorrecto) {
            this.rfcValidator = true
        } else {
            this.rfcValidator = false
        }
    }

    login() {
        let usuario: Usuario = new Usuario();
        usuario.correo = this.form.get('email').value;
        usuario.password = this.form.get('passwords.password').value;
        this.usuarioService.getLogin(usuario)
            .then((data: any) => {
                if (data.error != null) {
                    console.log("ERROR LOGIN: ", data.error);
                }
                else {
                    setTimeout(() => {
                        this.actualizacionService.usuarioCambios.next(data);
                    }, 500);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('nombreUsuario', data.nombre);
                    $('html').attr('style', '');
                    this.router.navigate(['dashboard']);
                }
            })
            .catch((error) => {

            });
    }

    //metodo para enviar mail al concluir el registro de ususario
    sendMail(mailUser: string) {
        this.mailService.sendMailRegistro(mailUser).then((response) => {
            console.log(response);

        });
    }
}
