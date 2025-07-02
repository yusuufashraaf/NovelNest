import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-to-cart',
  standalone: true,
  templateUrl: './add-to-cart.html',
  styleUrls: ['./add-to-cart.css'],
})
export class AddToCart {
  @Input() productId!: string;

  constructor(private cartService: CartService) {}

  addToCart() {
    if (!this.productId) return;
    this.cartService.addToCart(this.productId, 1).subscribe({
      // update cart icon simultaneously
      next: (res) => {
        const updatedCart = this.cartService.cart();
        this.cartService.cart.set({
          ...updatedCart,
          totalQuantity: res.data.totalQuantity,
        });
        // show success message with sweetalert2
        Swal.fire({
          title: 'Added to cart!',
          icon: 'success',
        });
      },
      error: () => {
        Swal.fire({
          // show error message with sweetalert2
          title: 'Failed to add to cart.',
          icon: 'error',
        });
      },
    });
  }
}
