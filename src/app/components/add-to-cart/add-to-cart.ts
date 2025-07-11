import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  templateUrl: './add-to-cart.html',
  styleUrls: ['./add-to-cart.css'],
})
export class AddToCart {
  @Input() productId!: string;
  @Output() removeFromWishlist = new EventEmitter<string>();

  constructor(private cartService: CartService) {}

  addToCart() {
    if (!this.productId) {
      Swal.fire({
        title: 'Invalid Product',
        text: 'Product information is missing. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.cartService.addToCart(this.productId, 1).subscribe({
      next: (res) => {
        this.cartService.refreshCart();
        // show success message with sweetalert2
        Swal.fire({
          title: 'Added to cart!',
          text: 'Item has been successfully added to your cart.',
          icon: 'success',
        }).then(() => {
          this.removeFromWishlist.emit(this.productId);
        });
      },
      error: (error: HttpErrorResponse) => {
        this.handleAddToCartError(error);
      },
    });
  }

  private handleAddToCartError(error: HttpErrorResponse) {
    let title = 'Failed to Add Item';
    let message = 'Unable to add item to cart. Please try again.';
    let icon: 'error' | 'warning' = 'error';

    switch (error.status) {
      case 404:
        title = 'Product Not Found';
        message =
          'This product is no longer available. It may have been removed from our catalog.';
        icon = 'warning';
        break;
      case 400:
        if (error.error?.message === 'Out of stock') {
          title = 'Out of Stock';
          message =
            'Sorry, this item is currently out of stock. Please check back later or try a different product.';
          icon = 'warning';
        } else {
          title = 'Invalid Request';
          message =
            error.error?.message ||
            'There was an issue with your request. Please try again.';
        }
        break;
      case 401:
        title = 'Authentication Required';
        message = 'Please log in to add items to your cart.';
        break;
      case 500:
        title = 'Server Error';
        message =
          'Our servers are experiencing issues. Please try again in a moment.';
        break;
      default:
        // Use the error message from the backend if available
        if (error.error?.message) {
          message = error.error.message;
        }
        break;
    }

    Swal.fire({
      title,
      text: message,
      icon,
      confirmButtonText: 'OK',
    });
  }
}
