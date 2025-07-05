import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from './cart-item/cart-item';
import { CommonModule } from '@angular/common';

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
    this.cartService.updateAndValidateEntries();
    this.cartService.refreshCart();
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService
      .updateCartItem(productId, quantity)
      .subscribe(() => this.loadCart());
  }

  deleteItem(productId: string) {
    console.log(productId);

    this.cartService.deleteCartItem(productId).subscribe(() => this.loadCart());
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }
}
