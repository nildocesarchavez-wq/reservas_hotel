import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css',
})
export class HeaderAdmin {
  showUserMenu = false;

  toggleMenu() {
    // Toggle del sidebar
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('show');
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
}