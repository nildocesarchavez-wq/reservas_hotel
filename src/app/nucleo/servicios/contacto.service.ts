import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contacto, CrearContactoData } from '../modelos/contacto.model';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private firestore = inject(Firestore);
  private contactosCollection = collection(this.firestore, 'contactos');

  /**
   * Crear nuevo mensaje de contacto
   */
  async crearContacto(data: CrearContactoData): Promise<string> {
    try {
      const contacto = {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        estado: 'nuevo',
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(this.contactosCollection, contacto);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear contacto:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los mensajes de contacto en tiempo real (para admin)
   */
  obtenerContactosEnTiempoReal(): Observable<Contacto[]> {
    const q = query(this.contactosCollection, orderBy('createdAt', 'desc'));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(contactos => 
        contactos.map(c => ({
          ...c,
          createdAt: (c['createdAt'] as Timestamp).toDate(),
          updatedAt: c['updatedAt'] ? (c['updatedAt'] as Timestamp).toDate() : undefined
        } as Contacto))
      )
    );
  }
}