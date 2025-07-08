import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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
  private readonly baseUrl = 'http://localhost:5000/api/v1/users';

 constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    console.log('🔍 Fetching users from:', this.baseUrl);
    
    return this.http.get<User[] | { data: User[] }>(this.baseUrl).pipe(
      tap(response => {
        //console.log('📡 Raw users API response:', response);
      }),
      map(response => {
        // If response is already an array of users
        if (Array.isArray(response)) {
          console.log('✅ Received direct array of users:', response.length);
          return response;
        }
        
        // If response is wrapped in data property
        if (response && 'data' in response && Array.isArray(response.data)) {
          console.log('✅ Received wrapped users array:', response.data.length);
          return response.data;
        }
        
        console.warn('⚠️ Unexpected response format:', response);
        return [];
      }),
      catchError(error => {
        console.error('❌ Error fetching users:', error);
        return of([]);
      })
    );
  }
}