import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-pagos',
  imports: [HeaderAdmin, SidebarAdmin],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos {

}
