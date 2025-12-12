import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-dashboard.html',
  styleUrl: './header-dashboard.css'
})
export class HeaderDashboard {
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