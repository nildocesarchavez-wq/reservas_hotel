import { Component } from '@angular/core';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-pagos',
  imports: [HeaderDashboard, SidebarAdmin],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos {

}
