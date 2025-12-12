import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderCliente } from '../../../compartido/componentes/header-cliente/header-cliente';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';
import { NuevaReservaComponent } from '../nueva-reserva/nueva-reserva';
import { ReservasService } from '../../../nucleo/servicios/reservas.service';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Reserva } from '../../../nucleo/modelos/reserva.model';
import { Usuario } from '../../../nucleo/modelos/usuario.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeaderCliente, 
    SidebarCliente,
    NuevaReservaComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private reservasService = inject(ReservasService);
  private authService = inject(AutenticacionService);

  // Datos del usuario
  usuario: Usuario | null = null;

  // Reservas
  reservasActivas: Reserva[] = [];
  totalReservasActivas: number = 0;
  
  // Estado de carga
  cargando: boolean = true;

  // Modal de nueva reserva
  showNewReservation: boolean = false;

  // Subscripciones
  private subscriptions: Subscription[] = [];

  async ngOnInit() {
    await this.cargarDatosUsuario();
    this.cargarReservas();
  }

  ngOnDestroy() {
    // Limpiar todas las suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Cargar datos del usuario autenticado
   */
  private async cargarDatosUsuario() {
    try {
      this.usuario = await this.authService.getUserData();
      console.log('Usuario cargado:', this.usuario);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  /**
   * Cargar reservas activas en tiempo real
   */
  private cargarReservas() {
    if (!this.usuario) {
      console.warn('No hay usuario autenticado');
      this.cargando = false;
      return;
    }

    // Suscribirse a las reservas activas del usuario
    const reservasSub = this.reservasService
      .obtenerReservasActivas(this.usuario.uid)
      .subscribe({
        next: (reservas) => {
          console.log('Reservas activas recibidas:', reservas);
          this.reservasActivas = reservas;
          this.totalReservasActivas = reservas.length;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar reservas:', error);
          this.cargando = false;
        }
      });

    this.subscriptions.push(reservasSub);
  }

  /**
   * Abrir modal de nueva reserva
   */
  openNewReservation() {
    this.showNewReservation = true;
  }

  /**
   * Cerrar modal de nueva reserva
   */
  closeNewReservation() {
    this.showNewReservation = false;
  }

  /**
   * Manejar envío de nueva reserva
   */
  onReservationSubmit(data: any) {
    console.log('Reserva creada desde dashboard:', data);
    this.closeNewReservation();
    // La lista se actualizará automáticamente por Firebase
  }

  /**
   * Obtener badge de estado
   */
  getBadgeClass(estado: string): string {
    const badges: { [key: string]: string } = {
      'pendiente': 'badge-warning',
      'confirmada': 'badge-success',
      'cancelada': 'badge-danger',
      'completada': 'badge-secondary'
    };
    return badges[estado] || 'badge-secondary';
  }

  /**
   * Obtener texto del estado
   */
  getEstadoTexto(estado: string): string {
    const textos: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'completada': 'Completada'
    };
    return textos[estado] || estado;
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  /**
   * Formatear precio
   */
  formatearPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }
}