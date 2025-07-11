import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Search } from '../search/search';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Search],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy, OnInit {
  isLoggedIn = false;
  userRole: string = '';
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {
    this.wishlistService.refreshWishlist();
    this.cartService.refreshCart();
  }
  ngOnInit(): void {
    this.authService.fetchLoggedInUser().subscribe({
      next: (res) => {
        this.userRole = res?.data?.user?.role;
      },
      error: () => {
        this.userRole = '';
      },
    });
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
