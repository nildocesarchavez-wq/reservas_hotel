import { Component } from '@angular/core';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-lucro',
  imports: [HeaderDashboard, SidebarAdmin],
  templateUrl: './lucro.html',
  styleUrl: './lucro.css',
})
export class Lucro {

}
