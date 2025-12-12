import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { map, take } from 'rxjs/operators';

export const administradorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  return authService.userData$.pipe(
    take(1),
    map(userData => {
      if (userData && userData.rol === 'administrador') {
        // Usuario es administrador, permitir acceso
        return true;
      } else {
        // No es administrador, redirigir
        console.log('Acceso denegado: Requiere permisos de administrador');
        
        if (userData) {
          // Si está autenticado pero no es admin, redirigir al dashboard de cliente
          router.navigate(['/cliente/dashboard']);
        } else {
          // Si no está autenticado, redirigir al login
          router.navigate(['/auth/login']);
        }
        
        return false;
      }
    })
  );
};