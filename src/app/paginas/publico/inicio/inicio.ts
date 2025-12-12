import { Component } from '@angular/core';
import { HabitacionesPublicasComponent } from "../habitaciones-publicas/habitaciones-publicas";
import { ContactoComponent } from "../contacto/contacto";
import { Banner } from "../banner/banner";
import { NosotrosComponent } from "../nosotros/nosotros";
import { Equipo } from "../equipo/equipo";
import { Servicios } from "../servicios/servicios";
import { Galeria } from "../galeria/galeria";
import { BarraNavegacionComponent } from "../../../compartido/componentes/barra-navegacion/barra-navegacion";
import { PiePaginaInicio } from "../pie-pagina-inicio/pie-pagina-inicio";

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [HabitacionesPublicasComponent, ContactoComponent, Banner, NosotrosComponent, Equipo, Servicios, Galeria, BarraNavegacionComponent, PiePaginaInicio],
    templateUrl: './inicio.html',
    styleUrl: './inicio.css'
})
export class InicioComponent {

}
