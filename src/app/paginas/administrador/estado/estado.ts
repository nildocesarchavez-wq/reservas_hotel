import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

interface Reservation {
  name: string;
  email: string;
  country: string;
  room: string;
  bed: string;
  meal: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Room {
  guest: string;
  roomType: string;
  color: string;
}

interface Follower {
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
export class Estado implements OnInit {
  // Datos de ejemplo (luego conectarás con Firebase)
  newReservations: Reservation[] = [
    {
      name: 'Juan Pérez',
      email: 'juan@email.com',
      country: 'Perú',
      room: 'Suite Deluxe',
      bed: 'King Size',
      meal: 'Desayuno incluido',
      checkIn: '2025-11-20',
      checkOut: '2025-11-25',
      status: 'pending'
    },
    {
      name: 'María García',
      email: 'maria@email.com',
      country: 'España',
      room: 'Habitación Doble',
      bed: 'Queen Size',
      meal: 'Media pensión',
      checkIn: '2025-11-22',
      checkOut: '2025-11-28',
      status: 'pending'
    },
    {
      name: 'Carlos López',
      email: 'carlos@email.com',
      country: 'México',
      room: 'Habitación Simple',
      bed: 'Single',
      meal: 'Sin comida',
      checkIn: '2025-12-01',
      checkOut: '2025-12-05',
      status: 'confirmed'
    }
  ];

  confirmedRooms: Room[] = [
    { guest: 'Carlos López', roomType: 'Suite Presidencial', color: 'room-blue' },
    { guest: 'Ana Martínez', roomType: 'Habitación Simple', color: 'room-green' }
  ];

  followers: Follower[] = [
    { name: 'Pedro Sánchez', email: 'pedro@email.com', date: '2025-11-15', status: 'Pending' },
    { name: 'Laura Torres', email: 'laura@email.com', date: '2025-11-16', status: 'Approved' }
  ];

  // Filtros
  filters = {
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  // Datos filtrados
  filteredNewReservations: Reservation[] = [];

  ngOnInit() {
    this.filteredNewReservations = [...this.newReservations];
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
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }
}