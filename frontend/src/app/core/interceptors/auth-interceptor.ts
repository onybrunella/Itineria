import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const token = auth.getToken();
  const isBackend = req.url.includes('localhost:8080');
  const isAuthApi = req.url.includes('/api/auth/');

  if (token && isBackend) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isBackend && !isAuthApi && err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
