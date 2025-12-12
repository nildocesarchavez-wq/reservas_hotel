import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-inicio-sesion',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './inicio-sesion.html',
    styleUrl: './inicio-sesion.css'
})
export class InicioSesionComponent {
    userType: string = 'user';
    username: string = '';
    password: string = '';

    constructor(private router: Router) {}

    onSubmit(): void {
        // Simulación estática de login
        console.log('Intentando iniciar sesión...');
        console.log('Tipo de usuario:', this.userType);
        console.log('Usuario:', this.username);
        console.log('Contraseña:', this.password);

        // Validación simple
        if (!this.username || !this.password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Simulación de autenticación exitosa
        if (this.userType === 'admin') {
            // Redirigir al dashboard de admin (cuando esté listo)
            alert('¡Bienvenido Administrador! (Funcionalidad en desarrollo)');
            // this.router.navigate(['/admin/dashboard']);
        } else {
            // Redirigir al dashboard de cliente (cuando esté listo)
            alert('¡Bienvenido Cliente! (Funcionalidad en desarrollo)');
            // this.router.navigate(['/cliente/habitaciones']);
        }
    }
}