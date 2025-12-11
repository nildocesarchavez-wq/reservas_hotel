import { CanActivateFn } from '@angular/router';

export const administradorGuard: CanActivateFn = (route, state) => {
    return true;
};
