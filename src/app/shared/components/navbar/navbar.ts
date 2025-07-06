import { Component, inject, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Search } from "../search/search";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Search],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar implements OnDestroy {
  isLoggedIn = false;

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    window.location.href = '/login';
  }
}
