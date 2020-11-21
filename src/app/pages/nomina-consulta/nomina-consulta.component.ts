import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input } from '@angular/core';
import { AutocompleteGenericComponent } from '../../comun/components/autocomplete-generic';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PeriodicidadPago } from '../../entidades/periodicidad-pago';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { NominaService } from '../../servicios-backend/nomina.service';
import { Nomina } from '../../entidades/nomina';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-nomina-consulta',
    templateUrl: './nomina-consulta.component.html',
    styleUrls: ['./nomina-consulta.component.scss'],
    providers: [NgbDatepickerConfig],
})
export class NominaConsultaComponent implements OnInit {

    public myGroupConsultaNomina: FormGroup;
    public formularioFilterQuery: FormGroup;
    public delayBeforeSearch: number = 400; // Delay in miliseconds
    public querySubscription$: Subscription;
    public query: string = '';
    public rowsOnPage: number = 10;
    public sortBy: string;
    public sortOrder: string = 'asc';
    public page: number = 1;
    public estatus: number;
    public periodicidad: PeriodicidadPago;
    public anio: number;
    public mesInicio: number;
    public mesFin: number;
    public idTrabajador: number;
    public totalNominas: number = 0;
    public data: Nomina[];
    public dataH: Nomina[];
    public valor: string;
    //Checar y cambiar variable tablita en HTML
    public tablita: number = 0;
    //Checar y cambiar variable iscosa en HTML
    public iscosa: number = 1;
    //Checar y cambiar variable mensajeError en HTML
    public mensajeError: string = "Error error";
    public showHideNomTimbradas = 0;
    public periodo = "cosa"
    public anioBusca;
    public mesBuscaIni;
    public mesBuscaFin;
    public trabajadorBusca;
    public periodicidadBusca;
    public dataNomina: any;
    public semanaNomina: any;
    public quincenaNomina: any;
    public mesNomina: any;
    public nominaSeleccionada: any;
    public trabaNombre: string;
    public incidencias = [];
    public deducciones = [];
    public percepciones = [];
    @ViewChild('autocompleteTrabajador') autocompleteTrabajador: AutocompleteGenericComponent;

    constructor(private fb: FormBuilder, private nominaService: NominaService) {
        this.nominaService = nominaService;
    }

    initmyGroupConsultaNomina() {
        this.myGroupConsultaNomina = new FormGroup({
            anioBusqueda: new FormControl(),
            mesBusquedaIni: new FormControl(),
            mesBusquedaFin: new FormControl(),
            trabajador: new FormControl(),
            periodicidadBusqueda: new FormControl()
        });
    }

    ngOnInit() {
        this.initFormQuery();
        this.initmyGroupConsultaNomina();
        this.valor = "Cosa";
        document.getElementById('cardNomTimbradas').style.display = 'none';
        this.addRequiredValidator('anioBusqueda', this.myGroupConsultaNomina);
        this.addRequiredValidator('mesBusquedaIni', this.myGroupConsultaNomina);
        this.addRequiredValidator('mesBusquedaFin', this.myGroupConsultaNomina);
        this.addRequiredValidator('periodicidadBusqueda', this.myGroupConsultaNomina);
        /*this.nominaService.getLastCfdis().then((response) => {
            console.log(response);
            this.dataNomina = [];
            for (let i in response.data)
                this.dataNomina = this.dataNomina.concat(response.data[i]);
            console.log(this.dataNomina);
        }).catch((error) => {
            console.log(error);
        });*/
        this.ultimasNominas();
    }

    onShowHideNomTimbradas() {
        if (this.showHideNomTimbradas == 0) {
            console.log("Abre pestaña: ", this.showHideNomTimbradas);
            this.showHideNomTimbradas = 1;
            document.getElementById('cardNomTimbradas').style.display = 'block';
            document.getElementById("faChevronShow").classList.remove("fa-chevron-circle-down");
            document.getElementById("faChevronShow").classList.add("fa-chevron-circle-up");

        }
        else {
            console.log("Cierra pestaña: ", this.showHideNomTimbradas);
            this.showHideNomTimbradas = 0;
            document.getElementById('cardNomTimbradas').style.display = 'none';
            document.getElementById("faChevronShow").classList.remove("fa-chevron-circle-up");
            document.getElementById("faChevronShow").classList.add("fa-chevron-circle-down");
        }
    }

