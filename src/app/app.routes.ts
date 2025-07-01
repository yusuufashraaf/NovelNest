import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { BrowseBooks } from './components/browse-books/browse-books';
import { Cart } from './components/cart/cart';
import { ContactUs } from './components/contact-us/contact-us';
import { CheckOut } from './components/check-out/check-out';
import { PaymentSuccess } from './components/payment-success/payment-success';
import { PaymentError } from './components/payment-error/payment-error';
import { ThankYou } from './components/thank-you/thank-you';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  { path: 'Browse', component: BrowseBooks },
  { path: 'Cart', component: Cart },
  { path: 'ContactUs', component: ContactUs },
  {path:'checkout',component:CheckOut},
  { path: 'success', component: PaymentSuccess },
  { path: 'err', component: PaymentError },
  {path:'thank-you',component:ThankYou}
];
