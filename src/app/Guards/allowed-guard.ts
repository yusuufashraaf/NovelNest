import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const AllowedPagesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  const path = state.url.split('?')[0];

  const isAllowed = [
    /^\/home$/,
    /^\/Browse$/,
    /^\/Browse\/[^\/]+$/,
    /^\/about-us$/,
    /^\/thank-you$/,
  ].some((pattern) => pattern.test(path));

  const isBrowser = isPlatformBrowser(platformId);
  const isLoggedIn = isBrowser && !!localStorage.getItem('token');

  if (isAllowed || isLoggedIn) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
