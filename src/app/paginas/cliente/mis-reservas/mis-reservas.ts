import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderCliente } from '../../../compartido/componentes/header-cliente/header-cliente';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';

@Component({
    selector: 'app-mis-reservas',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, HeaderCliente, SidebarCliente],
    templateUrl: './mis-reservas.html',
    styleUrl: './mis-reservas.css'
})
export class MisReservasComponent {
    showNewReservation = false;

    newReservation = {
        roomType: '',
        bedType: '',
        checkIn: '',
        checkOut: '',
        mealPlan: ''
    };

    toggleNewReservation() {
        this.showNewReservation = !this.showNewReservation;
    }

    onSubmitReservation(event: Event) {
        event.preventDefault();
        console.log('Nueva reserva:', this.newReservation);
        alert('Reserva creada exitosamente! (Simulación)');
        this.showNewReservation = false;
        // Reset form
        this.newReservation = {
            roomType: '',
            bedType: '',
            checkIn: '',
            checkOut: '',
            mealPlan: ''
        };
    }
}