import { Routes } from '@angular/router';
import { administradorGuard } from '../../nucleo/guardias/administrador.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'estado',
    loadComponent: () => import('./estado/estado').then(m => m.Estado),
    canActivate: [administradorGuard]
  },
  {
    path: 'reserva-habitacion',
    loadComponent: () => import('./reserva-habitacion/reserva-habitacion').then(m => m.ReservaHabitacion),
    canActivate: [administradorGuard]
  },
  {
    path: 'lucro',
    loadComponent: () => import('./lucro/lucro').then(m => m.Lucro),
    canActivate: [administradorGuard]
  },
  {
    path: 'estado-habitacion',
    loadComponent: () => import('./estado-habitacion/estado-habitacion').then(m => m.EstadoHabitacion),
    canActivate: [administradorGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil').then(m => m.Perfil),
    canActivate: [administradorGuard]
  },
  {
    path: '',
    redirectTo: 'estado',
    pathMatch: 'full'
  }
];