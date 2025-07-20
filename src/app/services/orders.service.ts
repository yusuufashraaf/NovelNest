import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private rootUrl = `${environment.apiUrl}`;

  private baseUrl = `${this.rootUrl}/api/v1`;

  http = inject(HttpClient);
  getMyOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/my-orders`);
  }

    getAllMyOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/user-orders`);
  }
}
