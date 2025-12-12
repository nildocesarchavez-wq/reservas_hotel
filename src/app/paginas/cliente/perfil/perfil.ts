import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderCliente } from '../../../compartido/componentes/header-cliente/header-cliente';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderCliente, SidebarCliente],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  profile = {
    fullName: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '+54 9 11 1234-5678',
    country: 'AR',
    address: 'Buenos Aires, Argentina'
  };

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  preferences = {
    emailNotifications: true,
    promotions: true,
    reminders: false
  };

  onSubmitProfile(event: Event) {
    event.preventDefault();
    console.log('Perfil actualizado:', this.profile);
    alert('¡Perfil actualizado exitosamente! (Simulación)');
  }

  onSubmitPassword(event: Event) {
    event.preventDefault();

    if (this.password.new !== this.password.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Contraseña actualizada');
    alert('¡Contraseña actualizada exitosamente! (Simulación)');

    // Reset password fields
    this.password = {
      current: '',
      new: '',
      confirm: ''
    };
  }

  onSubmitPreferences(event: Event) {
    event.preventDefault();
    console.log('Preferencias guardadas:', this.preferences);
    alert('¡Preferencias guardadas exitosamente! (Simulación)');
  }
}