import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAdmin } from "../../../compartido/componentes/header-admin/header-admin";
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { HabitacionesService } from '../../../nucleo/servicios/habitaciones.service';
import { Habitacion } from '../../../nucleo/modelos/habitacion.model';
import { Subscription } from 'rxjs';

interface EstadisticaHabitacion {
  tipo: string;
  capacidad: string;
  cantidad: number;
  color: 'blue' | 'green' | 'brown' | 'red' | 'purple' | 'orange';
  icono: string;
  disponibles: number;
}

@Component({
  selector: 'app-estado-habitacion',
  standalone: true,
  imports: [CommonModule, HeaderAdmin, SidebarAdmin],
  templateUrl: './estado-habitacion.html',
  styleUrl: './estado-habitacion.css',
})
export class EstadoHabitacion implements OnInit, OnDestroy {
  private habitacionesService = inject(HabitacionesService);
  private subscription?: Subscription;

  habitaciones: Habitacion[] = [];
  estadisticas: EstadisticaHabitacion[] = [];
  cargando = true;
  error: string | null = null;

  // Mapeo de colores por índice
  private colores: ('blue' | 'green' | 'brown' | 'red' | 'purple' | 'orange')[] = [
    'blue', 'green', 'brown', 'red', 'purple', 'orange'
  ];

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Cargar habitaciones en tiempo real desde Firebase
   */
  private cargarHabitaciones(): void {
    this.cargando = true;
    this.error = null;

    this.subscription = this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (habitaciones) => {
        console.log('Habitaciones recibidas:', habitaciones);
        this.habitaciones = habitaciones;
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
        this.error = 'Error al cargar las habitaciones. Por favor, intenta nuevamente.';
        this.cargando = false;
      }
    });
  }

  /**
   * Calcular estadísticas agrupadas por tipo y capacidad
   */
  private calcularEstadisticas(): void {
    // Crear un mapa para agrupar por tipo y capacidad
    const grupos = new Map<string, EstadisticaHabitacion>();

    this.habitaciones.forEach(hab => {
      const clave = `${hab.tipo}-${hab.capacidad}`;
      
      if (grupos.has(clave)) {
        const grupo = grupos.get(clave)!;
        grupo.cantidad++;
        if (hab.disponible && hab.estado === 'disponible') {
          grupo.disponibles++;
        }
      } else {
        grupos.set(clave, {
          tipo: hab.tipo,
          capacidad: this.obtenerNombreCapacidad(hab.capacidad),
          cantidad: 1,
          color: 'blue', // Se asignará después
          icono: 'fa-users',
          disponibles: (hab.disponible && hab.estado === 'disponible') ? 1 : 0
        });
      }
    });

    // Convertir el mapa a array y asignar colores
    this.estadisticas = Array.from(grupos.values()).map((est, index) => ({
      ...est,
      color: this.colores[index % this.colores.length]
    }));

    console.log('Estadísticas calculadas:', this.estadisticas);
  }

  /**
   * Obtener nombre legible de capacidad
   */
  private obtenerNombreCapacidad(capacidad: number): string {
    const nombres: { [key: number]: string } = {
      1: 'Single',
      2: 'Double',
      3: 'Triple',
      4: 'Quad',
      5: 'Quintuple',
      6: 'Sextuple'
    };
    return nombres[capacidad] || `${capacidad} Personas`;
  }

  /**
   * Obtener clases CSS para el panel
   */
  obtenerClasePanel(color: string): string {
    return `room-panel bg-color-${color}`;
  }

  /**
   * Obtener clases CSS para el footer
   */
  obtenerClaseFooter(color: string): string {
    return `panel-footer back-footer-${color}`;
  }

  /**
   * Recargar datos manualmente
   */
  recargar(): void {
    this.cargarHabitaciones();
  }
}