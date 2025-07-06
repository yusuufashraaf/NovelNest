import { Routes } from '@angular/router';
import { Home } from './components/home/home';
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
import { AuthGuard } from './Guards/auth-guard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { AboutUs } from './components/about-us/about-us';

import { AuthLayout } from './components/Layouts/auth-layout/auth-layout';
import { MainLayout } from './components/Layouts/main-layout/main-layout';
export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'Browse', component: BrowseBooks },
  { path: 'Cart', component: Cart },
  { path: 'ContactUs', component: ContactUs },
  { path: 'checkout', component: CheckOut },
  { path: 'success', component: PaymentSuccess },
  { path: 'err', component: PaymentError },
  { path: 'dashboard', component: Dashboard },
  { path: 'Wishlist', component: Wishlist },
  {path:'dashboard',component:Dashboard},
  { path: 'about-us', component: AboutUs },
  { path: 'thank-you', component: ThankYou },
  // Auth layout: no navbar
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'dashboard', component: Dashboard },
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Main layout: with navbar
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'Browse', component: BrowseBooks },
      { path: 'Cart', component: Cart },
      { path: 'ContactUs', component: ContactUs },
      { path: 'checkout', component: CheckOut },
      { path: 'success', component: PaymentSuccess },
      { path: 'err', component: PaymentError },
      { path: 'Wishlist', component: Wishlist },
      { path: 'about-us', component: AboutUs },
      { path: 'thank-you', component: ThankYou },
      {
        path: 'profile',
        component: UserProfile,
        children: [
          { path: 'purchased', component: PurchasedBooks },
          { path: 'reviews', component: PersonalReviews },
          { path: 'info', component: PersonalInfo },
          { path: '', redirectTo: 'purchased', pathMatch: 'full' },
        ],
      },
    ],
  },

  // Wildcard
  { path: '**', redirectTo: 'login' },
];
