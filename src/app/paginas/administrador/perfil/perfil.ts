import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdmin } from "../../../compartido/componentes/sidebar-admin/sidebar-admin";
import { HeaderAdmin } from '../../../compartido/componentes/header-admin/header-admin';
import { 
  Firestore, 
  collection, 
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp
} from '@angular/fire/firestore';
import { 
  Auth,
  createUserWithEmailAndPassword,
  updateProfile
} from '@angular/fire/auth';
import { Usuario } from '../../../nucleo/modelos/usuario.model';
import { Subscription } from 'rxjs';

interface AdminUsuario {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  rol: 'administrador';
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAdmin, HeaderAdmin],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit, OnDestroy {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // Suscripciones
  private usuariosSubscription?: Subscription;

  // Estado
  isLoading = true;
  administradores: AdminUsuario[] = [];

  // Modales
  showEditModal = false;
  showAddModal = false;

  // Formulario de edición
  usuarioEditando: AdminUsuario | null = null;
  editForm = {
    displayName: '',
    email: '',
    newPassword: ''
  };

  // Formulario de agregar
  addForm = {
    displayName: '',
    email: '',
    password: ''
  };

  // Mensajes
  mensajeExito = '';
  mensajeError = '';

  ngOnInit() {
    this.cargarAdministradoresEnTiempoReal();
  }

  ngOnDestroy() {
    this.usuariosSubscription?.unsubscribe();
  }

  cargarAdministradoresEnTiempoReal() {
    const usuariosCollection = collection(this.firestore, 'usuarios');
    const q = query(usuariosCollection, where('rol', '==', 'administrador'));

    this.usuariosSubscription = collectionData(q, { idField: 'id' }).subscribe({
      next: (usuarios: any[]) => {
        this.administradores = usuarios.map(user => ({
          ...user,
          createdAt: user.createdAt?.toDate() || new Date(),
          updatedAt: user.updatedAt?.toDate() || new Date()
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar administradores:', error);
        this.mensajeError = 'Error al cargar administradores';
        this.isLoading = false;
      }
    });
  }

  // ========== MODAL EDITAR ==========
  abrirModalEditar(admin: AdminUsuario) {
    this.usuarioEditando = admin;
    this.editForm = {
      displayName: admin.displayName,
      email: admin.email,
      newPassword: ''
    };
    this.showEditModal = true;
    this.limpiarMensajes();
  }

  cerrarModalEditar() {
    this.showEditModal = false;
    this.usuarioEditando = null;
    this.editForm = {
      displayName: '',
      email: '',
      newPassword: ''
    };
  }

  async actualizarUsuario() {
    if (!this.usuarioEditando) return;

    try {
      this.isLoading = true;
      this.limpiarMensajes();

      const usuarioDoc = doc(this.firestore, `usuarios/${this.usuarioEditando.id}`);

      const updateData: any = {
        displayName: this.editForm.displayName,
        email: this.editForm.email,
        updatedAt: Timestamp.now()
      };

      await updateDoc(usuarioDoc, updateData);

      this.mensajeExito = '✓ Usuario actualizado exitosamente';
      this.cerrarModalEditar();

      setTimeout(() => this.limpiarMensajes(), 3000);

    } catch (error: any) {
      console.error('Error al actualizar usuario:', error);
      this.mensajeError = this.obtenerMensajeError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // ========== MODAL AGREGAR ==========
  abrirModalAgregar() {
    this.addForm = {
      displayName: '',
      email: '',
      password: ''
    };
    this.showAddModal = true;
    this.limpiarMensajes();
  }

  cerrarModalAgregar() {
    this.showAddModal = false;
    this.addForm = {
      displayName: '',
      email: '',
      password: ''
    };
  }

  async agregarNuevoAdmin() {
    try {
      this.isLoading = true;
      this.limpiarMensajes();

      // Validaciones
      if (!this.addForm.email || !this.addForm.password || !this.addForm.displayName) {
        this.mensajeError = 'Por favor complete todos los campos';
        this.isLoading = false;
        return;
      }

      if (this.addForm.password.length < 6) {
        this.mensajeError = 'La contraseña debe tener al menos 6 caracteres';
        this.isLoading = false;
        return;
      }

      // Crear usuario en Firebase Auth
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        this.addForm.email,
        this.addForm.password
      );

      const user = credential.user;

      // Actualizar perfil con displayName
      await updateProfile(user, {
        displayName: this.addForm.displayName
      });

      // Crear documento en Firestore
      const usuariosCollection = collection(this.firestore, 'usuarios');
      const nuevoAdmin = {
        uid: user.uid,
        email: this.addForm.email,
        displayName: this.addForm.displayName,
        rol: 'administrador',
        phoneNumber: '',
        country: '',
        photoURL: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(usuariosCollection, nuevoAdmin);

      this.mensajeExito = '✓ Administrador agregado exitosamente';
      this.cerrarModalAgregar();

      setTimeout(() => this.limpiarMensajes(), 3000);

    } catch (error: any) {
      console.error('Error al agregar administrador:', error);
      this.mensajeError = this.obtenerMensajeError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // ========== ELIMINAR ==========
  async eliminarUsuario(admin: AdminUsuario) {
    const confirmacion = confirm(
      `¿Está seguro de eliminar al administrador "${admin.displayName}"?\n\n` +
      'Esta acción no se puede deshacer.'
    );

    if (!confirmacion) return;

    try {
      this.isLoading = true;
      this.limpiarMensajes();

      const usuarioDoc = doc(this.firestore, `usuarios/${admin.id}`);
      await deleteDoc(usuarioDoc);

      this.mensajeExito = '✓ Administrador eliminado exitosamente';

      setTimeout(() => this.limpiarMensajes(), 3000);

    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      this.mensajeError = 'Error al eliminar usuario. Intente nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }

  // ========== UTILIDADES ==========
  limpiarMensajes() {
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  obtenerMensajeError(error: any): string {
    const errorMap: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/requires-recent-login': 'Por seguridad, debe volver a iniciar sesión',
      'permission-denied': 'No tiene permisos para realizar esta acción'
    };

    return errorMap[error.code] || error.message || 'Ha ocurrido un error';
  }

  // ========== VALIDACIONES ==========
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}