import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';

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
    loading: boolean = false;
    errorMessage: string = '';

    private authService = inject(AutenticacionService);
    private router = inject(Router);

    async onSubmit(): Promise<void> {
        // Limpiar mensaje de error
        this.errorMessage = '';

        // Validación simple
        if (!this.username || !this.password) {
            this.errorMessage = 'Por favor, completa todos los campos';
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.username)) {
            this.errorMessage = 'Por favor, ingresa un correo electrónico válido';
            return;
        }

        this.loading = true;

        try {
            // Intentar iniciar sesión con Firebase
            const userData = await this.authService.login({
                email: this.username,
                password: this.password
            });

            console.log('Login exitoso, datos del usuario:', userData);

            // Verificar el rol del usuario y el tipo seleccionado
            if (this.userType === 'admin' && userData.rol !== 'administrador') {
                this.errorMessage = 'No tienes permisos de administrador';
                await this.authService.logout();
                this.loading = false;
                return;
            }

            if (this.userType === 'user' && userData.rol === 'administrador') {
                this.errorMessage = 'Esta cuenta es de administrador. Selecciona la opción correcta.';
                await this.authService.logout();
                this.loading = false;
                return;
            }

            // Redirigir según el rol
            if (userData.rol === 'administrador') {
                console.log('Redirigiendo al panel de administrador...');
                this.router.navigate(['/admin/estado']);
            } else {
                console.log('Redirigiendo al dashboard de cliente...');
                this.router.navigate(['/cliente/dashboard']);
            }

        } catch (error: any) {
            console.error('Error en login:', error);
            this.errorMessage = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            this.loading = false;
        }
    }

    // Método para limpiar el error al escribir
    onInputChange(): void {
        this.errorMessage = '';
    }
}