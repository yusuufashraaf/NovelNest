import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface wishlistData {
  wishlistItems: {
    productId: string;
    title: string;
    author: string;
    img: string;
  }[];
  totalQuantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private baseUrl = 'http://localhost:5000/api/v1/wishlist';
  private http = inject(HttpClient);
  wishlist = signal<wishlistData>({
    wishlistItems: [],
    totalQuantity: 0,
  });

  // get wishlist per user
  getWishlist(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // add item to wishlist
  addToWishlist(productId: string): Observable<any> {
    return this.http.post(this.baseUrl, { productId });
  }

  // delete item from wishlist
  deleteFromWishlist(productId: string): Observable<any> {
    return this.http.delete(this.baseUrl, { body: { productId } });
  }
}
