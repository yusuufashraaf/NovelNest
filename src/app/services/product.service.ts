import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private baseUrl = 'http://localhost:5000/api/v1/products';

  constructor(private http: HttpClient) {}

  getAllProducts(params: any): Observable<any> {
    return this.http.get(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, productData).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, productData).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.baseUrl}/genres`).pipe(
      catchError(this.handleError)
    );
  }

  getAuthors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/authors`).pipe(
      catchError(this.handleError)
    );
  }
}
