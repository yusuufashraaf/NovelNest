import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CartItemEntry {
  productId: string;
  addedAt: Date;
  expiresAt: Date;
}

interface cartData {
  cartItems: {
    productId: string;
    title: string;
    author: string;
    img: string;
    price: number;
    quantity: number;
    subtotal: number;
    cartItemEntry: CartItemEntry[];
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
  private expiryDuration = 20 * 1000; // 20 seconds

  // cart signal
  cart = signal<cartData>({
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0,
  });

  constructor() {
    this.refreshCart();
    setInterval(() => {
      if (this.updateAndValidateEntries()) {
        this.refreshCart();
      }
    }, 5000); // every 5 seconds
  }

  refreshCart(): void {
    this.getCart().subscribe((res) => {
      if (res && res.data && res.data.cartItems) {
        const transformedData: cartData = {
          cartItems: res.data.cartItems.map((item: any) => ({
            productId: item.productId,
            title: item.title,
            author: item.author,
            img: item.image,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subTotal,
            cartItemEntry: (item.itemEntries || []).map((entry: any) => ({
              productId: entry.productId,
              addedAt: new Date(entry.addedAt),
              expiresAt: new Date(entry.expiresAt),
              _id: entry._id,
            })),
          })),
          totalPrice: res.data.totalPrice,
          totalQuantity: res.data.totalQuantity,
        };
        this.cart.set(transformedData);
      } else {
        this.cart.set({
          cartItems: [],
          totalPrice: 0,
          totalQuantity: 0,
        });
      }
    });
  }

  // get cart per user
  getCart(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // add item to cart
  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post(this.baseUrl, {
      productId,
      quantity,
      expiryDuration: this.expiryDuration,
    });
  }

  // Update cart item
  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${productId}`, {
      quantity,
      expiryDuration: this.expiryDuration,
    });
  }

  // delete item from cart
  deleteCartItem(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }

  // clear cart
  clearCart(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  // update invalid cartItems entries
  updateAndValidateEntries(): boolean {
    const currentCart = this.cart();
    let updated = false;

    currentCart.cartItems.forEach((item) => {
      const validEntries = item.cartItemEntry.filter(
        (entry) => entry.expiresAt > new Date()
      );

      if (validEntries.length !== item.cartItemEntry.length) {
        updated = true;
        const newQuantity = validEntries.length;

        if (newQuantity > 0) {
          this.updateCartItem(item.productId, newQuantity).subscribe();
        } else {
          this.deleteCartItem(item.productId).subscribe();
        }
      }
    });
    return updated;
  }
}
