import { CanActivateFn } from '@angular/router';

export const autenticacionGuard: CanActivateFn = (route, state) => {
    return true;
};
