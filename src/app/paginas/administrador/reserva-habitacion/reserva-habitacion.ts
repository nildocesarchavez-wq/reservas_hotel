import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-reserva-habitacion',
  imports: [HeaderAdmin, SidebarAdmin],
  templateUrl: './reserva-habitacion.html',
  styleUrl: './reserva-habitacion.css',
})
export class ReservaHabitacion {

}
