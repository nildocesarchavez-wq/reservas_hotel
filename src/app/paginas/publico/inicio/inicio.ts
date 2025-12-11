import { Component } from '@angular/core';
import { HabitacionesPublicasComponent } from "../habitaciones-publicas/habitaciones-publicas";
import { ContactoComponent } from "../contacto/contacto";
import { CabeceraInicio } from "../../../compartido/componentes/cabecera-inicio/cabecera-inicio";
import { NosotrosComponent } from "../nosotros/nosotros";
import { Equipo } from "../equipo/equipo";
import { Servicios } from "../servicios/servicios";
import { Galeria } from "../galeria/galeria";

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [HabitacionesPublicasComponent, ContactoComponent, CabeceraInicio, NosotrosComponent, Equipo, Servicios, Galeria],
    templateUrl: './inicio.html',
    styleUrl: './inicio.css'
})
export class InicioComponent {

}
