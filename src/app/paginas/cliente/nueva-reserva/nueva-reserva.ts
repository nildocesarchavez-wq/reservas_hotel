import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../../nucleo/servicios/reservas.service';
import { HabitacionesService } from '../../../nucleo/servicios/habitaciones.service';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Habitacion } from '../../../nucleo/modelos/habitacion.model';
import { Usuario } from '../../../nucleo/modelos/usuario.model';
import { SolesPeruanosPipe } from '../../../nucleo/pipes/soles-peruanos-pipe';

@Component({
    selector: 'app-nueva-reserva',
    standalone: true,
    imports: [CommonModule, FormsModule, SolesPeruanosPipe],
    templateUrl: './nueva-reserva.html',
    styleUrl: './nueva-reserva.css'
})
export class NuevaReservaComponent implements OnInit, OnChanges {
    @Input() isOpen: boolean = false;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() submitEvent = new EventEmitter<any>();

    // Servicios
    private reservasService = inject(ReservasService);
    private habitacionesService = inject(HabitacionesService);
    private authService = inject(AutenticacionService);

    // Usuario actual
    usuario: Usuario | null = null;

    // Habitaciones disponibles desde Firebase
    habitacionesDisponibles: Habitacion[] = [];
    habitacionSeleccionada: Habitacion | null = null;

    minDate: string = new Date().toISOString().split('T')[0];
    
    reservationData = {
        habitacionId: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        comments: ''
    };

    // Estados
    availabilityMessage: string = '';
    isAvailable: boolean = false;
    totalNights: number = 0;
    pricePerNight: number = 0;
    totalPrice: number = 0;
    verificandoDisponibilidad: boolean = false;
    guardandoReserva: boolean = false;

    // Notificación
    notificacion: {
        visible: boolean;
        mensaje: string;
        tipo: 'success' | 'error' | 'warning';
    } = {
        visible: false,
        mensaje: '',
        tipo: 'success'
    };

