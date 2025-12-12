import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta por defecto - Redirige a inicio
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },

  // Rutas públicas
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

  {
    path: 'auth/login',
    loadComponent: () => import('./paginas/autenticacion/inicio-sesion/inicio-sesion').then(m => m.InicioSesionComponent)
  },

  // Rutas cliente
  {
    path: 'cliente/dashboard',
    loadComponent: () => import('./compartido/componentes/sidebar-cliente/sidebar-cliente').then(m => m.SidebarCliente)
  },

  // Ruta 404
  {
    path: '**',
    loadComponent: () => import('./no-encontrado/no-encontrado').then(m => m.NoEncontradoComponent)
  }
];