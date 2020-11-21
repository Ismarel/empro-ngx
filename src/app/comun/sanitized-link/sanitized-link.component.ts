import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import 'style-loader!./sanitized-link.scss';

@Component({
    selector: 'sanitized-link',
    templateUrl: './sanitized-link.html'
})
/**
 * Componente que regresa un link sanitizado si es valido, en caso contrario solo retorna el texto recibido
 */
export class SanitizedLinkComponent implements OnInit {
    @Input('url')
    url: string;

    @Input('styles')
    stylesObj: string = '';//https://scotch.io/tutorials/angular-2-classes-with-ngclass-and-ngstyle

    @Input('hide-invalid')
    hideInvalid: boolean = false;

    @Input('alias')
    alias: string = null;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
    }

    /**
     * Metodo para decirle a Angular que es 'segura la url'
     */
    sanitizeURL(url: string): any {
        if (!this.isValidUrl(url)) {
            return this.sanitizer.bypassSecurityTrustUrl('javascript:void(0)');
        }
        let res = url.match(/^http(s)?:\/\/.*/g);
        if (res == null) {
            url = 'http://' + url;//Si no inicia con http, se lo añadimos
        }
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    isValidUrl(url: string): boolean {
        let isValid: boolean = false;
        if (url) {
            let res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (res) {
                isValid = true;
            }
        }
        return isValid;
    }

}
