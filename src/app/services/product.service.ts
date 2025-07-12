import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root',
})
export class Product {
  private rootUrl = `${environment.apiUrl}`;

  private baseUrl = `${this.rootUrl}/api/v1/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(params: any): Observable<any> {
    return this.http
      .get(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
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
    return this.http
      .get(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http
      .post(`${this.baseUrl}`, productData, {
        headers: {
          // No Content-Type! Let browser set it with boundary
        },
        reportProgress: true,
        observe: 'response',
      })
      .pipe(
        catchError((error) => {
          // Extract meaningful error message from server response
          let errorMsg = 'Failed to add product';
          if (error.error?.message) {
            errorMsg = error.error.message;
          } else if (error.error?.errors?.length) {
            errorMsg = error.error.errors[0].msg;
          }
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  updateProduct(id: string, productData: FormData): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/${id}`, productData)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getGenres(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/genres`)
      .pipe(catchError(this.handleError));
  }

  getAuthors(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/authors`)
      .pipe(catchError(this.handleError));
  }
}
