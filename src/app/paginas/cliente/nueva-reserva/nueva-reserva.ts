import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-nueva-reserva',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './nueva-reserva.html',
    styleUrl: './nueva-reserva.css'
})
export class NuevaReservaComponent implements OnChanges {
    @Input() isOpen: boolean = false;
    @Output() closeEvent = new EventEmitter<void>();
    @Output() submitEvent = new EventEmitter<any>();

    minDate: string = new Date().toISOString().split('T')[0];
    
    reservationData = {
        roomType: '',
        bedType: '',
        checkIn: '',
        checkOut: '',
        mealPlan: '',
        guests: 1,
        comments: ''
    };

    availabilityMessage: string = '';
    isAvailable: boolean = false;
    totalNights: number = 0;
    pricePerNight: number = 0;
    totalPrice: number = 0;

    roomPrices: { [key: string]: number } = {
        'suite': 320,
        'deluxe': 220,
        'guest': 180,
        'single': 150
    };

    // Detectar cambios en isOpen para bloquear/desbloquear scroll
    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen']) {
            if (this.isOpen) {
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
            }
        }
    }

    onRoomTypeChange() {
        if (this.reservationData.roomType) {
            this.pricePerNight = this.roomPrices[this.reservationData.roomType];
            this.calculateTotal();
        }
    }

    checkAvailability() {
        if (this.reservationData.checkIn && this.reservationData.checkOut) {
            const checkIn = new Date(this.reservationData.checkIn);
            const checkOut = new Date(this.reservationData.checkOut);
            
            if (checkOut <= checkIn) {
                this.availabilityMessage = 'La fecha de salida debe ser posterior a la fecha de entrada';
                this.isAvailable = false;
                return;
            }

            // Calcular noches
            const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
            this.totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Simulación de verificación de disponibilidad
            this.isAvailable = true;
            this.availabilityMessage = `¡Habitación disponible! ${this.totalNights} noche(s)`;
            
            this.calculateTotal();
        }
    }

    calculateTotal() {
        if (this.totalNights > 0 && this.pricePerNight > 0) {
            this.totalPrice = this.totalNights * this.pricePerNight;
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();
        
        if (!this.isAvailable) {
            alert('Por favor, verifica la disponibilidad antes de continuar');
            return;
        }

        console.log('Reserva enviada:', this.reservationData);
        this.submitEvent.emit(this.reservationData);
        this.resetForm();
        this.closeModal();
    }

    closeModal() {
        document.body.classList.remove('modal-open');
        this.closeEvent.emit();
    }

    resetForm() {
        this.reservationData = {
            roomType: '',
            bedType: '',
            checkIn: '',
            checkOut: '',
            mealPlan: '',
            guests: 1,
            comments: ''
        };
        this.availabilityMessage = '';
        this.isAvailable = false;
        this.totalNights = 0;
        this.pricePerNight = 0;
        this.totalPrice = 0;
    }
}