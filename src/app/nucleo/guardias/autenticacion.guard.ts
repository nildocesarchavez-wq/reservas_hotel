import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { map, take } from 'rxjs/operators';

export const autenticacionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        // Usuario autenticado, permitir acceso
        console.log('✅ Guardia de Autenticación: Usuario autenticado');
        return true;
      } else {
        // No autenticado, redirigir al login
        console.log('❌ Guardia de Autenticación: Acceso denegado, redirigiendo al login');
        console.log('📍 Ruta solicitada:', state.url);
        
        // Guardar la URL solicitada para redirigir después del login
        sessionStorage.setItem('redirectUrl', state.url);
        
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};