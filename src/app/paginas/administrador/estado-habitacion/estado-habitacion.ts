import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-estado-habitacion',
  imports: [HeaderAdmin, SidebarAdmin],
  templateUrl: './estado-habitacion.html',
  styleUrl: './estado-habitacion.css',
})
export class EstadoHabitacion {

}
