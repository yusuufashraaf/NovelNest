import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ✅ Static routes to prerender
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'Browse', renderMode: RenderMode.Prerender },
  { path: 'about-us', renderMode: RenderMode.Prerender },
  { path: 'thank-you', renderMode: RenderMode.Prerender },
  { path: 'ContactUs', renderMode: RenderMode.Prerender },
  { path: 'Cart', renderMode: RenderMode.Prerender },
  { path: 'Wishlist', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Prerender },
  { path: 'checkout', renderMode: RenderMode.Prerender },
  { path: 'checkout/success-popup', renderMode: RenderMode.Prerender },
  { path: 'success', renderMode: RenderMode.Prerender },
  { path: 'err', renderMode: RenderMode.Prerender },

  // ✅ Dynamic routes (handled by SSR only, not prerendered)
  { path: 'Browse/:id', renderMode: RenderMode.Server },
  { path: 'verify-email/:otp', renderMode: RenderMode.Server },

  // ✅ Auth and profile pages (SSR handled, optional prerendering if wanted)
  { path: 'login', renderMode: RenderMode.Server },
  { path: 'register', renderMode: RenderMode.Server },
  { path: 'forgot-password', renderMode: RenderMode.Server },
  { path: 'verify-code', renderMode: RenderMode.Server },
  { path: 'reset-password', renderMode: RenderMode.Server },
  { path: 'profile', renderMode: RenderMode.Server },
  { path: 'profile/purchased', renderMode: RenderMode.Server },
  { path: 'profile/reviews', renderMode: RenderMode.Server },
  { path: 'profile/info', renderMode: RenderMode.Server },

  // ✅ Wildcard fallback for SSR (optional)
  { path: '**', renderMode: RenderMode.Server }
];
