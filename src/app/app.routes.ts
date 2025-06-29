import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { BrowseBooks } from './components/browse-books/browse-books';
import { Cart } from './components/cart/cart';

export const routes: Routes = [
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  { path: 'Home', component: Home },
  { path: 'Browse', component: BrowseBooks },
  { path: 'Cart', component: Cart },
];
