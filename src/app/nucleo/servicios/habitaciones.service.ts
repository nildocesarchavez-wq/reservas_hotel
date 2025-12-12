import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Habitacion, FiltrosHabitacion } from '../modelos/habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private firestore: Firestore = inject(Firestore);
  private habitacionesCollection = collection(this.firestore, 'habitaciones');

  constructor() { }

  /**
   * Obtener todas las habitaciones en tiempo real
   */
  obtenerHabitaciones(): Observable<Habitacion[]> {
    const q = query(this.habitacionesCollection, orderBy('numero', 'asc'));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map((habitaciones: any[]) => 
        habitaciones.map(hab => this.convertirTimestamps(hab))
      )
    );
  }

  /**
   * Obtener solo habitaciones disponibles
   */
  obtenerHabitacionesDisponibles(): Observable<Habitacion[]> {
    const q = query(
      this.habitacionesCollection,
      where('disponible', '==', true),
      where('estado', '==', 'disponible'),
      orderBy('precio', 'asc')
    );
    
    return collectionData(q, { idField: 'id' }).pipe(
      map((habitaciones: any[]) => 
        habitaciones.map(hab => this.convertirTimestamps(hab))
      )
    );
  }

  /**
   * Obtener habitación por ID
   */
  obtenerHabitacionPorId(id: string): Observable<Habitacion> {
    const habitacionDoc = doc(this.firestore, `habitaciones/${id}`);
    
    return docData(habitacionDoc, { idField: 'id' }).pipe(
      map((habitacion: any) => this.convertirTimestamps(habitacion))
    );
  }

  /**
   * Filtrar habitaciones
   */
  filtrarHabitaciones(filtros: FiltrosHabitacion): Observable<Habitacion[]> {
    return this.obtenerHabitaciones().pipe(
      map(habitaciones => {
        return habitaciones.filter(hab => {
          // Filtrar por tipo
          if (filtros.tipo && hab.tipo !== filtros.tipo) {
            return false;
          }

          // Filtrar por precio mínimo
          if (filtros.precioMin && hab.precio < filtros.precioMin) {
            return false;
          }

          // Filtrar por precio máximo
          if (filtros.precioMax && hab.precio > filtros.precioMax) {
            return false;
          }

          // Filtrar por capacidad
          if (filtros.capacidad && hab.capacidad < filtros.capacidad) {
            return false;
          }

          // Filtrar por disponibilidad
          if (filtros.disponible !== undefined && hab.disponible !== filtros.disponible) {
            return false;
          }

          // Filtrar por estrellas
          if (filtros.estrellas && hab.estrellas !== filtros.estrellas) {
            return false;
          }

          return true;
        });
      })
    );
  }

  /**
   * Crear nueva habitación (solo admin)
   */
  async crearHabitacion(habitacion: Omit<Habitacion, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const nuevaHabitacion = {
        ...habitacion,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(this.habitacionesCollection, nuevaHabitacion);
      console.log('Habitación creada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear habitación:', error);
      throw error;
    }
  }

  /**
   * Actualizar habitación (solo admin)
   */
  async actualizarHabitacion(id: string, datos: Partial<Habitacion>): Promise<void> {
    try {
      const habitacionDoc = doc(this.firestore, `habitaciones/${id}`);
      
      await updateDoc(habitacionDoc, {
        ...datos,
        updatedAt: Timestamp.now()
      });
      
      console.log('Habitación actualizada:', id);
    } catch (error) {
      console.error('Error al actualizar habitación:', error);
      throw error;
    }
  }

  /**
   * Eliminar habitación (solo admin)
   */
  async eliminarHabitacion(id: string): Promise<void> {
    try {
      const habitacionDoc = doc(this.firestore, `habitaciones/${id}`);
      await deleteDoc(habitacionDoc);
      console.log('Habitación eliminada:', id);
    } catch (error) {
      console.error('Error al eliminar habitación:', error);
      throw error;
    }
  }

  /**
   * Cambiar disponibilidad de habitación
   */
  async cambiarDisponibilidad(id: string, disponible: boolean): Promise<void> {
    try {
      const habitacionDoc = doc(this.firestore, `habitaciones/${id}`);
      
      await updateDoc(habitacionDoc, {
        disponible,
        estado: disponible ? 'disponible' : 'ocupada',
        updatedAt: Timestamp.now()
      });
      
      console.log('Disponibilidad actualizada:', id, disponible);
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      throw error;
    }
  }

  /**
   * Convertir Timestamps de Firestore a Date
   */
  private convertirTimestamps(habitacion: any): Habitacion {
    return {
      ...habitacion,
      createdAt: habitacion.createdAt?.toDate() || new Date(),
      updatedAt: habitacion.updatedAt?.toDate() || new Date()
    };
  }
}