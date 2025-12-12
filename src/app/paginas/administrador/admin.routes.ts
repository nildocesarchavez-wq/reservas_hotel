import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'estado',
    loadComponent: () => import('./estado/estado').then(m => m.Estado)
  },
  {
    path: 'reserva-habitacion',
    loadComponent: () => import('./reserva-habitacion/reserva-habitacion').then(m => m.ReservaHabitacion)
  },
  {
    path: 'lucro',
    loadComponent: () => import('./lucro/lucro').then(m => m.Lucro)
  },
  {
    path: 'estado-habitacion',
    loadComponent: () => import('./estado-habitacion/estado-habitacion').then(m => m.EstadoHabitacion)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil').then(m => m.Perfil)
  },
  {
    path: '',
    redirectTo: 'estado',
    pathMatch: 'full'
  }
];