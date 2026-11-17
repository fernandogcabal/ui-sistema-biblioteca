import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.isLoggedIn() ? authService.getToken() : null;

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLoginRequest = /\/login(?:\?|$)/.test(req.url);

      if (error.status === 401 && !isLoginRequest && token) {
        const currentToken = authService.getToken();

        if (currentToken === token) {
          authService.logout();
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    }),
  );
};
