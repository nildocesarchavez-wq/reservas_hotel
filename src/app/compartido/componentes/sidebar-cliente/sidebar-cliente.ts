import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-cliente.html',
  styleUrl: './sidebar-cliente.css'
})
export class SidebarCliente {
  isOpen = false;
}