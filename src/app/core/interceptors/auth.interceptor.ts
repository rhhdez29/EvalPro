import type { HttpInterceptorFn } from '@angular/common/http';
import { FacadeService } from '../services/facade.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const facadeService = inject(FacadeService);
  const token = facadeService.userToken();
  // Si hay un token, clonamos la petición y le pegamos la cabecera
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
    return next(clonedRequest); // Dejamos que la petición continúe su viaje
  }

  // Si no hay token (ej. al hacer login o registro), pasa normal
  return next(req);
};
