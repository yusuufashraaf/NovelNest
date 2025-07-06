import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;

  if (
    typeof window !== 'undefined' &&
    typeof localStorage !== 'undefined' &&
    isPlatformBrowser(platformId)
  ) {
    token = localStorage.getItem('token');
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('token');
          Swal.fire({
            icon: 'warning',
            title: 'Unauthorized',
            text: 'Please login first to access this feature.',
            confirmButtonText: 'OK',
          }).then(() => {
            router.navigate(['/login']);
          });
        }
      }
      return throwError(() => err);
    })
  );
};
