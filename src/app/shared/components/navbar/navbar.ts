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
    // Don't call refresh methods in constructor
    // Wait for authentication check first
  }

  ngOnInit(): void {
    // Check authentication status first
    this.authService
      .fetchLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.data?.user) {
            this.isLoggedIn = true;
            this.userRole = res.data.user.role;

            // Only refresh cart and wishlist when user is authenticated
            this.cartService.refreshCart();
            this.wishlistService.refreshWishlist();
          } else {
            this.isLoggedIn = false;
            this.userRole = '';

            // Clear cart and wishlist when not authenticated
            this.cartService.cart.set({
              cartItems: [],
              totalPrice: 0,
              totalQuantity: 0,
            });
            this.wishlistService.wishlist.set({
              wishlistItems: [],
              totalQuantity: 0,
            });
          }
        },
        error: () => {
          this.isLoggedIn = false;
          this.userRole = '';

          // Clear cart and wishlist on error
          this.cartService.cart.set({
            cartItems: [],
            totalPrice: 0,
            totalQuantity: 0,
          });
          this.wishlistService.wishlist.set({
            wishlistItems: [],
            totalQuantity: 0,
          });
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
