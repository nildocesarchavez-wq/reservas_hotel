import { Routes } from '@angular/router';

export const CLIENTE_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./mis-reservas/mis-reservas').then(m => m.MisReservasComponent)
  },
  {
    path: 'nueva-reserva',
    loadComponent: () => import('./nueva-reserva/nueva-reserva').then(m => m.NuevaReservaComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil').then(m => m.Perfil)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];