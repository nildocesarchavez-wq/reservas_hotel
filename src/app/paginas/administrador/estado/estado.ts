import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderDashboard, SidebarAdmin],
  templateUrl: './estado.html',
  styleUrl: './estado.css',
})
export class Estado {
  // Aquí podrías agregar lógica para cargar datos dinámicos
  // Por ahora es estático como en el HTML original
}