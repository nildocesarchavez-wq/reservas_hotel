import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { map, take } from 'rxjs/operators';

export const clienteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AutenticacionService);
  const router = inject(Router);

  return authService.userData$.pipe(
    take(1),
    map(userData => {
      // Verificar si hay datos de usuario
      if (!userData) {
        console.log('❌ Guardia de Cliente: Usuario no autenticado');
        router.navigate(['/auth/login']);
        return false;
      }

      // Verificar si el usuario es cliente
      if (userData.rol === 'cliente') {
        console.log('✅ Guardia de Cliente: Acceso permitido');
        return true;
      } else if (userData.rol === 'administrador') {
        console.log('❌ Guardia de Cliente: Administrador intentando acceder a ruta de cliente');
        
        // Administrador intentando acceder a rutas de cliente, redirigir a su panel
        router.navigate(['/admin/estado']);
        return false;
      } else {
        console.log('❌ Guardia de Cliente: Rol desconocido');
        router.navigate(['/inicio']);
        return false;
      }
    })
  );
};