import { Component, Input } from '@angular/core';
import { CartService } from '../../services/cart.service';

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
      next: () => {
        // Optionally show a success message or update cart icon
        alert('Added to cart!');
      },
      error: () => {
        alert('Failed to add to cart.');
      },
    });
  }
}
