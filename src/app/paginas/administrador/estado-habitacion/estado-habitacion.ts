import { Component } from '@angular/core';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-estado-habitacion',
  imports: [HeaderDashboard, SidebarAdmin],
  templateUrl: './estado-habitacion.html',
  styleUrl: './estado-habitacion.css',
})
export class EstadoHabitacion {

}
