import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment';
export interface Order {
  _id: string;
  userId: string;
  books: {
    book: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  orderNumber: string;
  paypalOrderId?: string;
  transactionRef?: string;
  createdAt: Date;
  updatedAt?: Date;
  paidAt?: Date;
  paypalCaptureId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
        private rootUrl = `${environment.apiUrl}`;
  
  private apiUrl = `${this.rootUrl}/api/v1/orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(page = 1, limit = 100): Observable<{ data: Order[]; total: number }> {
    return this.http.get<{ data: Order[]; total: number }>(this.apiUrl, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getRecentOrders(limit = 5): Observable<Order[]> {
    return this.http.get<{ data: Order[]; total: number }>(this.apiUrl, {
      params: { limit: limit.toString(), sort: '-createdAt' }
    }).pipe(
      map(res => res.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      errorMsg = error.error.message;
    } else if (error.message) {
      errorMsg = error.message;
    }
    return throwError(() => errorMsg);
  }
}
