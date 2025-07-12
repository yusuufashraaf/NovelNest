import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environment';
export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
    private rootUrl = `${environment.apiUrl}`;
  
  private apiUrl = `${this.rootUrl}/api/v1/subcategories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Subcategory[]> {
    return this.http.get<{ data: Subcategory[] }>(this.apiUrl).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  getByCategory(categoryId: string): Observable<Subcategory[]> {
    return this.http.get<{ data: Subcategory[] }>(`${this.apiUrl}/category/${categoryId}`).pipe(
      map(res => res.data || []),
      catchError(this.handleError)
    );
  }

  add(subcategory: { name: string; slug: string; category: string }): Observable<Subcategory> {
    return this.http.post<Subcategory>(this.apiUrl, subcategory).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, subcategory: { name: string; slug: string; category: string }): Observable<Subcategory> {
    return this.http.put<Subcategory>(`${this.apiUrl}/${id}`, subcategory).pipe(
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
