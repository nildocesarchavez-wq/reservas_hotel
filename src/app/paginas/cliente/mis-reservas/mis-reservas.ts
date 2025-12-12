import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeaderCliente } from '../../../compartido/componentes/header-cliente/header-cliente';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';
import { NuevaReservaComponent } from '../nueva-reserva/nueva-reserva';
import { ReservasService } from '../../../nucleo/servicios/reservas.service';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Reserva } from '../../../nucleo/modelos/reserva.model';
import { SolesPeruanosPipe } from '../../../nucleo/pipes/soles-peruanos-pipe';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderCliente,
    SidebarCliente,
    NuevaReservaComponent,
    SolesPeruanosPipe
  ],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css'
})
export class MisReservasComponent implements OnInit, OnDestroy {
  // Servicios
  private reservasService = inject(ReservasService);
  private authService = inject(AutenticacionService);

  // Estado
  showNewReservation = false;
  loading = true;
  error: string | null = null;

  // Notificaciones
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'warning' = 'success';

  // Modal de confirmación
  showConfirmModal = false;
  reservaToCancel: string | null = null;

  // Datos de reservas desde Firebase
  activeReservations: Reserva[] = [];
  historyReservations: Reserva[] = [];

  // Datos filtrados
  filteredActiveReservations: Reserva[] = [];
  filteredHistoryReservations: Reserva[] = [];

  // Filtros
  filters = {
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  // Subscripciones
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.cargarReservas();
  }

  ngOnDestroy() {
    // Limpiar todas las subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Cargar reservas del usuario actual desde Firebase en tiempo real
   */
  cargarReservas() {
    this.loading = true;
    this.error = null;

    const user = this.authService.getCurrentUser();

    if (!user) {
      this.error = 'No hay usuario autenticado';
      this.loading = false;
      return;
    }

    // Suscribirse a todas las reservas del usuario
    const reservasSub = this.reservasService
      .obtenerReservasPorUsuario(user.uid)
      .subscribe({
        next: (reservas) => {
          console.log('📋 Reservas recibidas:', reservas);

          // Separar reservas activas (pendientes y confirmadas)
          this.activeReservations = reservas.filter(
            r => r.estado === 'pendiente' || r.estado === 'confirmada'
          );

          // Historial (completadas y canceladas)
          this.historyReservations = reservas.filter(
            r => r.estado === 'completada' || r.estado === 'cancelada'
          );

          // Aplicar filtros
          this.applyFilters();

          this.loading = false;
        },
        error: (err) => {
          console.error('❌ Error al cargar reservas:', err);
          this.error = 'Error al cargar las reservas';
          this.loading = false;
        }
      });

    this.subscriptions.push(reservasSub);
  }

  /**
   * Aplicar filtros a las reservas
   */
  applyFilters() {
    // Filtrar reservas activas
    this.filteredActiveReservations = this.activeReservations.filter(
      reservation => this.filterReservation(reservation)
    );

    // Filtrar historial
    this.filteredHistoryReservations = this.historyReservations.filter(
      reservation => this.filterReservation(reservation)
    );
  }

  /**
   * Lógica de filtrado individual
   */
  filterReservation(reserva: Reserva): boolean {
    // Filtro por estado
    if (this.filters.status) {
      const statusMap: { [key: string]: string[] } = {
        'active': ['pendiente', 'confirmada'],
        'completed': ['completada'],
        'cancelled': ['cancelada']
      };

      const estadosPermitidos = statusMap[this.filters.status];
      if (estadosPermitidos && !estadosPermitidos.includes(reserva.estado)) {
        return false;
      }
    }

    // Filtro por fecha desde
    if (this.filters.dateFrom) {
      const fechaDesde = new Date(this.filters.dateFrom);
      if (reserva.fechaEntrada < fechaDesde) {
        return false;
      }
    }

    // Filtro por fecha hasta
    if (this.filters.dateTo) {
      const fechaHasta = new Date(this.filters.dateTo);
      if (reserva.fechaSalida > fechaHasta) {
        return false;
      }
    }

    return true;
  }

  /**
   * Limpiar todos los filtros
   */
  clearFilters() {
    this.filters = {
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    this.applyFilters();
  }

  /**
   * Obtener texto del estado en español
   */
  getStatusText(estado: string): string {
    const statusMap: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return statusMap[estado] || estado;
  }

  /**
   * Obtener clase CSS del badge según el estado
   */
  getStatusClass(estado: string): string {
    const classMap: { [key: string]: string } = {
      'pendiente': 'badge-warning',
      'confirmada': 'badge-success',
      'completada': 'badge-info',
      'cancelada': 'badge-danger'
    };
    return classMap[estado] || 'badge-secondary';
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Mostrar notificación
   */
  showNotificationMessage(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  /**
   * Cerrar notificación manualmente
   */
  closeNotification() {
    this.showNotification = false;
  }

  /**
   * Abrir modal de confirmación para cancelar
   */
  openCancelModal(id: string) {
    this.reservaToCancel = id;
    this.showConfirmModal = true;
  }

  /**
   * Cerrar modal de confirmación
   */
  closeCancelModal() {
    this.showConfirmModal = false;
    this.reservaToCancel = null;
  }

  /**
   * Confirmar cancelación de reserva
   */
  async confirmCancelReservation() {
    if (!this.reservaToCancel) return;

    try {
      await this.reservasService.cancelarReserva(this.reservaToCancel);
      console.log('✅ Reserva cancelada:', this.reservaToCancel);
      
      this.closeCancelModal();
      this.showNotificationMessage('Reserva cancelada exitosamente', 'success');
      
    } catch (error) {
      console.error('❌ Error al cancelar reserva:', error);
      this.showNotificationMessage('Error al cancelar la reserva. Intenta nuevamente.', 'error');
    }
  }

  /**
   * Cancelar una reserva
   */
  cancelReservation(id: string) {
    this.openCancelModal(id);
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
  async onReservationSubmit(data: any) {
    try {
      console.log('📝 Creando reserva:', data);
      this.closeNewReservation();
      this.showNotificationMessage('¡Reserva creada exitosamente!', 'success');
    } catch (error) {
      console.error('❌ Error al crear reserva:', error);
      this.showNotificationMessage('Error al crear la reserva', 'error');
    }
  }
}