import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Usuario } from '../../../nucleo/modelos/usuario.model';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css'
})
export class BarraNavegacionComponent implements OnInit {
  menuOpen = false;
  userMenuOpen = false;
  currentUser: Usuario | null = null;
  isLoading = true;

  constructor(
    public router: Router,
    private authService: AutenticacionService
  ) { }

  ngOnInit(): void {
    this.setupSmoothScroll();
    this.setupMenuToggle();
    this.subscribeToAuthState();

    // Cerrar menú al cambiar de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
      this.closeUserMenu();
    });
  }

  /**
   * Suscribirse al estado de autenticación
   */
  subscribeToAuthState(): void {
    this.authService.userData$.subscribe({
      next: (userData) => {
        this.currentUser = userData;
        this.isLoading = false;
        console.log('Usuario actual en navbar:', userData);
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario:', error);
        this.currentUser = null;
        this.isLoading = false;
      }
    });
  }

  /**
   * Verificar si el usuario está autenticado
   */
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Verificar si el usuario es administrador
   */
  get isAdmin(): boolean {
    return this.currentUser?.rol === 'administrador';
  }

  /**
   * Obtener iniciales del usuario
   */
  getUserInitials(): string {
    if (!this.currentUser?.displayName) return 'U';

    const names = this.currentUser.displayName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.currentUser.displayName[0].toUpperCase();
  }

  /**
   * Toggle menú de usuario
   */
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  /**
   * Cerrar menú de usuario
   */
  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  /**
   * Ir al dashboard según el rol
   */
  goToDashboard(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin/estado']);
    } else {
      this.router.navigate(['/cliente/dashboard']);
    }
    this.closeUserMenu();
  }

  /**
   * Ir al perfil
   */
  goToProfile(): void {
    if (this.isAdmin) {
      this.router.navigate(['/admin/perfil']);
    } else {
      this.router.navigate(['/cliente/perfil']);
    }
    this.closeUserMenu();
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.closeUserMenu();
      console.log('Sesión cerrada desde navbar');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
    }
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
      const navHeight = 80;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = document.querySelector('.user-menu-container');

    if (userMenu && !userMenu.contains(target)) {
      this.closeUserMenu();
    }
  }
}