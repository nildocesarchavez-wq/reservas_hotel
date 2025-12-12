import { Routes } from '@angular/router';
import { clienteGuard } from '../../nucleo/guardias/cliente-guard';

export const CLIENTE_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [clienteGuard]
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./mis-reservas/mis-reservas').then(m => m.MisReservasComponent),
    canActivate: [clienteGuard]
  },
  {
    path: 'nueva-reserva',
    loadComponent: () => import('./nueva-reserva/nueva-reserva').then(m => m.NuevaReservaComponent),
    canActivate: [clienteGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil').then(m => m.Perfil),
    canActivate: [clienteGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];