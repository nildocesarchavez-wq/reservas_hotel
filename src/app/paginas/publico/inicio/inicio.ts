import { Component } from '@angular/core';
import { HabitacionesPublicasComponent } from "../habitaciones-publicas/habitaciones-publicas";
import { ContactoComponent } from "../contacto/contacto";
import { CabeceraInicio } from "../../../compartido/componentes/cabecera-inicio/cabecera-inicio";
import { NosotrosComponent } from "../nosotros/nosotros";

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [HabitacionesPublicasComponent, ContactoComponent, CabeceraInicio, NosotrosComponent],
    templateUrl: './inicio.html',
    styleUrl: './inicio.css'
})
export class InicioComponent {

}
