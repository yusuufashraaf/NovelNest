import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private rootUrl = `${environment.apiUrl}`;

  getAllWithoutPagination() {
    throw new Error('Method not implemented.');
  }

  constructor(private router: Router, private http: HttpClient) {}

  getProduct(Productid: String): Observable<any> {
    return this.http.get<any>(
      `${this.rootUrl}/api/v1/products/${Productid}`
    );
  }
}
