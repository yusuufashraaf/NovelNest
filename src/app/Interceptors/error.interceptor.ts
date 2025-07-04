// error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import Swal from 'sweetalert2';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // Clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // SweetAlert
        Swal.fire({
          icon: 'warning',
          title: 'Unauthorized',
          text: 'Please login to continue.',
          confirmButtonText: 'Login',
        }).then(() => {
        });
      }
      return throwError(() => err);
    })
  );
};
