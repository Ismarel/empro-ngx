import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'app/servicios-backend/usuario.service';
import { Usuario } from 'app/entidades/usuario';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EqualPasswordsValidator } from 'app/theme/validators';
import { Empresa } from 'app/entidades/empresa';
import { CertificadoService } from '../../servicios-backend/certificado.service';
import { Http } from '@angular/http';



@Component({
    selector: 'perfil',
    templateUrl: './perfil.html',
    styleUrls: ['./perfil.scss'],
    providers: [DatePipe],
})
export class PerfilComponent implements OnInit {
    public form: FormGroup;
    public password: AbstractControl;
    public repeatPassword: AbstractControl;
    public passwords: FormGroup;
    public submitted: boolean = false;
    public mensajeError: string;
    usuario: Usuario = new Usuario;
    formularioUsuario: FormGroup;
    FormControl: any;
    imgProfile: File;
    emailProfile = "";
    url = '';
    constructor(private certificadoService: CertificadoService, private usuarioService: UsuarioService, private datePipe: DatePipe, fb: FormBuilder, private http: Http) {
        this.form = fb.group({
            'passwords': fb.group({
                'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
                'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') }),
        });
        this.certificadoService = certificadoService;
        this.passwords = <FormGroup>this.form.controls['passwords'];
        this.password = this.passwords.controls['password'];
        this.repeatPassword = this.passwords.controls['repeatPassword'];
    }

    ngOnInit() {
        this.checkImgServer();
        this.getUsuarioSession();
        this.initFormularioUsuario();
        //console.log("tengo datos");
    }

    checkImgServer() {
        const urlImage = this.usuarioService.urlImageServer();
        this.http.get(urlImage).subscribe((data) => {
            if (data.status == 200) {
                if (data.statusText == "OK") {
                    this.url = urlImage;
                }
            }
        });
    }

    onFileUpload(event: any) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;
        this.imgProfile = files[0];

        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.uploadImgProfile();
    }

    uploadImgProfile() {
        var formImg = new FormData();
        formImg.append("token", localStorage.getItem("token"));
        formImg.append("tipo", "imgperfil");
        formImg.append("subtipo", "4");
        formImg.append("email", this.emailProfile);
        formImg.append("file", this.imgProfile, this.imgProfile.name);

        this.certificadoService.upload(formImg).then((data) => {
            if (data.type == 1 && data.bytesLoaded && data.totalBytes) {
                console.log(data.bytesLoaded);
            } else if (data.ok) {
                console.log("Data Uploaded");
            }
        }).catch((y) => {
            console.log("Error ocurrido: ", y)
        });
    }

    getUsuarioSession() {
        this.usuarioService.getDetalleUsuarioSesion().then((data: any) => {
            //console.log("Datos.....",data);
            this.usuario = data;
            this.fillDataFormulario(this.usuario);
        }).catch((error) => {

        });
    }

    initFormularioUsuario() {
        this.formularioUsuario = new FormGroup({
            nombre: new FormControl(),
            correo: new FormControl(),
            apellidoPaterno: new FormControl(),
            apellidoMaterno: new FormControl(),
            contraseniaanterior: new FormControl(),
        });
    }
    fillDataFormulario(usuario: Usuario) {
        // let dateNow : Date = new Date();
        // let dateNowISO = dateNow.toISOString();
        // let dateNowMilliseconds = dateNow.getTime();
        // console.log("TENGO FECHA ", dateNow);
        this.formularioUsuario.get('nombre').setValue(usuario.nombre);
        this.formularioUsuario.get('apellidoPaterno').setValue(usuario.apellidoPaterno);
        this.formularioUsuario.get('apellidoMaterno').setValue(usuario.apellidoMaterno);
        this.formularioUsuario.get('correo').setValue(usuario.correo);
        this.emailProfile = usuario.correo;

    }
    onSubmit() {
        this.mensajeError = undefined;
        this.submitted = true;
        if (this.form.valid) {
            let agregar_usuario: Usuario = new Usuario();
            agregar_usuario.empresa = new Empresa();
            //Acá se toma el formControl password para su almacenamiento en el metodo update o el que vayas a usar.
            agregar_usuario.password = this.form.get('passwords.password').value;
        }
    }

    onSubmitUsuarios() {
        // console.log("ENTRO AQUI CUANDO DAS LIKE", this.formularioUsuario.get('contraseniaanterior').value);
        // console.log("TENGO DATOS",this.usuario);
        let editar_usuario: Usuario = new Usuario();
        // this.formularioUsuario.get('contraseniaanterior').value;
        let password = this.formularioUsuario.get('contraseniaanterior').value;
        var truePassword = password.replace(/(^\s+|\s+$)/g, "");
        editar_usuario.password = truePassword;//this.formularioUsuario.get('contraseniaanterior').value;
        editar_usuario.correo = this.usuario.correo;
        this.usuarioService.getLogin(editar_usuario).then((data) => {
            // console.log("Entro aqui ", data);
            //$('#alertaPassword').show();
            this.updateUsuario(data);
        }).catch((error) => {
            // error = error;
            // $('#alertaPassword').show();
            console.log("Error ", error);
            // this.updateUsuario(error);
        });
    }

    updateUsuario(valor) {
        if (valor.id) {
            let password = this.form.get('passwords.password').value;
            let truePassword = password.replace(/(^\s+|\s+$)/g, "");
            let nuevopass: Usuario = new Usuario();
            nuevopass.password = truePassword;//this.form.get('passwords.password').value;
            nuevopass.nombre = this.usuario.nombre;
            nuevopass.correo = this.usuario.correo;
            nuevopass.estatus = this.usuario.estatus;
            nuevopass.dashboard = this.usuario.dashboard;
            nuevopass.empresas = this.usuario.empresas;
            nuevopass.bancos = this.usuario.bancos;
            nuevopass.facturas = this.usuario.facturas;
            nuevopass.nominas = this.usuario.nominas;
            nuevopass.ingresos = this.usuario.ingresos;
            nuevopass.egresos = this.usuario.egresos;
            nuevopass.reportes = this.usuario.reportes;
            nuevopass.apellidoPaterno = this.usuario.apellidoPaterno;
            nuevopass.apellidoMaterno = this.usuario.apellidoMaterno;
            nuevopass.id = this.usuario.id;

            this.usuarioService.update(nuevopass).then((dato) => {
                $('#confirmacion').show();
                $('#alertaPassword').hide();
                this.formularioUsuario.get('contraseniaanterior').reset();
                this.form.reset();
            }).catch((error) => {
                console.log("ERROR: ", error);
            });

        } else {
            $('#alertaPassword').show();
            this.formularioUsuario.get('contraseniaanterior').reset();

        }

    }
}

