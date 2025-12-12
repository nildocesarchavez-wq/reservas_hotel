export interface Habitacion {
  id: string;
  numero: string;
  tipo: 'Individual' | 'Doble' | 'Suite' | 'Deluxe' | 'Presidencial';
  precio: number;
  capacidad: number;
  descripcion: string;
  caracteristicas: string[];
  imagenes: string[];
  imagenPrincipal: string;
  disponible: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento' | 'limpieza';
  estrellas: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

export interface FiltrosHabitacion {
  tipo?: string;
  precioMin?: number;
  precioMax?: number;
  capacidad?: number;
  disponible?: boolean;
  estrellas?: number;
}

export type TipoHabitacion = 'Individual' | 'Doble' | 'Suite' | 'Deluxe' | 'Presidencial';
export type EstadoHabitacion = 'disponible' | 'ocupada' | 'mantenimiento' | 'limpieza';