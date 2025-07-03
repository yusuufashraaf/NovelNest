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
import { PurchasedBooks } from './components/user-profile/profile-tabs/purchased-books/purchased-books';
import { PersonalInfo } from './components/user-profile/profile-tabs/personal-info/personal-info';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  { path: 'Browse', component: BrowseBooks },
  { path: 'Cart', component: Cart },
  { path: 'ContactUs', component: ContactUs },
  { path: 'checkout', component: CheckOut },
  { path: 'success', component: PaymentSuccess },
  { path: 'err', component: PaymentError },
  {path:'dashboard',component:Dashboard},
  { path: 'thank-you', component: ThankYou },
  {
    path: 'profile',
    component: UserProfile,
    children: [
      { path: 'purchased', component: PurchasedBooks },
      {path:'info',component:PersonalInfo},
      { path: '', redirectTo: 'purchased', pathMatch: 'full' }, 
    ],
  },
];
