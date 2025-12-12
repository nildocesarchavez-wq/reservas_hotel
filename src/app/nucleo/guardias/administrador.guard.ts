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
      // Verificar si hay datos de usuario
      if (!userData) {
        console.log('❌ Guardia de Administrador: Usuario no autenticado');
        router.navigate(['/auth/login']);
        return false;
      }

      // Verificar si el usuario es administrador
      if (userData.rol === 'administrador') {
        console.log('✅ Guardia de Administrador: Acceso permitido');
        return true;
      } else {
        console.log('❌ Guardia de Administrador: Usuario no tiene permisos');
        console.log('👤 Rol del usuario:', userData.rol);
        
        // Usuario autenticado pero no es admin, redirigir a su dashboard
        router.navigate(['/cliente/dashboard']);
        return false;
      }
    })
  );
};
