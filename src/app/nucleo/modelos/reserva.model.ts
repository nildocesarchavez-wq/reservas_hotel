export interface Reserva {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioEmail: string;
  habitacionId: string;
  habitacionNumero: string;
  habitacionTipo: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  numeroNoches: number;
  numeroHuespedes: number;
  precioTotal: number;
  precioPorNoche: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearReservaData {
  usuarioId: string;
  usuarioNombre: string;  // ✅ Campo agregado
  usuarioEmail: string;   // ✅ Campo agregado
  habitacionId: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  numeroHuespedes: number;
  notas?: string;
}

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';