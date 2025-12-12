import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderCliente } from '../../../compartido/componentes/header-cliente/header-cliente';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';
import { NuevaReservaComponent } from '../nueva-reserva/nueva-reserva';

interface Reservation {
    id: number;
    room: string;
    bedType: string;
    meal: string;
    checkIn: string;
    checkOut: string;
    price: string;
    status: 'active' | 'completed' | 'cancelled' | 'pending';
}

@Component({
    selector: 'app-mis-reservas',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, HeaderCliente, SidebarCliente, NuevaReservaComponent],
    templateUrl: './mis-reservas.html',
    styleUrl: './mis-reservas.css'
})
export class MisReservasComponent implements OnInit {
    showNewReservation = false;

    // Datos de ejemplo (luego conectarás con Firebase)
    activeReservations: Reservation[] = [
        {
            id: 1,
            room: 'Suite Deluxe',
            bedType: 'King Size',
            meal: 'Desayuno incluido',
            checkIn: '2025-12-20',
            checkOut: '2025-12-25',
            price: '$320/noche',
            status: 'active'
        },
        {
            id: 2,
            room: 'Habitación de Lujo',
            bedType: 'Queen Size',
            meal: 'Media Pensión',
            checkIn: '2025-12-15',
            checkOut: '2025-12-18',
            price: '$220/noche',
            status: 'active'
        }
    ];

    historyReservations: Reservation[] = [
        {
            id: 3,
            room: 'Habitación Doble',
            bedType: 'Double',
            meal: 'Sin comida',
            checkIn: '2025-11-01',
            checkOut: '2025-11-05',
            price: '$180/noche',
            status: 'completed'
        },
        {
            id: 4,
            room: 'Habitación Simple',
            bedType: 'Single',
            meal: 'Desayuno',
            checkIn: '2025-10-15',
            checkOut: '2025-10-18',
            price: '$150/noche',
            status: 'completed'
        }
    ];

    // Filtros
    filters = {
        status: '',
        dateFrom: '',
        dateTo: ''
    };

    // Datos filtrados
    filteredActiveReservations: Reservation[] = [];
    filteredHistoryReservations: Reservation[] = [];

    ngOnInit() {
        this.filteredActiveReservations = [...this.activeReservations];
        this.filteredHistoryReservations = [...this.historyReservations];
    }

    applyFilters() {
        // Filtrar reservas activas
        this.filteredActiveReservations = this.activeReservations.filter(reservation => {
            return this.filterReservation(reservation);
        });

        // Filtrar historial
        this.filteredHistoryReservations = this.historyReservations.filter(reservation => {
            return this.filterReservation(reservation);
        });
    }

    filterReservation(reservation: Reservation): boolean {
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
    }

    clearFilters() {
        this.filters = {
            status: '',
            dateFrom: '',
            dateTo: ''
        };
        this.filteredActiveReservations = [...this.activeReservations];
        this.filteredHistoryReservations = [...this.historyReservations];
    }

    getStatusText(status: string): string {
        const statusMap: { [key: string]: string } = {
            'active': 'Confirmada',
            'pending': 'Pendiente',
            'completed': 'Completada',
            'cancelled': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    cancelReservation(id: number) {
        if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            console.log('Cancelando reserva:', id);
            alert('Reserva cancelada exitosamente');
            // Aquí conectarías con Firebase para actualizar el estado
        }
    }

    openNewReservation() {
        this.showNewReservation = true;
    }

    closeNewReservation() {
        this.showNewReservation = false;
    }

    onReservationSubmit(data: any) {
        console.log('Reserva recibida:', data);
        alert('¡Reserva creada exitosamente!');
        // Aquí conectarías con Firebase
    }
}