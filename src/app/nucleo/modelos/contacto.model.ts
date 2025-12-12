export interface Contacto {
  id?: string;
  nombre: string;
  telefono: string;
  email: string;
  estado: 'nuevo' | 'leido' | 'respondido';
  createdAt: Date;
  updatedAt?: Date;
}

export interface CrearContactoData {
  nombre: string;
  telefono: string;
  email: string;
}