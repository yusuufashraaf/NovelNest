import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

let isErrorAlertShown = false;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (!isErrorAlertShown) {
        isErrorAlertShown = true;

        const status = err.status;
        let title = 'Error';
        let message = 'Something went wrong. Please try again.';

        switch (status) {
          case 400:
            title = 'Bad Request';
            message =
              err.error?.message || 'Invalid request sent to the server.';
            break;
          case 401:
            title = 'Unauthorized';
            message = err.error?.message || 'Please login to continue.';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            break;
          case 403:
            title = 'Forbidden';
            message = 'You do not have permission to access this resource.';
            break;
          case 404:
            title = 'Not Found';
            message = 'The requested resource was not found.';
            break;
          case 500:
            title = 'Server Error';
            message = 'An error occurred on the server.';
            break;
          default:
            if (err.error?.message) {
              message = err.error.message;
            }
            break;
        }

        Swal.fire({
          icon: 'error',
          title,
          text: message,
          confirmButtonText: 'OK',
        }).then(() => {
          isErrorAlertShown = false;

          // Navigate only for 401 errors
          if (status === 401) {
            router.navigate(['/login']);
          }
        });
      }

      return throwError(() => err);
    })
  );
};
