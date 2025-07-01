import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from './cart-item/cart-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItem],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((res) => {
      // Map backend fields to frontend expectations
      const transformedData = {
        cartItems: res.data.cartItems.map((item: any) => ({
          productId: item.productId,
          title: item.title,
          author: item.author,
          img: item.image, // map 'image' to 'img'
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subTotal, // map 'subTotal' to 'subtotal'
        })),
        totalPrice: res.data.totalPrice,
        totalQuantity: res.data.totalQuantity,
      };
      this.cartService.cart.set(transformedData);
    });
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService
      .updateCartItem(productId, quantity)
      .subscribe(() => this.loadCart());
  }

  deleteItem(productId: string) {
    this.cartService.deleteCartItem(productId).subscribe(() => this.loadCart());
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => this.loadCart());
  }
}
