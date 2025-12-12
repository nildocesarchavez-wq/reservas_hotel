import { Component } from '@angular/core';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-reserva-habitacion',
  imports: [HeaderDashboard, SidebarAdmin],
  templateUrl: './reserva-habitacion.html',
  styleUrl: './reserva-habitacion.css',
})
export class ReservaHabitacion {

}
