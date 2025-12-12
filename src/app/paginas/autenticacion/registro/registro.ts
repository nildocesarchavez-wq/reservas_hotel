import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

    constructor(private router: Router) {}

    onSubmit(): void {
        // Validación de campos vacíos
        if (!this.formData.fullName || !this.formData.email || 
            !this.formData.phone || !this.formData.country || 
            !this.formData.password || !this.formData.confirmPassword) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Validación de contraseñas
        if (this.formData.password !== this.formData.confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Validación de términos
        if (!this.formData.acceptTerms) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        // Simulación de registro exitoso
        console.log('Registro exitoso:', this.formData);
        alert('¡Cuenta creada exitosamente!');
        this.router.navigate(['/auth/login']);
    }
}