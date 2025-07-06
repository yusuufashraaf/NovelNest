import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = 'http://localhost:5000/api/v1';

  http = inject(HttpClient);
  getMyOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/my-orders`);
  }
}
