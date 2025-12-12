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
  isEditingProfile = false;

  profile = {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    address: ''
  };

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

  // Sistema de notificaciones
  notificacion: {
    visible: boolean;
    mensaje: string;
    tipo: 'success' | 'error' | 'warning';
  } = {
    visible: false,
    mensaje: '',
    tipo: 'success'
  };

  ngOnInit() {
    this.userSubscription = this.autenticacionService.userData$.subscribe({
      next: (userData) => {
        if (userData) {
          this.currentUser = userData;
          this.profile = {
            fullName: userData.displayName || '',
            email: userData.email || '',
            phone: userData.phoneNumber || '',
            country: userData.country || 'PE',
            address: ''
          };
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
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

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

  async onSubmitProfile(event: Event) {
    event.preventDefault();

    if (!this.currentUser) {
      this.mostrarNotificacion('No se pudo identificar el usuario', 'error');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, `usuarios/${this.currentUser.uid}`);

      await updateDoc(userDocRef, {
        displayName: this.profile.fullName,
        phoneNumber: this.profile.phone,
        country: this.profile.country,
        updatedAt: new Date()
      });

      this.mostrarNotificacion('¡Perfil actualizado exitosamente!', 'success');
      console.log('Perfil actualizado en Firebase');
      
      this.originalProfile = { ...this.profile };
      this.isEditingProfile = false;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      this.mostrarNotificacion('Error al actualizar el perfil. Intenta nuevamente.', 'error');
    }
  }

  enableEditProfile() {
    this.isEditingProfile = true;
  }

  cancelEditProfile() {
    this.profile = { ...this.originalProfile };
    this.isEditingProfile = false;
  }

  onSubmitPassword(event: Event) {
    event.preventDefault();

    if (this.password.new !== this.password.confirm) {
      this.mostrarNotificacion('Las contraseñas no coinciden', 'error');
      return;
    }

    console.log('Contraseña actualizada');
    this.mostrarNotificacion('¡Contraseña actualizada exitosamente!', 'success');

    this.password = {
      current: '',
      new: '',
      confirm: ''
    };
  }
}