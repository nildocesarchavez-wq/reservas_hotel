export interface Usuario {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  country?: string;
  rol: 'cliente' | 'administrador';
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistroData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  country?: string;
  rol?: 'cliente' | 'administrador';
}

export interface LoginData {
  email: string;
  password: string;
}