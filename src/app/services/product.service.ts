import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Product {
  private baseUrl = 'http://localhost:5000/api/v1/products';
  constructor(private http: HttpClient) {}

  getAllProducts(params: any): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  getGenres(): Observable<{ genres: string[] }> {
    return this.http.get<{ genres: string[] }>(`${this.baseUrl}/genres`);
  }

  getAuthors(): Observable<{ authors: string[] }> {
    return this.http.get<{ authors: string[] }>(`${this.baseUrl}/authors`);
  }
}