    onSelectedTrabajador(trabajador: any) {
        if (trabajador !== undefined && trabajador != null && trabajador > 0) {
            this.myGroupConsultaNomina.get('trabajador').setValue(trabajador);

        }
        else {
            this.myGroupConsultaNomina.get('trabajador').setValue(0);
        }
    }

    initFormQuery() {
        this.formularioFilterQuery = this.fb.group({
            'query': ['',
                [Validators.minLength(1)]
            ]
        });

        let query$: Observable<any> = this.formularioFilterQuery
            .valueChanges.debounceTime(this.delayBeforeSearch);
        this.querySubscription$ = query$.subscribe(
            (data) => {
                this.query = data.query;
                this.buscar();
            });
    }

    ultimasNominas(){
        console.log("Traerme las nominas de los 3 ultimos meses");
        let today = new Date;
        let mesF = today.getMonth() + 1;
        let mesI = today.getMonth() - 1;
        let año = today.getFullYear();

        this.estatus = 1;
        this.anio = año;
        this.mesInicio = mesI;
        this.mesFin = mesF;
        this.idTrabajador = -1;
        
        this.nominaService.getCfdis(1, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.anio, this.mesInicio, this.mesFin, this.idTrabajador).subscribe(
            (dataxyz) => {
                console.log("ULTIMAS NOMINAS: ", dataxyz);
                this.totalNominas = dataxyz.total;
                this.data = dataxyz.data;
                if (this.totalNominas > 0)
                    this.dataNomina = [dataxyz.data[0]];
                else
                    this.dataNomina = []
            }, (errorxyz) => {
                //console.log('error', errorxyz);
            }
        );
        
        
        this.nominaService.getCfdis(2, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.anio, this.mesInicio, this.mesFin, this.idTrabajador).subscribe(
            (dataxyz) => {
                console.log("ULTIMAS NOMINAS: ", dataxyz);
                this.totalNominas = dataxyz.total;
                this.data = dataxyz.data;
                if (this.totalNominas > 0)
                    this.semanaNomina = [dataxyz.data[0]];
                else
                    this.semanaNomina = []
            }, (errorxyz) => {
                //console.log('error', errorxyz);
            }
        );
        
        
        this.nominaService.getCfdis(3, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.anio, this.mesInicio, this.mesFin, this.idTrabajador).subscribe(
            (dataxyz) => {
                console.log("ULTIMAS NOMINAS: ", dataxyz);
                this.totalNominas = dataxyz.total;
                this.data = dataxyz.data;
                if (this.totalNominas > 0)
                    this.quincenaNomina = [dataxyz.data[0]];
                else
                    this.quincenaNomina = []
            }, (errorxyz) => {
                //console.log('error', errorxyz);
            }
        );
        
        this.nominaService.getCfdis(4, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.anio, this.mesInicio, this.mesFin, this.idTrabajador).subscribe(
            (dataxyz) => {
                console.log("ULTIMAS NOMINAS: ", dataxyz);
                this.totalNominas = dataxyz.total;
                this.data = dataxyz.data;
                if (this.totalNominas > 0)
                    this.mesNomina = [dataxyz.data[0]];
                else
                    this.mesNomina = []
            }, (errorxyz) => {
                //console.log('error', errorxyz);
            }
        );

    }

    buscar() {
        console.log("QUE ESTA PASANDO");
        this.estatus = 1;
        this.anio = this.anioBusca;
        this.mesInicio = this.mesBuscaIni;
        this.mesFin = this.mesBuscaFin;
        if (this.trabajadorBusca != null && this.trabajadorBusca > 0)
            this.idTrabajador = this.trabajadorBusca;
        else
            this.idTrabajador = -1;
        console.log("Query: ", this.query);
        console.log("Sort By: ", this.sortBy);
        console.log("Sort Order: ", this.sortOrder);
        console.log("Rows on Page: ", this.rowsOnPage);
        console.log("Page: ", this.page);
        console.log("Estatus: ", this.estatus);
        console.log("Periodicidad: ", this.periodicidadBusca);
        console.log("Anio", this.anio);
        console.log("Fecha Inicio: ", this.mesInicio);
        console.log("Fecha Fin", this.mesFin);
        console.log("ID Trabajador", this.idTrabajador);
        this.nominaService.getCfdis(this.periodicidadBusca, this.query, this.sortBy, this.sortOrder, this.rowsOnPage, this.page, this.anio, this.mesInicio, this.mesFin, this.idTrabajador).subscribe(
            (dataxyz) => {
                console.log("Cosas: ", dataxyz);
                this.totalNominas = dataxyz.total;
                this.data = dataxyz.data;
                if (this.totalNominas > 0)
                    this.dataH = [dataxyz.data[0]];
                else
                    this.dataH = []
            }, (errorxyz) => {
                //console.log('error', errorxyz);
            }
        );
    }

