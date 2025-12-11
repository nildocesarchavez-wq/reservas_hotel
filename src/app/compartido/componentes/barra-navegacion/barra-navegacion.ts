import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-navegacion.html',
  styleUrls: ['./barra-navegacion.css']
})
export class BarraNavegacionComponent implements OnInit {
  menuOpen = false;

  ngOnInit(): void {
    this.initMenuToggle();
  }

  initMenuToggle(): void {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
      const menuToggle = document.getElementById('menuToggle');
      const navMenu = document.getElementById('navMenu');

      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
          this.menuOpen = !this.menuOpen;
          
          if (this.menuOpen) {
            navMenu.classList.add('show');
          } else {
            navMenu.classList.remove('show');
          }
        });

        // Cerrar menú al hacer clic en un enlace
        const menuLinks = navMenu.querySelectorAll('.menu__link');
        menuLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.menuOpen = false;
            navMenu.classList.remove('show');
          });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          if (!target.closest('.navbar') && this.menuOpen) {
            this.menuOpen = false;
            navMenu.classList.remove('show');
          }
        });
      }
    }, 0);
  }
}