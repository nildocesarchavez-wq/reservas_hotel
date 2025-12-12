import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";

@Component({
  selector: 'app-eliminar-habitacion',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderAdmin, SidebarAdmin],
  templateUrl: './eliminar-habitacion.html',
  styleUrl: './eliminar-habitacion.css',
})
export class EliminarHabitacion {

  deleteRoom(roomId: number) {
    const confirmed = confirm(`¿Está seguro de que desea eliminar la habitación #${roomId}?`);

    if (confirmed) {
      console.log('Habitación eliminada:', roomId);
      alert(`¡Habitación #${roomId} eliminada exitosamente! (Simulación)`);

      // Aquí iría la lógica para eliminar la habitación del DOM o del array de datos
      // Por ahora solo es una simulación
    }
  }
}