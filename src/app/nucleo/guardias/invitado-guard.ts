import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { map, take } from 'rxjs/operators';

export const invitadoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  return authService.userData$.pipe(
    take(1),
    map(userData => {
      // Si NO hay usuario autenticado, permitir acceso (es invitado)
      if (!userData) {
        console.log('✅ Guardia de Invitado: Usuario no autenticado, acceso permitido');
        return true;
      }

      // Si hay usuario autenticado, redirigir según su rol
      console.log('❌ Guardia de Invitado: Usuario ya autenticado, redirigiendo...');
      console.log('👤 Rol del usuario:', userData.rol);

      if (userData.rol === 'administrador') {
        router.navigate(['/admin/estado']);
      } else if (userData.rol === 'cliente') {
        router.navigate(['/cliente/dashboard']);
      } else {
        router.navigate(['/inicio']);
      }

      return false;
    })
  );
};