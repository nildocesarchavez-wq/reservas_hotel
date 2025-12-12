import { Component } from '@angular/core';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-lucro',
  imports: [HeaderAdmin, SidebarAdmin],
  templateUrl: './lucro.html',
  styleUrl: './lucro.css',
})
export class Lucro {

}
