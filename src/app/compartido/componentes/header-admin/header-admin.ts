import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Usuario } from '../../../nucleo/modelos/usuario.model';

@Component({
  selector: 'app-header-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.css'
})
export class HeaderAdmin implements OnInit {
  showUserMenu = false;
  currentUser: Usuario | null = null;
  isLoading = true;

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToAuthState();
  }

  /**
   * Suscribirse al estado de autenticación
   */
  subscribeToAuthState(): void {
    this.authService.userData$.subscribe({
      next: (userData) => {
        this.currentUser = userData;
        this.isLoading = false;
        
        // Verificar que sea administrador
        if (!userData) {
          console.log('No hay usuario autenticado en header-admin');
          this.router.navigate(['/auth/login']);
        } else if (userData.rol !== 'administrador') {
          console.log('Usuario no es administrador, redirigiendo');
          this.router.navigate(['/cliente/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario:', error);
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      }
    });
  }

  /**
   * Obtener nombre del usuario
   */
  getUserName(): string {
    if (!this.currentUser?.displayName) return 'Admin';
    
    // Si el nombre es muy largo, mostrar solo el primer nombre
    const names = this.currentUser.displayName.split(' ');
    return names[0];
  }

  /**
   * Obtener nombre completo del usuario
   */
  getFullName(): string {
    return this.currentUser?.displayName || 'Administrador';
  }

  /**
   * Obtener email del usuario
   */
  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  /**
   * Obtener iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    if (!this.currentUser?.displayName) return 'A';
    
    const names = this.currentUser.displayName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.currentUser.displayName[0].toUpperCase();
  }

  /**
   * Verificar si tiene foto de perfil
   */
  hasProfilePhoto(): boolean {
    return !!this.currentUser?.photoURL;
  }

  /**
   * Obtener URL de la foto de perfil
   */
  getProfilePhotoUrl(): string {
    return this.currentUser?.photoURL || '';
  }

  /**
   * Verificar si es administrador
   */
  isAdmin(): boolean {
    return this.currentUser?.rol === 'administrador';
  }

  /**
   * Toggle del menú lateral (sidebar)
   */
  toggleMenu(): void {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('show');
    
    // Emitir evento personalizado para que otros componentes lo escuchen
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  }

  /**
   * Toggle del menú de usuario
   */
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  /**
   * Cerrar menú de usuario
   */
  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  /**
   * Navegar al perfil
   */
  goToProfile(): void {
    this.router.navigate(['/admin/perfil']);
    this.closeUserMenu();
  }

  /**
   * Navegar a estado de habitación
   */
  goToEstadoHabitacion(): void {
    this.router.navigate(['/admin/estado-habitacion']);
    this.closeUserMenu();
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.closeUserMenu();
      console.log('Sesión cerrada desde header-admin');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
    }
  }

  /**
   * Cerrar menú al hacer click fuera
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = document.querySelector('.user-menu');
    
    if (userMenu && !userMenu.contains(target)) {
      this.closeUserMenu();
    }
  }
}