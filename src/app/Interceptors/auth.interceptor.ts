import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

let isUnauthorizedAlertShown = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let token: string | null = null;

  if (typeof window !== 'undefined' && isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  // APIs that should be allowed without showing Unauthorized alerts
  const publicApis = [
    '/api/v1/books',
    '/api/v1/categories',
    '/api/v1/auth',
    '/api/v1/search',
  ];
  const isPublicRequest = publicApis.some((path) => req.url.includes(path));

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !isPublicRequest && !isUnauthorizedAlertShown) {
        isUnauthorizedAlertShown = true;

        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          Swal.fire({
            icon: 'warning',
            title: 'Unauthorized',
            text: 'Please login first to access this feature.',
            confirmButtonText: 'OK',
          }).then(() => {
            isUnauthorizedAlertShown = false;
            router.navigate(['/login']);
          });
        }
      }

      return throwError(() => err);
    })
  );
};
