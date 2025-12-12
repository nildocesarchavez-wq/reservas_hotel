import { Routes } from '@angular/router';
import { invitadoGuard } from './nucleo/guardias/invitado-guard'; 

export const routes: Routes = [
  // Ruta por defecto - Redirige a inicio
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },

  // Rutas públicas (sin guardias)
  {
    path: 'inicio',
    loadComponent: () => import('./paginas/publico/inicio/inicio').then(m => m.InicioComponent)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./paginas/publico/nosotros/nosotros').then(m => m.NosotrosComponent)
  },
  {
    path: 'habitaciones',
    loadComponent: () => import('./paginas/publico/habitaciones-publicas/habitaciones-publicas').then(m => m.HabitacionesPublicasComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./paginas/publico/contacto/contacto').then(m => m.ContactoComponent)
  },

  // Rutas de autenticación - Solo para usuarios NO autenticados
  {
    path: 'auth/login',
    loadComponent: () => import('./paginas/autenticacion/inicio-sesion/inicio-sesion').then(m => m.InicioSesionComponent),
    canActivate: [invitadoGuard]
  },
  {
    path: 'auth/registro',
    loadComponent: () => import('./paginas/autenticacion/registro/registro').then(m => m.RegistroComponent),
    canActivate: [invitadoGuard]
  },

  // Rutas cliente - Solo para usuarios autenticados con rol 'cliente'
  {
    path: 'cliente',
    loadChildren: () => import('./paginas/cliente/cliente.routing').then(m => m.CLIENTE_ROUTES)
  },

  // Rutas administrador - Solo para usuarios autenticados con rol 'administrador'
  {
    path: 'admin',
    loadChildren: () => import('./paginas/administrador/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // Ruta 404
  {
    path: '**',
    loadComponent: () => import('./no-encontrado/no-encontrado').then(m => m.NoEncontradoComponent)
  }
];
