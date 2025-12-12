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
        return true;
      } else {
        // No autenticado, redirigir al login
        console.log('Acceso denegado: No hay sesión activa');
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};