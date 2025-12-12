import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { ReservasService } from '../../../nucleo/servicios/reservas.service';
import { HabitacionesService } from '../../../nucleo/servicios/habitaciones.service';
import { Reserva } from '../../../nucleo/modelos/reserva.model';
import { Habitacion } from '../../../nucleo/modelos/habitacion.model';
import { Subscription, combineLatest } from 'rxjs';

interface DisponibilidadHabitacion {
  tipo: string;
  cantidad: number;
}

@Component({
  selector: 'app-reserva-habitacion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderAdmin, SidebarAdmin],
  templateUrl: './reserva-habitacion.html',
  styleUrl: './reserva-habitacion.css',
})
export class ReservaHabitacion implements OnInit, OnDestroy {
  private reservasService = inject(ReservasService);
  private habitacionesService = inject(HabitacionesService);
  private route = inject(ActivatedRoute);

  // Subscripciones
  private reservasSubscription?: Subscription;
  private habitacionesSubscription?: Subscription;
  private combinedSubscription?: Subscription;

  // Estado
  isLoading = true;
  reservaSeleccionadaId: string | null = null;

  // Datos en tiempo real
  reservasPendientes: Reserva[] = [];
  todasReservas: Reserva[] = [];
  reservaSeleccionada: Reserva | null = null;
  disponibilidadHabitaciones: DisponibilidadHabitacion[] = [];
  totalHabitacionesLibres = 0;

  // Formulario de confirmación
  estadoConfirmacion: 'pendiente' | 'confirmada' | 'cancelada' = 'pendiente';
  mensajeExito = '';
  mensajeError = '';

  ngOnInit() {
    this.cargarDatosEnTiempoReal();

    // Verificar si hay un ID de reserva en la ruta
    this.route.queryParams.subscribe(params => {
      if (params['reservaId']) {
        this.reservaSeleccionadaId = params['reservaId'];
      }
    });
  }

  ngOnDestroy() {
    this.reservasSubscription?.unsubscribe();
    this.habitacionesSubscription?.unsubscribe();
    this.combinedSubscription?.unsubscribe();
  }

  cargarDatosEnTiempoReal() {
    // Cargar reservas y habitaciones en paralelo
    this.combinedSubscription = combineLatest([
      this.reservasService.obtenerTodasReservas(),
      this.habitacionesService.obtenerHabitaciones()
    ]).subscribe({
      next: (data: any) => {
        const reservas = data[0] as Reserva[];
        const habitaciones = data[1] as Habitacion[];

        this.todasReservas = reservas;

        // Filtrar solo reservas pendientes
        this.reservasPendientes = reservas.filter((r: Reserva) => r.estado === 'pendiente');

        // Si hay una reserva seleccionada, cargarla
        if (this.reservaSeleccionadaId) {
          this.reservaSeleccionada = reservas.find((r: Reserva) => r.id === this.reservaSeleccionadaId) || null;
        } else if (this.reservasPendientes.length > 0) {
          // Seleccionar la primera pendiente por defecto
          this.reservaSeleccionada = this.reservasPendientes[0];
        }

        // Calcular disponibilidad de habitaciones
        this.calcularDisponibilidad(habitaciones, reservas);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.mensajeError = 'Error al cargar datos en tiempo real';
        this.isLoading = false;
      }
    });
  }

  calcularDisponibilidad(habitaciones: Habitacion[], reservas: Reserva[]) {
    // Agrupar habitaciones por tipo
    const tiposMap = new Map<string, number>();

    habitaciones.forEach(hab => {
      if (hab.disponible && hab.estado === 'disponible') {
        tiposMap.set(hab.tipo, (tiposMap.get(hab.tipo) || 0) + 1);
      }
    });

    // Convertir a array para la vista
    this.disponibilidadHabitaciones = Array.from(tiposMap.entries()).map(([tipo, cantidad]) => ({
      tipo,
      cantidad
    }));

    // Calcular total de habitaciones libres
    this.totalHabitacionesLibres = Array.from(tiposMap.values()).reduce((sum, val) => sum + val, 0);
  }

  seleccionarReserva(reserva: Reserva) {
    this.reservaSeleccionada = reserva;
    this.estadoConfirmacion = 'pendiente';
    this.mensajeExito = '';
    this.mensajeError = '';

    // Scroll suave hacia el detalle
    setTimeout(() => {
      document.getElementById('reservation-detail')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async confirmarReserva() {
    if (!this.reservaSeleccionada) {
      this.mensajeError = 'No hay reserva seleccionada';
      return;
    }

    if (this.estadoConfirmacion === 'pendiente') {
      this.mensajeError = 'Por favor seleccione una acción (Confirmar)';
      return;
    }

    try {
      this.isLoading = true;
      this.mensajeError = '';

      await this.reservasService.actualizarEstado(
        this.reservaSeleccionada.id,
        this.estadoConfirmacion
      );

      this.mensajeExito = `Reserva ${this.estadoConfirmacion} exitosamente`;

      // Limpiar selección después de 2 segundos
      setTimeout(() => {
        this.reservaSeleccionada = null;
        this.estadoConfirmacion = 'pendiente';
        this.mensajeExito = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);

    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      this.mensajeError = 'Error al procesar la reserva. Intente nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return 'N/A';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  obtenerTipoCama(tipoHabitacion: string): string {
    const tipoCamaMap: { [key: string]: string } = {
      'Individual': 'Single',
      'Doble': 'Double',
      'Suite': 'King Size',
      'Deluxe': 'King Size',
      'Presidencial': 'King Size'
    };
    return tipoCamaMap[tipoHabitacion] || 'Estándar';
  }

  obtenerEstadoTexto(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'pendiente': 'No Confirmado',
      'confirmada': 'Confirmado',
      'cancelada': 'Cancelado',
      'completada': 'Completado'
    };
    return estadoMap[estado] || estado;
  }
}