import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './registro.html',
    styleUrl: './registro.css'
})
export class RegistroComponent {
    formData = {
        fullName: '',
        email: '',
        phone: '',
        country: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    };

    loading: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';

    private authService = inject(AutenticacionService);
    private router = inject(Router);

    async onSubmit(): Promise<void> {
        // Limpiar mensajes
        this.errorMessage = '';
        this.successMessage = '';

        // Validación de campos vacíos
        if (!this.formData.fullName || !this.formData.email || 
            !this.formData.phone || !this.formData.country || 
            !this.formData.password || !this.formData.confirmPassword) {
            this.errorMessage = 'Por favor, completa todos los campos';
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.formData.email)) {
            this.errorMessage = 'Por favor, ingresa un correo electrónico válido';
            return;
        }

        // Validación de contraseñas
        if (this.formData.password !== this.formData.confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden';
            return;
        }

        // Validación de longitud de contraseña
        if (this.formData.password.length < 6) {
            this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            return;
        }

        // Validación de términos
        if (!this.formData.acceptTerms) {
            this.errorMessage = 'Debes aceptar los términos y condiciones';
            return;
        }

        this.loading = true;

        try {
            // Registrar usuario en Firebase
            await this.authService.registrar({
                email: this.formData.email,
                password: this.formData.password,
                displayName: this.formData.fullName,
                phoneNumber: this.formData.phone,
                country: this.formData.country,
                rol: 'cliente' // Por defecto todos los registros son clientes
            });

            console.log('Registro exitoso');
            this.successMessage = '¡Cuenta creada exitosamente! Redirigiendo...';

            // Esperar 2 segundos y redirigir al login
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 2000);

        } catch (error: any) {
            console.error('Error en registro:', error);
            this.errorMessage = error.message || 'Error al crear la cuenta. Intenta nuevamente.';
            this.loading = false;
        }
    }

    // Método para limpiar mensajes al escribir
    onInputChange(): void {
        this.errorMessage = '';
        this.successMessage = '';
    }
}