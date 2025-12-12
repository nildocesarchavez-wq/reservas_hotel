import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { ReservasService } from '../../../nucleo/servicios/reservas.service';
import { HabitacionesService } from '../../../nucleo/servicios/habitaciones.service';
import { ContactoService } from '../../../nucleo/servicios/contacto.service';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Reserva } from '../../../nucleo/modelos/reserva.model';
import { Habitacion } from '../../../nucleo/modelos/habitacion.model';
import { Contacto } from '../../../nucleo/modelos/contacto.model';
import { Subscription, forkJoin } from 'rxjs';
import { 
  Firestore, 
  doc, 
  getDoc 
} from '@angular/fire/firestore';

interface ReservaDisplay {
  id: string;
  name: string;
  email: string;
  country: string;
  room: string;
  bed: string;
  meal: string;
  checkIn: string;
  checkOut: string;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
}

interface Room {
  guest: string;
  roomType: string;
  color: string;
}

interface Follower {
  id: string;
  name: string;
  email: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderAdmin, SidebarAdmin],
  templateUrl: './estado.html',
  styleUrl: './estado.css',
})
export class Estado implements OnInit, OnDestroy {
  private reservasService = inject(ReservasService);
  private habitacionesService = inject(HabitacionesService);
  private contactoService = inject(ContactoService);
  private authService = inject(AutenticacionService);
  private firestore = inject(Firestore);

  // Subscripciones
  private reservasSubscription?: Subscription;
  private habitacionesSubscription?: Subscription;
  private contactosSubscription?: Subscription;

  // Estado de carga
  isLoading = true;

  // Datos originales de Firebase
  todasReservas: Reserva[] = [];
  todasHabitaciones: Habitacion[] = [];
  todosContactos: Contacto[] = [];

  // Datos transformados para la vista
  newReservations: ReservaDisplay[] = [];
  confirmedRooms: Room[] = [];
  followers: Follower[] = [];

  // Filtros
  filters = {
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  // Datos filtrados
  filteredNewReservations: ReservaDisplay[] = [];

  ngOnInit() {
    this.cargarDatosEnTiempoReal();
  }

  ngOnDestroy() {
    // Limpiar todas las suscripciones
    if (this.reservasSubscription) {
      this.reservasSubscription.unsubscribe();
    }
    if (this.habitacionesSubscription) {
      this.habitacionesSubscription.unsubscribe();
    }
    if (this.contactosSubscription) {
      this.contactosSubscription.unsubscribe();
    }
  }

  cargarDatosEnTiempoReal() {
    // 1. Cargar todas las reservas en tiempo real
    this.reservasSubscription = this.reservasService.obtenerTodasReservas().subscribe({
      next: async (reservas) => {
        this.todasReservas = reservas;
        await this.procesarReservas();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.isLoading = false;
      }
    });

    // 2. Cargar todas las habitaciones en tiempo real
    this.habitacionesSubscription = this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (habitaciones) => {
        this.todasHabitaciones = habitaciones;
        this.procesarHabitacionesReservadas();
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
      }
    });

    // 3. Cargar contactos (seguidores) en tiempo real
    this.contactosSubscription = this.contactoService.obtenerContactosEnTiempoReal().subscribe({
      next: (contactos) => {
        this.todosContactos = contactos;
        this.procesarSeguidores();
      },
      error: (error) => {
        console.error('Error al cargar contactos:', error);
      }
    });
  }

  async procesarReservas() {
    // Transformar reservas de Firebase al formato de la vista
    const reservasConDatos = await Promise.all(
      this.todasReservas.map(async (reserva) => {
        let nombre = reserva.usuarioNombre || 'N/A';
        let email = reserva.usuarioEmail || 'N/A';
        let pais = 'N/A';

        // Si el nombre o email están vacíos, intentar obtenerlos del usuario
        if (!reserva.usuarioNombre || !reserva.usuarioEmail || reserva.usuarioNombre === '' || reserva.usuarioEmail === '') {
          try {
            const userDocRef = doc(this.firestore, `usuarios/${reserva.usuarioId}`);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              nombre = userData['displayName'] || nombre;
              email = userData['email'] || email;
              pais = userData['country'] || pais;
            }
          } catch (error) {
            console.error(`Error al obtener datos del usuario ${reserva.usuarioId}:`, error);
          }
        }

        return {
          id: reserva.id,
          name: nombre,
          email: email,
          country: pais,
          room: reserva.habitacionTipo,
          bed: this.obtenerTipoCama(reserva.habitacionTipo),
          meal: reserva.notas || 'No especificado',
          checkIn: this.formatearFecha(reserva.fechaEntrada),
          checkOut: this.formatearFecha(reserva.fechaSalida),
          status: reserva.estado
        };
      })
    );

    this.newReservations = reservasConDatos;
  }

  procesarHabitacionesReservadas() {
    // Filtrar solo reservas confirmadas
    const reservasConfirmadas = this.todasReservas.filter(
      r => r.estado === 'confirmada'
    );

    // Crear lista de habitaciones reservadas
    this.confirmedRooms = reservasConfirmadas.map((reserva, index) => ({
      guest: reserva.usuarioNombre || 'Huésped',
      roomType: `${reserva.habitacionTipo} #${reserva.habitacionNumero}`,
      color: index % 2 === 0 ? 'room-blue' : 'room-green'
    }));
  }

  procesarSeguidores() {
    // Transformar contactos a seguidores
    this.followers = this.todosContactos.map(contacto => ({
      id: contacto.id || '',
      name: contacto.nombre,
      email: contacto.email,
      date: this.formatearFecha(contacto.createdAt),
      status: this.mapearEstadoContacto(contacto.estado)
    }));
  }

  applyFilters() {
    this.filteredNewReservations = this.newReservations.filter(reservation => {
      // Filtro por estado
      if (this.filters.status && reservation.status !== this.filters.status) {
        return false;
      }

      // Filtro por fecha desde
      if (this.filters.dateFrom && reservation.checkIn < this.filters.dateFrom) {
        return false;
      }

      // Filtro por fecha hasta
      if (this.filters.dateTo && reservation.checkOut > this.filters.dateTo) {
        return false;
      }

      return true;
    });
  }

  clearFilters() {
    this.filters = {
      status: '',
      dateFrom: '',
      dateTo: ''
    };
    this.filteredNewReservations = [...this.newReservations];
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'cancelada': 'Cancelada',
      'completada': 'Completada',
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  // Métodos auxiliares
  private formatearFecha(fecha: Date): string {
    if (!fecha) return 'N/A';
    const d = new Date(fecha);
    return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  private obtenerTipoCama(tipoHabitacion: string): string {
    const tipoCamaMap: { [key: string]: string } = {
      'Individual': 'Single',
      'Doble': 'Queen Size',
      'Suite': 'King Size',
      'Deluxe': 'King Size',
      'Presidencial': 'King Size'
    };
    return tipoCamaMap[tipoHabitacion] || 'Estándar';
  }

  private mapearEstadoContacto(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'nuevo': 'Pending',
      'leido': 'Approved',
      'respondido': 'Approved'
    };
    return estadoMap[estado] || 'Pending';
  }
}