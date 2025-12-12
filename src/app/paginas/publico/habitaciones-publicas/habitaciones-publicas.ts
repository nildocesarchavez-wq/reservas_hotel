import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HabitacionesService } from '../../../nucleo/servicios/habitaciones.service';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Habitacion, FiltrosHabitacion, TipoHabitacion } from '../../../nucleo/modelos/habitacion.model';
import { SolesPeruanosPipe } from '../../../nucleo/pipes/soles-peruanos-pipe';

@Component({
  selector: 'app-habitaciones-publicas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SolesPeruanosPipe],
  templateUrl: './habitaciones-publicas.html',
  styleUrl: './habitaciones-publicas.css'
})
export class HabitacionesPublicasComponent implements OnInit, OnDestroy {
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  isLoading = true;
  error: string | null = null;

  // Usuario actual
  usuarioActual: any = null;
  esCliente = false;

  // Filtros
  filtros: FiltrosHabitacion = {
    disponible: true
  };

  tiposHabitacion: TipoHabitacion[] = ['Individual', 'Doble', 'Suite', 'Deluxe', 'Presidencial'];
  filtroTipoSeleccionado: string = 'todos';
  filtroEstrellas: number = 0;
  filtroPrecioMax: number = 1000;

  private subscriptions: Subscription[] = [];

  constructor(
    private habitacionesService: HabitacionesService,
    private authService: AutenticacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.verificarUsuario();
    this.cargarHabitaciones();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Verificar el rol del usuario actual
   */
  verificarUsuario(): void {
    const sub = this.authService.userData$.subscribe({
      next: (userData) => {
        this.usuarioActual = this.authService.getCurrentUser();
        if (userData) {
          this.esCliente = userData.rol === 'cliente';
        } else {
          this.esCliente = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Cargar habitaciones desde Firebase
   */
  cargarHabitaciones(): void {
    this.isLoading = true;
    this.error = null;

    const sub = this.habitacionesService.obtenerHabitacionesDisponibles().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
        this.habitacionesFiltradas = habitaciones;
        this.isLoading = false;
        console.log('Habitaciones cargadas:', habitaciones.length);
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
        this.error = 'Error al cargar las habitaciones. Por favor, intenta de nuevo.';
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  /**
   * Aplicar filtros
   */
  aplicarFiltros(): void {
    this.habitacionesFiltradas = this.habitaciones.filter(hab => {
      // Filtrar por tipo
      if (this.filtroTipoSeleccionado !== 'todos' && hab.tipo !== this.filtroTipoSeleccionado) {
        return false;
      }

      // Filtrar por estrellas
      if (this.filtroEstrellas > 0 && hab.estrellas < this.filtroEstrellas) {
        return false;
      }

      // Filtrar por precio
      if (hab.precio > this.filtroPrecioMax) {
        return false;
      }

      return true;
    });

    console.log('Filtros aplicados. Resultados:', this.habitacionesFiltradas.length);
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros(): void {
    this.filtroTipoSeleccionado = 'todos';
    this.filtroEstrellas = 0;
    this.filtroPrecioMax = 1000;
    this.habitacionesFiltradas = this.habitaciones;
  }

  /**
   * Generar array de estrellas para mostrar
   */
  getEstrellas(cantidad: number): number[] {
    return Array(5).fill(0).map((_, i) => i < cantidad ? 1 : 0);
  }

  /**
   * Verificar si puede reservar (solo clientes o usuarios no autenticados)
   */
  puedeReservar(): boolean {
    // Si no está autenticado, puede intentar reservar (lo redirigirá al login)
    if (!this.usuarioActual) {
      return true;
    }
    // Si está autenticado, solo puede reservar si es cliente
    return this.esCliente;
  }

  /**
   * Reservar habitación
   */
  async reservarHabitacion(habitacion: Habitacion): Promise<void> {
    // Verificar si el usuario está autenticado
    const user = this.authService.getCurrentUser();

    if (!user) {
      // Si no está autenticado, redirigir al login
      alert('Debes iniciar sesión para reservar una habitación');
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/inicio', habitacionId: habitacion.id }
      });
      return;
    }

    // Verificar si es cliente
    if (!this.esCliente) {
      alert('Solo los clientes pueden realizar reservas');
      return;
    }

    // Si está autenticado y es cliente, redirigir a nueva reserva con la habitación seleccionada
    this.router.navigate(['/cliente/nueva-reserva'], {
      queryParams: { habitacionId: habitacion.id }
    });
  }

  /**
   * Ver detalles de la habitación
   */
  verDetalles(habitacion: Habitacion): void {
    // Por ahora solo mostramos un alert, luego se puede crear una página de detalles
    const detalles = `Detalles de ${habitacion.tipo}\n\nPrecio: S/ ${habitacion.precio.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/noche\nCapacidad: ${habitacion.capacidad} personas\n\n${habitacion.descripcion}`;
    alert(detalles);
  }

  /**
   * Obtener imagen principal o placeholder
   */
  getImagenPrincipal(habitacion: Habitacion): string {
    return habitacion.imagenPrincipal || habitacion.imagenes?.[0] || 'images/r1.jpg';
  }
}