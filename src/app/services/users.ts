import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environment';
export interface User {
  isVerified: boolean;
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  data: User[];
}

@Injectable({
  providedIn: 'root'
})
export class Users {
    private rootUrl = `${environment.apiUrl}`;
  
  private readonly baseUrl = `${this.rootUrl}/api/v1/users`;

 constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    
    return this.http.get<User[] | { data: User[] }>(this.baseUrl).pipe(
      tap(response => {
        //console.log('📡 Raw users API response:', response);
      }),
      map(response => {
        // If response is already an array of users
        if (Array.isArray(response)) {
          return response;
        }
        
        // If response is wrapped in data property
        if (response && 'data' in response && Array.isArray(response.data)) {
          return response.data;
        }
        
        return [];
      }),
      catchError(error => {
        return of([]);
      })
    );
  }
}