import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderDashboard } from '../../../compartido/componentes/header-dashboard/header-dashboard';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderDashboard, SidebarCliente],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}