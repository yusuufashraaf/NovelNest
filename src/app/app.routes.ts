import { Routes } from '@angular/router';
import { BrowseBooks } from './components/browse-books/browse-books';
import { Cart } from './components/cart/cart';
import { ContactUs } from './components/contact-us/contact-us';
import { CheckOut } from './components/check-out/check-out';
import { PaymentSuccess } from './components/payment-success/payment-success';
import { PaymentError } from './components/payment-error/payment-error';
import { Dashboard } from './components/dashboard/dashboard';
import { ThankYou } from './components/thank-you/thank-you';
import { UserProfile } from './components/user-profile/user-profile';
import { Wishlist } from './components/wishlist/wishlist';
import { PurchasedBooks } from './components/user-profile/profile-tabs/purchased-books/purchased-books';
import { PersonalInfo } from './components/user-profile/profile-tabs/personal-info/personal-info';
import { BookDetails } from './components/book-details/book-details';
import { PersonalReviews } from './components/user-profile/profile-tabs/personal-reviews/personal-reviews';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AuthLayout } from './components/Layouts/auth-layout/auth-layout';
import { MainLayout } from './components/Layouts/main-layout/main-layout';
import { VerifyEmail } from './components/verify-email/verify-email';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { VerifyCode } from './components/verify-code/verify-code';
import { ResetPassword } from './components/reset-password/reset-password';
import { AboutUs } from './components/about-us/about-us';
import { AllowedPagesGuard } from './Guards/allowed-guard';
import { SuccessPopupComponent } from './components/success-popup/success-popup';
import { OrdersHistory } from './components/user-profile/profile-tabs/orders-history/orders-history';

export const routes: Routes = [
  { path: '', redirectTo: 'Browse', pathMatch: 'full' },

  // Auth layout: no navbar
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      {
        path: 'verify-email/:otp',
        component: VerifyEmail,
        data: { renderMode: 'server' },
      },
      { path: 'forgot-password', component: ForgotPassword },
      { path: 'verify-code', component: VerifyCode },
      { path: 'reset-password', component: ResetPassword },
    ],
  },

  // Main layout: with navbar
  {
    path: '',
    component: MainLayout,
    canActivateChild: [AllowedPagesGuard],
    children: [
      { path: 'Browse', component: BrowseBooks },
      { path: 'Browse/:id', component: BookDetails , data: { renderMode: 'server' }},
      { path: 'Cart', component: Cart },
      { path: 'ContactUs', component: ContactUs },
      { path: 'checkout', component: CheckOut },
      { path: 'checkout/success-popup', component: SuccessPopupComponent },
      { path: 'success', component: PaymentSuccess },
      { path: 'err', component: PaymentError },
      { path: 'Wishlist', component: Wishlist },
      { path: 'about-us', component: AboutUs },
      { path: 'thank-you', component: ThankYou },
      { path: 'dashboard', component: Dashboard },
      {
        path: 'profile',
        component: UserProfile,
        children: [
          { path: 'purchased', component: PurchasedBooks },
          { path: 'reviews', component: PersonalReviews },
          { path: 'info', component: PersonalInfo },
          {path: 'orders', component: OrdersHistory},
          { path: '', redirectTo: 'purchased', pathMatch: 'full' },
        ],
      },
    ],
  },

  // Wildcard
  { path: '**', redirectTo: 'Browse' },
];
