import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderDashboard } from "../../../compartido/componentes/header-dashboard/header-dashboard";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";

@Component({
  selector: 'app-agregar-habitacion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderDashboard, SidebarAdmin],
  templateUrl: './agregar-habitacion.html',
  styleUrl: './agregar-habitacion.css',
})
export class AgregarHabitacion {
  newRoom = {
    roomType: '',
    bedType: ''
  };

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.newRoom.roomType || !this.newRoom.bedType) {
      alert('Por favor, completa todos los campos');
      return;
    }

    console.log('Nueva habitación agregada:', this.newRoom);
    alert('¡Habitación agregada exitosamente! (Simulación)');
    
    // Reset form
    this.newRoom = {
      roomType: '',
      bedType: ''
    };
  }
}