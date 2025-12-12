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
        // Validación simple
        if (!this.username || !this.password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Simulación de autenticación exitosa
        // Redirige según el tipo de usuario seleccionado
        if (this.userType === 'admin') {
            console.log('Redirigiendo al panel de administrador...');
            this.router.navigate(['/admin/estado']);
        } else {
            console.log('Redirigiendo al dashboard de cliente...');
            this.router.navigate(['/cliente/dashboard']);
        }
    }
}