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
  Timestamp,
  getDocs,
  getDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserva, CrearReservaData, EstadoReserva } from '../modelos/reserva.model';
import { HabitacionesService } from './habitaciones.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private firestore: Firestore = inject(Firestore);
  private habitacionesService: HabitacionesService = inject(HabitacionesService);
  private reservasCollection = collection(this.firestore, 'reservas');

  constructor() { }

  /**
   * Crear nueva reserva
   */
  async crearReserva(data: CrearReservaData): Promise<string> {
    try {
      // 1. Verificar disponibilidad de la habitación
      const disponible = await this.verificarDisponibilidad(
        data.habitacionId,
        data.fechaEntrada,
        data.fechaSalida
      );

      if (!disponible) {
        throw new Error('La habitación no está disponible para las fechas seleccionadas');
      }

      // 2. Obtener información de la habitación
      const habitacionDoc = doc(this.firestore, `habitaciones/${data.habitacionId}`);
      const habitacionSnap = await getDoc(habitacionDoc);

      if (!habitacionSnap.exists()) {
        throw new Error('Habitación no encontrada');
      }

      const habitacion = habitacionSnap.data();

      // 3. Calcular número de noches y precio total
      const numeroNoches = this.calcularNoches(data.fechaEntrada, data.fechaSalida);
      const precioPorNoche = habitacion['precio'];
      const precioTotal = numeroNoches * precioPorNoche;

      // 4. Crear la reserva CON nombre y email del usuario
      const nuevaReserva = {
        usuarioId: data.usuarioId,
        usuarioNombre: data.usuarioNombre || 'Usuario',
        usuarioEmail: data.usuarioEmail || 'sin-email@ejemplo.com',
        habitacionId: data.habitacionId,
        habitacionNumero: habitacion['numero'],
        habitacionTipo: habitacion['tipo'],
        fechaEntrada: Timestamp.fromDate(data.fechaEntrada),
        fechaSalida: Timestamp.fromDate(data.fechaSalida),
        numeroNoches: numeroNoches,
        numeroHuespedes: data.numeroHuespedes,
        precioTotal: precioTotal,
        precioPorNoche: precioPorNoche,
        estado: 'pendiente' as EstadoReserva,
        notas: data.notas || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(this.reservasCollection, nuevaReserva);

      // 5. Actualizar estado de la habitación a ocupada
      await this.habitacionesService.cambiarDisponibilidad(data.habitacionId, false);

      console.log('Reserva creada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las reservas en tiempo real (para admin)
   */
  obtenerTodasReservas(): Observable<Reserva[]> {
    const q = query(
      this.reservasCollection,
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((reservas: any[]) =>
        reservas.map(reserva => this.convertirTimestamps(reserva))
      )
    );
  }

  /**
   * Obtener reservas de un usuario específico en tiempo real
   */
  obtenerReservasPorUsuario(usuarioId: string): Observable<Reserva[]> {
    const q = query(
      this.reservasCollection,
      where('usuarioId', '==', usuarioId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((reservas: any[]) =>
        reservas.map(reserva => this.convertirTimestamps(reserva))
      )
    );
  }

  /**
   * Obtener reservas activas de un usuario (pendientes y confirmadas)
   */
  obtenerReservasActivas(usuarioId: string): Observable<Reserva[]> {
    return this.obtenerReservasPorUsuario(usuarioId).pipe(
      map(reservas =>
        reservas.filter(r =>
          r.estado === 'pendiente' || r.estado === 'confirmada'
        )
      )
    );
  }

  /**
   * Obtener historial de reservas (completadas y canceladas)
   */
  obtenerHistorialReservas(usuarioId: string): Observable<Reserva[]> {
    return this.obtenerReservasPorUsuario(usuarioId).pipe(
      map(reservas =>
        reservas.filter(r =>
          r.estado === 'completada' || r.estado === 'cancelada'
        )
      )
    );
  }

  /**
   * Obtener reserva por ID
   */
  obtenerReservaPorId(id: string): Observable<Reserva> {
    const reservaDoc = doc(this.firestore, `reservas/${id}`);

    return docData(reservaDoc, { idField: 'id' }).pipe(
      map((reserva: any) => this.convertirTimestamps(reserva))
    );
  }

  /**
   * Actualizar estado de reserva
   */
  async actualizarEstado(id: string, estado: EstadoReserva): Promise<void> {
    try {
      const reservaDoc = doc(this.firestore, `reservas/${id}`);
      const reservaSnap = await getDoc(reservaDoc);

      if (!reservaSnap.exists()) {
        throw new Error('Reserva no encontrada');
      }

      await updateDoc(reservaDoc, {
        estado: estado,
        updatedAt: Timestamp.now()
      });

      // Si se cancela o completa, liberar la habitación
      if (estado === 'cancelada' || estado === 'completada') {
        const reserva = reservaSnap.data();
        await this.habitacionesService.cambiarDisponibilidad(
          reserva['habitacionId'],
          true
        );
      }

      console.log('Estado de reserva actualizado:', id, estado);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }

  /**
   * Cancelar reserva
   */
  async cancelarReserva(id: string): Promise<void> {
    return this.actualizarEstado(id, 'cancelada');
  }

  /**
   * Confirmar reserva
   */
  async confirmarReserva(id: string): Promise<void> {
    return this.actualizarEstado(id, 'confirmada');
  }

  /**
   * Completar reserva
   */
  async completarReserva(id: string): Promise<void> {
    return this.actualizarEstado(id, 'completada');
  }

  /**
   * Eliminar reserva (solo admin)
   */
  async eliminarReserva(id: string): Promise<void> {
    try {
      const reservaDoc = doc(this.firestore, `reservas/${id}`);
      const reservaSnap = await getDoc(reservaDoc);

      if (reservaSnap.exists()) {
        const reserva = reservaSnap.data();
        // Liberar habitación antes de eliminar
        await this.habitacionesService.cambiarDisponibilidad(
          reserva['habitacionId'],
          true
        );
      }

      await deleteDoc(reservaDoc);
      console.log('Reserva eliminada:', id);
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad de habitación para fechas específicas
   */
  async verificarDisponibilidad(
    habitacionId: string,
    fechaEntrada: Date,
    fechaSalida: Date
  ): Promise<boolean> {
    try {
      // Consultar reservas activas para esta habitación
      const q = query(
        this.reservasCollection,
        where('habitacionId', '==', habitacionId),
        where('estado', 'in', ['pendiente', 'confirmada'])
      );

      const snapshot = await getDocs(q);

      // Verificar si hay conflictos de fechas
      for (const doc of snapshot.docs) {
        const reserva = doc.data();
        const reservaEntrada = reserva['fechaEntrada'].toDate();
        const reservaSalida = reserva['fechaSalida'].toDate();

        // Verificar solapamiento de fechas
        if (
          (fechaEntrada >= reservaEntrada && fechaEntrada < reservaSalida) ||
          (fechaSalida > reservaEntrada && fechaSalida <= reservaSalida) ||
          (fechaEntrada <= reservaEntrada && fechaSalida >= reservaSalida)
        ) {
          return false; // Hay conflicto
        }
      }

      return true; // No hay conflictos
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas de reservas (para admin)
   */
  async obtenerEstadisticas(): Promise<any> {
    try {
      const snapshot = await getDocs(this.reservasCollection);
      const reservas = snapshot.docs.map(doc => doc.data());

      return {
        total: reservas.length,
        pendientes: reservas.filter(r => r['estado'] === 'pendiente').length,
        confirmadas: reservas.filter(r => r['estado'] === 'confirmada').length,
        canceladas: reservas.filter(r => r['estado'] === 'cancelada').length,
        completadas: reservas.filter(r => r['estado'] === 'completada').length,
        ingresoTotal: reservas
          .filter(r => r['estado'] !== 'cancelada')
          .reduce((sum, r) => sum + r['precioTotal'], 0)
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Calcular número de noches entre dos fechas
   */
  private calcularNoches(fechaEntrada: Date, fechaSalida: Date): number {
    const diffTime = Math.abs(fechaSalida.getTime() - fechaEntrada.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Convertir Timestamps de Firestore a Date
   */
  private convertirTimestamps(reserva: any): Reserva {
    return {
      ...reserva,
      fechaEntrada: reserva.fechaEntrada?.toDate() || new Date(),
      fechaSalida: reserva.fechaSalida?.toDate() || new Date(),
      createdAt: reserva.createdAt?.toDate() || new Date(),
      updatedAt: reserva.updatedAt?.toDate() || new Date()
    };
  }
}