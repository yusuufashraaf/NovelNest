import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface cartData {
  cartItems: {
    productId: string;
    title: string;
    author: string;
    img: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  totalPrice: number;
  totalQuantity: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:5000/api/v1/cart';
  private http = inject(HttpClient);
  cart = signal<cartData>({
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0,
  });

  // get cart per user
  getCart(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // add item to cart
  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(this.baseUrl, { productId, quantity });
  }

  // Update cart item
  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${productId}`, { quantity });
  }

  // delete item from cart
  deleteCartItem(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }

  // clear cart
  clearCart(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }
}
