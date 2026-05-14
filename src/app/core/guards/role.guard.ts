import { Router, type CanActivateFn } from '@angular/router';
import { FacadeService } from '../services/facade.service';
import { inject } from '@angular/core';

export function roleGuard(allowedRoles: string[]): CanActivateFn {

  // Retornamos la función real que Angular ejecutará en la puerta
  return () => {
    // Usamos inject() para traer nuestros servicios sin necesitar un constructor
    const facadeService = inject(FacadeService);
    const router = inject(Router);

    // 1. Obtenemos el rol actual del usuario desde tu servicio
    // (Ajusta esta línea dependiendo de cómo guardes tú el usuario/rol)
    const userRole = facadeService.userRole();

    // 2. Si no hay usuario logueado, lo mandamos al Login directo
    if (!userRole) {
      return router.createUrlTree(['/auth/login']);
    }

    // 3. Verificamos si el rol del usuario está en la lista VIP
    if (allowedRoles.includes(userRole)) {
      return true; // ¡Las puertas se abren!
    }

    // 4. Si está logueado pero NO tiene permiso (ej. un alumno queriendo entrar a /admin)
    // Lo mandamos a una página de "No Autorizado" o a su propio dashboard
    if(userRole === 'alumno'){
      return router.createUrlTree(['/home/student/classes']);
    }
    if(userRole === 'maestro'){
      return router.createUrlTree(['/home/teacher/subjects']);
    }
    if(userRole === 'administrador'){
      return router.createUrlTree(['/home/admin/validation']);
    }

    return false; // En caso de que no se cumpla ninguna condición

  };
}
