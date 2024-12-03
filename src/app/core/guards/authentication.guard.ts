import { CanMatchFn, Router } from '@angular/router';
import { SecurityServiceImpl } from '../services/impl/security.service.impl';
import { inject } from '@angular/core';

export const AuthenticationGuard: CanMatchFn = (route, segments) => {
  const securityService = inject(SecurityServiceImpl);
  const router = inject(Router);

  if (securityService.isAuthenticated) {
    return true; 
  } else {
    router.navigateByUrl('/login'); 
    return false; 
  }
};
