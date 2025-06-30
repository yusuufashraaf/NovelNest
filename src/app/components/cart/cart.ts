import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from './cart-item/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItem],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  totalPrice = this.cartService
    .cart()
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);
}
