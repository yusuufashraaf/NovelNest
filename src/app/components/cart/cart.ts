import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from './cart-item/cart-item';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItem, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartService = inject(CartService);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.refreshCart();
  }

  updateQuantity(productId: string, quantity: number) {
    if (!productId) {
      Swal.fire({
        title: 'Invalid Request',
        text: 'Product information is missing. Please refresh the page and try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (quantity < 1) {
      Swal.fire({
        title: 'Invalid Quantity',
        text: 'Quantity must be at least 1. Use the remove button to delete items.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.cartService.updateCartItem(productId, quantity).subscribe({
      next: () => {
        this.loadCart();
        // Optional success message for quantity updates
        Swal.fire({
          title: 'Updated!',
          text: 'Cart item quantity has been updated.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.handleUpdateError(error);
        this.loadCart(); // Refresh to show correct state
      },
    });
  }

  deleteItem(productId: string) {
    if (!productId) {
      Swal.fire({
        title: 'Invalid Request',
        text: 'Product information is missing. Please refresh the page and try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.cartService.deleteCartItem(productId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (error: HttpErrorResponse) => {
        this.handleDeleteError(error);
        this.loadCart(); // Refresh to show correct state
      },
    });
  }

  clearCart() {
    Swal.fire({
      title: 'Clear entire cart?',
      text: 'This will remove all items from your cart. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear cart',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.loadCart();
            Swal.fire({
              title: 'Cart Cleared!',
              text: 'All items have been removed from your cart.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (error: HttpErrorResponse) => {
            this.handleClearCartError(error);
          },
        });
      }
    });
  }

  private handleUpdateError(error: HttpErrorResponse) {
    let title = 'Update Failed';
    let message = 'Unable to update cart item. Please try again.';

    switch (error.status) {
      case 400:
        if (error.error?.message === 'Out of stock') {
          title = 'Insufficient Stock';
          message =
            "Sorry, there isn't enough stock available for the requested quantity.";
        } else if (error.error?.message === 'ProductId is required') {
          title = 'Missing Product Information';
          message =
            'Product information is missing. Please refresh the page and try again.';
        } else if (error.error?.message === 'Quantity must be at least 1') {
          title = 'Invalid Quantity';
          message =
            'Quantity must be at least 1. Use the remove button to delete items.';
        } else {
          message = error.error?.message || message;
        }
        break;
      case 404:
        if (error.error?.message === 'Cart not found') {
          title = 'Cart Not Found';
          message = 'Your cart could not be found. It may have expired.';
        } else if (error.error?.message === 'Item not found in cart') {
          title = 'Item Not Found';
          message =
            'This item is no longer in your cart. Your cart has been refreshed.';
        } else if (error.error?.message === 'Product not found') {
          title = 'Product Unavailable';
          message =
            'This product is no longer available and will be removed from your cart.';
        } else {
          title = 'Item Not Found';
          message =
            'The item could not be found. Your cart has been refreshed.';
        }
        break;
      case 401:
        title = 'Authentication Required';
        message = 'Please log in to update your cart.';
        break;
      case 500:
        title = 'Server Error';
        message =
          'Our servers are experiencing issues. Please try again in a moment.';
        break;
      default:
        if (error.error?.message) {
          message = error.error.message;
        }
        break;
    }

    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  private handleDeleteError(error: HttpErrorResponse) {
    let title = 'Delete Failed';
    let message = 'Unable to remove item from cart. Please try again.';

    switch (error.status) {
      case 400:
        title = 'Invalid Request';
        message =
          error.error?.message ||
          'Product information is missing. Please refresh the page and try again.';
        break;
      case 404:
        title = 'Cart Not Found';
        message = 'Your cart could not be found. It may have expired.';
        break;
      case 401:
        title = 'Authentication Required';
        message = 'Please log in to modify your cart.';
        break;
      case 500:
        title = 'Server Error';
        message =
          'Our servers are experiencing issues. Please try again in a moment.';
        break;
      default:
        if (error.error?.message) {
          message = error.error.message;
        }
        break;
    }

    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  private handleClearCartError(error: HttpErrorResponse) {
    let title = 'Clear Cart Failed';
    let message = 'Unable to clear your cart. Please try again.';

    switch (error.status) {
      case 404:
        title = 'Cart Not Found';
        message =
          'Your cart could not be found. It may have already been cleared.';
        break;
      case 401:
        title = 'Authentication Required';
        message = 'Please log in to clear your cart.';
        break;
      case 500:
        title = 'Server Error';
        message =
          'Our servers are experiencing issues. Please try again in a moment.';
        break;
      default:
        if (error.error?.message) {
          message = error.error.message;
        }
        break;
    }

    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
}
