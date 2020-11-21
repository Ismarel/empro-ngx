import { Subject } from 'rxjs/Rx'

export class DropzoneAPI {

    constructor(id, url) {
        this.id = id;
        this.url = url;
        this.eventosDropzone = new Subject();
        this.self = this;
        this.initDropzone();
    }

    getEventoEmitter() {
        return this.eventosDropzone;
    }

    emitData(data) {
        console.log('Enviando :', data);
        this.eventosDropzone.next(data);
    }

    initDropzone() {
        console.log('initDropzone:', this.id);
        var this_ = this;
        Dropzone.autoDiscover = false;
        $("#" + this.id).dropzone({
            url: this.url,
            // autoProcessQueue: false,
            addRemoveLinks: true,
            success: function(file, response) {

                file.previewElement.classList.add("dz-success");
                this_.emitData(file.name);
            },

            error: function(file, response) {
                file.previewElement.classList.add("dz-error");
            },
            sending: function(file, xhr, formData) {
                console.log('sending');
                //var megas = file.size / unMBENBytes;
                formData.set("token", 'soytoken');
                formData.set("tipo", '3');//idProyecto  1->EMPRO
                formData.set("subtipo", '1');
                formData.set("id", '2');
                // formData.append("renameFile", validarNombre(file.name)); //Si no se llena -  no le cambia el nombre a la imagen,
                // formData.set("type-thumbnail", 0); //Si el type-thumbnail es 0 generará todos los tipos (mini, minix, med, medx, high) y el 1 solo mini_ y med_
            },
        });
    }



}
