import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environment';
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  product: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
    private rootUrl = `${environment.apiUrl}`;
  private apiUrl = `${this.rootUrl}/api/v1/brands`;

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      params: { page, limit }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAllWithoutPagination(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  add(brand: { name: string; slug: string; product: string }): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrl, brand).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, brand: { name: string; slug: string; product: string }): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/${id}`, brand).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
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
