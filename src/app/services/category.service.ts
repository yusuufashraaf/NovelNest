import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/v1/categories';

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10): Observable<any> {
    console.log('CategoryService.getAll called with page:', page, 'limit:', limit);
    console.log('API URL:', this.apiUrl);
    return this.http.get<any>(this.apiUrl, {
      params: { page, limit }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAllWithoutPagination(): Observable<any> {
    console.log('CategoryService.getAllWithoutPagination called');
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  add(category: { name: string; slug: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, category: { name: string; slug: string }): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('CategoryService error:', error);
    let errorMsg = 'An unknown error occurred!';
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      errorMsg = error.error.message;
    } else if (error.message) {
      errorMsg = error.message;
    }
    return throwError(() => errorMsg);
  }
}
