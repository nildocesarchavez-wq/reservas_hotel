import { Component } from '@angular/core';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-mensajes-masivos',
  imports: [HeaderDashboard, SidebarAdmin],
  templateUrl: './mensajes-masivos.html',
  styleUrl: './mensajes-masivos.css',
})
export class MensajesMasivos {

}
