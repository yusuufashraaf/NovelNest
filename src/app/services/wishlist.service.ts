import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
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
    private rootUrl = `${environment.apiUrl}`;
  
  private baseUrl = `${this.rootUrl}/api/v1/wishlist`;
  private http = inject(HttpClient);

  // wishlist signal
  wishlist = signal<wishlistData>({
    wishlistItems: [],
    totalQuantity: 0,
  });

  // constructor
  constructor() {}

  // refresh wishlist
  refreshWishlist(): void {
    this.getWishlist().subscribe({
      next: (res) => {
        if (res && res.data && res.data.wishlistItems) {
          const transformedData: wishlistData = {
            wishlistItems: res.data.wishlistItems.map((item: any) => ({
              productId: item.productId,
              title: item.title,
              author: item.author,
              img: item.image,
            })),
            totalQuantity: res.data.totalQuantity,
          };
          this.wishlist.set(transformedData);
        } else {
          this.wishlist.set({
            wishlistItems: [],
            totalQuantity: 0,
          });
        }
      },
      // },
      // error: (err) => {
      //   console.warn(err);
      //   this.wishlist.set({
      //     wishlistItems: [],
      //     totalQuantity: 0,
      //   });
      // },
    });
  }

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
