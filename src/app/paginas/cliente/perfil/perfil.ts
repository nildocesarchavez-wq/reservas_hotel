import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderCliente } from '../../../compartido/componentes/header-cliente/header-cliente';
import { SidebarCliente } from '../../../compartido/componentes/sidebar-cliente/sidebar-cliente';
import { AutenticacionService } from '../../../nucleo/servicios/autenticacion.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Usuario } from '../../../nucleo/modelos/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderCliente, SidebarCliente],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit, OnDestroy {
  private autenticacionService = inject(AutenticacionService);
  private firestore = inject(Firestore);
  private userSubscription?: Subscription;

  // Datos del usuario actual
  currentUser: Usuario | null = null;
  isLoading = true;
  isEditingProfile = false; // Estado de edición

  profile = {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  };

  // Copia original para cancelar cambios
  originalProfile = {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  };

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  ngOnInit() {
    // Suscribirse a los datos del usuario en tiempo real
    this.userSubscription = this.autenticacionService.userData$.subscribe({
      next: (userData) => {
        if (userData) {
          this.currentUser = userData;
          // Cargar datos del usuario en el formulario
          this.profile = {
            fullName: userData.displayName || '',
            email: userData.email || '',
            phone: userData.phoneNumber || '',
            country: userData.country || 'PE',
            address: '' // Firebase no tiene campo address en el modelo actual
          };
          // Guardar copia original
          this.originalProfile = { ...this.profile };
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar datos del usuario:', error);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async onSubmitProfile(event: Event) {
    event.preventDefault();

    if (!this.currentUser) {
      alert('No se pudo identificar el usuario');
      return;
    }

    try {
      // Referencia al documento del usuario en Firestore
      const userDocRef = doc(this.firestore, `usuarios/${this.currentUser.uid}`);

      // Actualizar datos en Firestore
      await updateDoc(userDocRef, {
        displayName: this.profile.fullName,
        phoneNumber: this.profile.phone,
        country: this.profile.country,
        updatedAt: new Date()
      });

      alert('¡Perfil actualizado exitosamente!');
      console.log('Perfil actualizado en Firebase');
      
      // Actualizar copia original y salir del modo edición
      this.originalProfile = { ...this.profile };
      this.isEditingProfile = false;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil. Intenta nuevamente.');
    }
  }

  enableEditProfile() {
    this.isEditingProfile = true;
  }

  cancelEditProfile() {
    // Restaurar datos originales
    this.profile = { ...this.originalProfile };
    this.isEditingProfile = false;
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
}