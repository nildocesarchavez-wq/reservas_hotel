import { Component } from '@angular/core';
import { HabitacionesPublicasComponent } from "../habitaciones-publicas/habitaciones-publicas.component";
import { ContactoComponent } from "../contacto/contacto.component";
import { CabeceraInicio } from "../../../compartido/componentes/cabecera-inicio/cabecera-inicio";
import { NosotrosComponent } from "../nosotros/nosotros.component";

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [HabitacionesPublicasComponent, ContactoComponent, CabeceraInicio, NosotrosComponent],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