    async ngOnInit() {
        await this.cargarUsuario();
        this.cargarHabitacionesDisponibles();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen']) {
            if (this.isOpen) {
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
            }
        }
    }

    /**
     * Mostrar notificación
     */
    mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning') {
        this.notificacion = {
            visible: true,
            mensaje,
            tipo
        };

        setTimeout(() => {
            this.notificacion.visible = false;
        }, 5000);
    }

    cerrarNotificacion() {
        this.notificacion.visible = false;
    }

    /**
     * Cargar datos del usuario autenticado
     */
    private async cargarUsuario() {
        try {
            this.usuario = await this.authService.getUserData();
            if (!this.usuario) {
                console.error('No hay usuario autenticado');
            }
        } catch (error) {
            console.error('Error al cargar usuario:', error);
        }
    }

    /**
     * Cargar habitaciones disponibles desde Firebase
     */
    private cargarHabitacionesDisponibles() {
        this.habitacionesService.obtenerHabitacionesDisponibles().subscribe({
            next: (habitaciones) => {
                this.habitacionesDisponibles = habitaciones;
                console.log('Habitaciones disponibles:', habitaciones);
            },
            error: (error) => {
                console.error('Error al cargar habitaciones:', error);
            }
        });
    }

    /**
     * Cuando cambia la habitación seleccionada
     */
    onRoomTypeChange() {
        if (this.reservationData.habitacionId) {
            this.habitacionSeleccionada = this.habitacionesDisponibles.find(
                h => h.id === this.reservationData.habitacionId
            ) || null;

            if (this.habitacionSeleccionada) {
                this.pricePerNight = this.habitacionSeleccionada.precio;
                this.calculateTotal();
                
                // Re-verificar disponibilidad si ya hay fechas seleccionadas
                if (this.reservationData.checkIn && this.reservationData.checkOut) {
                    this.checkAvailability();
                }
            }
        } else {
            this.habitacionSeleccionada = null;
            this.pricePerNight = 0;
            this.totalPrice = 0;
        }
    }

    /**
     * Validar que solo se ingresen números enteros en huéspedes
     */
    validarHuespedes(event: any) {
        const valor = event.target.value;
        
        // Eliminar cualquier caracter no numérico
        const valorLimpio = valor.replace(/[^0-9]/g, '');
        let numEntero = parseInt(valorLimpio) || 0;
        
        if (this.habitacionSeleccionada) {
            // Usar la capacidad de la habitación desde Firebase como límite máximo
            const capacidadMaxima = this.habitacionSeleccionada.capacidad;
            
            if (numEntero > capacidadMaxima) {
                this.reservationData.guests = capacidadMaxima;
                event.target.value = capacidadMaxima;
            } else if (numEntero < 1 || isNaN(numEntero)) {
                this.reservationData.guests = 1;
                event.target.value = 1;
            } else {
                this.reservationData.guests = numEntero;
                event.target.value = numEntero;
            }
        } else {
            // Si no hay habitación seleccionada, mínimo 1
            const valorFinal = numEntero < 1 || isNaN(numEntero) ? 1 : numEntero;
            this.reservationData.guests = valorFinal;
            event.target.value = valorFinal;
        }
    }

    /**
     * Verificar disponibilidad real en Firebase
     */
    async checkAvailability() {
        if (!this.reservationData.habitacionId) {
            this.availabilityMessage = 'Por favor, selecciona una habitación primero';
            this.isAvailable = false;
            return;
        }

        if (!this.reservationData.checkIn || !this.reservationData.checkOut) {
            return;
        }

        const checkIn = new Date(this.reservationData.checkIn);
        const checkOut = new Date(this.reservationData.checkOut);
        
        // Validar que checkout sea después de checkin
        if (checkOut <= checkIn) {
            this.availabilityMessage = 'La fecha de salida debe ser posterior a la fecha de entrada';
            this.isAvailable = false;
            return;
        }

        // Calcular noches
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        this.totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        try {
            this.verificandoDisponibilidad = true;
            this.availabilityMessage = 'Verificando disponibilidad...';
            
            // Verificar disponibilidad real en Firebase
            const disponible = await this.reservasService.verificarDisponibilidad(
                this.reservationData.habitacionId,
                checkIn,
                checkOut
            );

            if (disponible) {
                this.isAvailable = true;
                this.availabilityMessage = `¡Habitación disponible! ${this.totalNights} noche(s)`;
                this.calculateTotal();
            } else {
                this.isAvailable = false;
                this.availabilityMessage = 'Lo sentimos, la habitación no está disponible para estas fechas';
                this.totalPrice = 0;
            }
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
            this.availabilityMessage = 'Error al verificar disponibilidad. Intenta nuevamente.';
            this.isAvailable = false;
        } finally {
            this.verificandoDisponibilidad = false;
        }
    }

    /**
     * Calcular precio total
     */
    calculateTotal() {
        if (this.totalNights > 0 && this.pricePerNight > 0) {
            this.totalPrice = this.totalNights * this.pricePerNight;
        }
    }

    /**
     * Enviar formulario y crear reserva en Firebase
     */
    async onSubmit(event: Event) {
        event.preventDefault();
        
        if (!this.isAvailable) {
            this.mostrarNotificacion('Por favor, verifica la disponibilidad antes de continuar', 'warning');
            return;
        }

        if (!this.usuario) {
            this.mostrarNotificacion('Debes iniciar sesión para hacer una reserva', 'error');
            return;
        }

        if (!this.habitacionSeleccionada) {
            this.mostrarNotificacion('Por favor, selecciona una habitación', 'warning');
            return;
        }

        try {
            this.guardandoReserva = true;

            // Preparar datos de la reserva
            const reservaData = {
                usuarioId: this.usuario.uid,
                usuarioNombre: this.usuario.displayName,
                usuarioEmail: this.usuario.email,
                habitacionId: this.reservationData.habitacionId,
                fechaEntrada: new Date(this.reservationData.checkIn),
                fechaSalida: new Date(this.reservationData.checkOut),
                numeroHuespedes: this.reservationData.guests,
                notas: this.reservationData.comments
            };

            // Crear reserva en Firebase
            const reservaId = await this.reservasService.crearReserva(reservaData);
            
            console.log('Reserva creada exitosamente:', reservaId);
            this.mostrarNotificacion('¡Reserva creada exitosamente! Tu reserva está pendiente de confirmación.', 'success');
            
            // Emitir evento de éxito
            this.submitEvent.emit({
                reservaId,
                ...reservaData
            });

            // Resetear y cerrar después de un momento
            setTimeout(() => {
                this.resetForm();
                this.closeModal();
            }, 1500);
            
        } catch (error: any) {
            console.error('Error al crear reserva:', error);
            this.mostrarNotificacion(`Error al crear la reserva: ${error.message || 'Intenta nuevamente'}`, 'error');
        } finally {
            this.guardandoReserva = false;
        }
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        document.body.classList.remove('modal-open');
        this.closeEvent.emit();
    }

    /**
     * Resetear formulario
     */
    resetForm() {
        this.reservationData = {
            habitacionId: '',
            checkIn: '',
            checkOut: '',
            guests: 1,
            comments: ''
        };
        this.habitacionSeleccionada = null;
        this.availabilityMessage = '';
        this.isAvailable = false;
        this.totalNights = 0;
        this.pricePerNight = 0;
        this.totalPrice = 0;
    }

    /**
     * Obtener texto de capacidad
     */
    getCapacidadTexto(capacidad: number): string {
        return capacidad === 1 ? '1 persona' : `${capacidad} personas`;
    }
}