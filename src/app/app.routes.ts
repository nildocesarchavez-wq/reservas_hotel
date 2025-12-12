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

  // Rutas de autenticación
  {
    path: 'auth/login',
    loadComponent: () => import('./paginas/autenticacion/inicio-sesion/inicio-sesion').then(m => m.InicioSesionComponent)
  },

  // Rutas cliente
  {
    path: 'cliente/dashboard',
    loadComponent: () => import('./paginas/cliente/dashboard/dashboard').then(m => m.Dashboard)
  },

  {
    path: 'cliente/mis-reservas',
    loadComponent: () => import('./paginas/cliente/mis-reservas/mis-reservas').then(m => m.MisReservasComponent)
  },

  {
    path: 'cliente/perfil',
    loadComponent: () => import('./paginas/cliente/perfil/perfil').then(m => m.Perfil)
  },

  // Rutas administrador
  {
    path: 'admin/estado',
    loadComponent: () => import('./paginas/administrador/estado/estado').then(m => m.Estado)
  },
  
  {
    path: 'admin/mensajes-masivos',
    loadComponent: () => import('./paginas/administrador/mensajes-masivos/mensajes-masivos').then(m => m.MensajesMasivos)
  },

  {
    path: 'admin/reserva-habitacion',
    loadComponent: () => import('./paginas/administrador/reserva-habitacion/reserva-habitacion').then(m => m.ReservaHabitacion)
  },

  {
    path: 'admin/pagos',
    loadComponent: () => import('./paginas/administrador/pagos/pagos').then(m => m.Pagos)
  },

  {
    path: 'admin/lucro',
    loadComponent: () => import('./paginas/administrador/lucro/lucro').then(m => m.Lucro)
  },

  {
    path: 'admin/estado-habitacion',
    loadComponent: () => import('./paginas/administrador/estado-habitacion/estado-habitacion').then(m => m.EstadoHabitacion)
  },

  {
    path: 'admin/agregar-habitacion',
    loadComponent: () => import('./paginas/administrador/agregar-habitacion/agregar-habitacion').then(m => m.AgregarHabitacion)
  },

  {
    path: 'admin/eliminar-habitacion',
    loadComponent: () => import('./paginas/administrador/eliminar-habitacion/eliminar-habitacion').then(m => m.EliminarHabitacion)
  },

  // Ruta 404
  {
    path: '**',
    loadComponent: () => import('./no-encontrado/no-encontrado').then(m => m.NoEncontradoComponent)
  }
];