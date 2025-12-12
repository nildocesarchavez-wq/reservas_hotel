import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-cliente.html',
  styleUrl: './header-cliente.css'
})
export class HeaderCliente {
  showUserMenu = false;

  toggleMenu() {
    // Emitir evento para toggle del sidebar
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('active');
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
}