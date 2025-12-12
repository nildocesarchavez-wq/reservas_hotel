import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css'
})
export class BarraNavegacionComponent implements OnInit {
  menuOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setupSmoothScroll();
    this.setupMenuToggle();
    
    // Cerrar menú al cambiar de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
    });
  }

  setupMenuToggle(): void {
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
      }
    }, 0);
  }

  setupSmoothScroll(): void {
    setTimeout(() => {
      const scrollLinks = document.querySelectorAll('.scroll');

      scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          
          if (targetId && targetId.startsWith('#')) {
            // Si no estamos en la página de inicio, navegar primero
            if (this.router.url !== '/inicio' && this.router.url !== '/') {
              this.router.navigate(['/inicio']).then(() => {
                setTimeout(() => {
                  this.scrollToSection(targetId);
                }, 100);
              });
            } else {
              this.scrollToSection(targetId);
            }
            
            // Cerrar menú móvil después de hacer clic
            this.closeMenu();
          }
        });
      });
    }, 0);
  }

  scrollToSection(targetId: string): void {
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const navHeight = 80; // Altura de la barra de navegación
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
      navMenu.classList.remove('show');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const navbar = document.querySelector('.w3_navigation');
    
    if (navbar) {
      if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
}