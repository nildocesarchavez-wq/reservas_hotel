import { Component } from '@angular/core';
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { HeaderAdmin } from '../../../compartido/componentes/header-admin/header-admin';

@Component({
  selector: 'app-perfil',
  imports: [SidebarAdmin, HeaderAdmin],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {

}