    onClick_elim(item: any) {

    }

    onChangeSize() {
        this.page = 1;
        this.buscar();
    }

    onSort(event: { order: string, by: string }) {
        this.sortBy = event.by;
        this.sortOrder = event.order;
        this.buscar();
    }

    pageChanged(event: any) {
        this.page = event;
        this.buscar();
    }

    onSearchConsultaNomina() {
        console.log(this.myGroupConsultaNomina);

        this.anioBusca = this.myGroupConsultaNomina.get("anioBusqueda").value;
        this.mesBuscaIni = this.myGroupConsultaNomina.get("mesBusquedaIni").value;
        this.mesBuscaFin = this.myGroupConsultaNomina.get("mesBusquedaFin").value;
        this.trabajadorBusca = this.myGroupConsultaNomina.get("trabajador").value;
        this.periodicidadBusca = this.myGroupConsultaNomina.get("periodicidadBusqueda").value;
        console.log("Año de busqueda: ", this.anioBusca);
        console.log("Mes inicial de busqueda: ", this.mesBuscaIni);
        console.log("Mes final de busqueda: ", this.mesBuscaFin);
        console.log("Trabajador de busqueda: ", this.trabajadorBusca);
        this.buscar();
        this.tablita = 1;
    }

    onTablaFilter(item: any) {
        this.tablita = 2;
        this.nominaSeleccionada = item;
        this.buscar();
    }

    onTablaFilterLast(item: any) {
        this.tablita = 3;
        this.nominaSeleccionada = item;
        this.anioBusca = item.fechaInicioPeriodoFormato.substr(0, 4);
        this.mesBuscaIni = item.fechaInicioPeriodoFormato.substr(5, 2);
        this.mesBuscaFin = item.fechaFinPeriodoFormato.substr(5, 2);
        this.trabajadorBusca = -1;
        this.periodicidadBusca = item.periodicidad.id;
        console.log("Periodicidad: ", this.periodicidadBusca);
        console.log("Año de busqueda: ", this.anioBusca);
        console.log("Mes inicial de busqueda: ", this.mesBuscaIni);
        console.log("Mes final de busqueda: ", this.mesBuscaFin);
        console.log("Trabajador de busqueda: ", this.trabajadorBusca);
        this.buscar();
    }

    onDescargaSearch(item: any) {
        console.log(item);
        this.nominaService.descargarXML(item.id);
    }

    prepareIncidencia(item: any) {
        this.trabaNombre = item.nombre;

        this.incidencias = [];
        this.percepciones = [];
        this.deducciones = [];
        console.log(item.trabajadorIncidenciaList);
        item.trabajadorIncidenciaList.forEach((e, i) => {
            if (e.tipoIncidencia.id !== undefined) {
                console.log(i + ': [' + e.id + '] Incidencia');
                // this.addNewRow(e);
                this.incidencias.push(e);
            }
            else if (e.nominaPercepcion.id !== undefined) {
                console.log(i + ': [' + e.id + '] Percepcion');
                // this.addNewRowPer(e);
                this.percepciones.push(e);
            }
            else if (e.nominaDeduccion.id !== undefined) {
                console.log(i + ': [' + e.id + '] Deduccion');
                // this.addNewRowDed(e);
                this.deducciones.push(e);
            }
            else
                console.log(i + ': [' + e.id + '] Error');
        });

        console.log(this.incidencias);
        console.log(this.percepciones);
        console.log(this.deducciones);
    }

    // Remueve las validaciones para el campo recibido el formulario,formularioIngresoEgreso 
    removeValidators(campo: string, form: FormGroup) {
        form.controls[campo].clearValidators();
        form.controls[campo].updateValueAndValidity();
    }

    // Agrega campo requerido 
    addRequiredValidator(campo: string, form: FormGroup) {
        form.controls[campo].setValidators(Validators.required);
        form.controls[campo].updateValueAndValidity();
    }

    generateCSV() {
        this.nominaService.getNominaCSV(this.nominaSeleccionada.configuracion.id);
    }

    cancelarNomina() {
        this.nominaService.cancelar(this.nominaSeleccionada.id).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })
    }

    cancelarCFDI() {

    }
}
