import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, of } from 'rxjs';

interface ProductApiResponse {
  data?: any[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class Product {
  private baseUrl = 'http://localhost:5000/api/v1/products';
  constructor(private http: HttpClient) {}

  getAllProducts(params: any): Observable<any> {
    console.log('🔍 Fetching products from:', this.baseUrl);
    return this.http.get<ProductApiResponse>(this.baseUrl, { params }).pipe(
      tap(response => {

      catchError(error => {

        return of({ data: [] });
      })
    })
    )}

  getGenres(): Observable<{ genres: string[] }> {
    return this.http.get<{ genres: string[] }>(`${this.baseUrl}/genres`);
  }

  getAuthors(): Observable<{ authors: string[] }> {
    return this.http.get<{ authors: string[] }>(`${this.baseUrl}/authors`);
  }

  createProduct(productData: any): Observable<any> {
    console.log('🔍 Creating product:', productData);
    return this.http.post<any>(this.baseUrl, productData).pipe(
      tap(response => {
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  updateProduct(productId: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${productId}`, productData).pipe(
      tap(response => {
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${productId}`).pipe(
      tap(response => {
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
