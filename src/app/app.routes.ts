import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { BrowseBooks } from './components/browse-books/browse-books';
import { ContactUs } from './components/contact-us/contact-us';
import { CheckOut } from './components/check-out/check-out';
import { PaymentSuccess } from './components/payment-success/payment-success';
import { PaymentError } from './components/payment-error/payment-error';

export const routes: Routes = [
  {path:'checkout',component:CheckOut},
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  { path: 'Browse', component: BrowseBooks },
  { path: 'ContactUs', component: ContactUs },
  { path: 'success', component: PaymentSuccess },
  { path: 'err', component: PaymentError }
];
