import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  updateProfile
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  docData 
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, from, of, switchMap } from 'rxjs';
import { Usuario, RegistroData, LoginData } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Observable del estado de autenticación
  currentUser$ = authState(this.auth);
  
  // Usuario actual con datos de Firestore
  userData$: Observable<Usuario | null> = this.currentUser$.pipe(
    switchMap(user => {
      if (user) {
        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
        return docData(userDocRef) as Observable<Usuario>;
      }
      return of(null);
    })
  );

  constructor() {
    // Suscribirse al estado de autenticación para debug
    this.currentUser$.subscribe(user => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
      } else {
        console.log('No hay usuario autenticado');
      }
    });
  }

  /**
   * Registrar nuevo usuario
   */
  async registrar(data: RegistroData): Promise<void> {
    try {
      // Crear usuario en Firebase Auth
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      const user = credential.user;

      // Actualizar perfil con displayName
      await updateProfile(user, {
        displayName: data.displayName
      });

      // Crear documento de usuario en Firestore
      const userData: Usuario = {
        uid: user.uid,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber || '',
        country: data.country || '',
        rol: data.rol || 'cliente',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(userDocRef, userData);

      console.log('Usuario registrado exitosamente');
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Iniciar sesión
   */
  async login(data: LoginData): Promise<Usuario> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      const user = credential.user;

      // Obtener datos del usuario desde Firestore
      const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error('No se encontraron datos del usuario');
      }

      const userData = userDoc.data() as Usuario;
      console.log('Login exitoso:', userData);

      return userData;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/inicio']);
      console.log('Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      throw this.manejarError(error);
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * Obtener datos completos del usuario actual
   */
  async getUserData(): Promise<Usuario | null> {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data() as Usuario;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  /**
   * Verificar si el usuario es administrador
   */
  async isAdmin(): Promise<boolean> {
    const userData = await this.getUserData();
    return userData?.rol === 'administrador';
  }

  /**
   * Manejar errores de Firebase
   */
  private manejarError(error: any): Error {
    let mensaje = 'Ha ocurrido un error';

    switch (error.code) {
      case 'auth/email-already-in-use':
        mensaje = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/invalid-email':
        mensaje = 'Correo electrónico inválido';
        break;
      case 'auth/operation-not-allowed':
        mensaje = 'Operación no permitida';
        break;
      case 'auth/weak-password':
        mensaje = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/user-disabled':
        mensaje = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/user-not-found':
        mensaje = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        mensaje = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-credential':
        mensaje = 'Credenciales inválidas';
        break;
      case 'auth/too-many-requests':
        mensaje = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      default:
        mensaje = error.message || 'Error desconocido';
    }

    return new Error(mensaje);
  }
}