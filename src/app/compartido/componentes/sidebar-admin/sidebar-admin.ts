import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Usuario } from '../../../nucleo/modelos/usuario.model';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.css'
})
export class SidebarAdmin implements OnInit {
  showUserMenu = false;
  currentUser: Usuario | null = null;
  isLoading = true;

  isOpen = false;

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) { }

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
    this.isOpen = !this.isOpen;

    // Emitir evento personalizado para que otros componentes lo escuchen (opcional, si se necesita)
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  }

  /**
   * Cerrar menú
   */
  close(): void {
    this.isOpen = false;
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
   * Navegar al estado (dashboard admin)
   */
  goToEstado(): void {
    this.router.navigate(['/admin/estado']);
    this.closeUserMenu();
  }

  /**
   * Navegar a reservas
   */
  goToReservas(): void {
    this.router.navigate(['/admin/reserva-habitacion']);
    this.closeUserMenu();
  }

  /**
   * Navegar a lucro
   */
  goToLucro(): void {
    this.router.navigate(['/admin/lucro']);
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