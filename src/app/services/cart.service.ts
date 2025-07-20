import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environment';

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
      private rootUrl = `${environment.apiUrl}`;
  private baseUrl = `${this.rootUrl}/api/v1/cart`;
  private http = inject(HttpClient);

  // cart signal
  cart = signal<cartData>({
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0,
  });

  constructor() {}

  refreshCart(): void {
    this.getCart().subscribe({
      next: (res) => {
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
      },
      error: (error: HttpErrorResponse) => {
        this.handleCartRefreshError(error);
        // Set empty cart on error to prevent UI issues
        this.cart.set({
          cartItems: [],
          totalPrice: 0,
          totalQuantity: 0,
        });
      },
    });
  }

  // get cart per user
  getCart(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(catchError(this.handleError));
  }

  // add item to cart
  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http
      .post(this.baseUrl, {
        productId,
        quantity,
      })
      .pipe(catchError(this.handleError));
  }

  // Update cart item
  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http
      .patch(`${this.baseUrl}/${productId}`, {
        quantity,
      })
      .pipe(catchError(this.handleError));
  }

  // delete item from cart
  deleteCartItem(productId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${productId}`)
      .pipe(catchError(this.handleError));
  }

  // delete cart entry by entry id
  deleteCartEntry(entryId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/entry/${entryId}`)
      .pipe(catchError(this.handleError));
  }

  // clear cart
  clearCart(): Observable<any> {
    return this.http.delete(this.baseUrl).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    // Let the component handle the specific error
    return throwError(() => error);
  };

  private handleCartRefreshError(error: HttpErrorResponse) {
    // Only show error for cart refresh if it's not a 401 (handled by interceptor)
    if (error.status !== 401) {
      let title = 'Cart Loading Error';
      let message = 'Unable to load your cart. Please try refreshing the page.';

      switch (error.status) {
        case 0:
          title = 'Connection Error';
          message =
            'Unable to connect to the server. Please check your internet connection.';
          break;
        case 500:
          title = 'Server Error';
          message =
            'Our servers are experiencing issues. Your cart will be restored once the issue is resolved.';
          break;
        default:
          if (error.error?.message) {
            message = error.error.message;
          }
          break;
      }

      // Only show the error if there's no existing alert shown
      // to prevent multiple error popups
      if (!document.querySelector('.swal2-container')) {
        Swal.fire({
          title,
          text: message,
          icon: 'error',
          confirmButtonText: 'OK',
          backdrop: false, // Don't block the UI completely
        });
      }
    }
  }
}
