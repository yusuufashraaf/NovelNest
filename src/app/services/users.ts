import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError, of } from 'rxjs';

// Define your User interface (recommend putting in a separate file)
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
  __v?: number;
  // Optional fields based on your API response
  passwordChangedAt?: string;
  passwordResetCode?: string;
  passwordResetExpires?: string;
  passwordResetVerified?: boolean;
  lastPasswordResetVerifyAttempt?: string;
  lastEmailSentAt?: string;
}

interface ApiResponse {
  data: User[];
  // Add other response properties if they exist
}

@Injectable({
  providedIn: 'root'
})
export class Users {
  private readonly baseUrl = 'http://localhost:5000/api/v1/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    console.log('🔍 Fetching users from:', this.baseUrl);
    return this.http.get<ApiResponse>(this.baseUrl).pipe(
      tap(response => {
        console.log('📡 Raw users API response:', response);
        console.log('📊 Users data structure:', response?.data);
      }),
      map(response => {
        if (!response) {
          console.warn('⚠️ No response received from users API');
          return [];
        }
        if (!response.data) {
          console.warn('⚠️ No data property in users API response');
          return [];
        }
        if (!Array.isArray(response.data)) {
          console.warn('⚠️ Users data is not an array:', response.data);
          return [];
        }
        console.log('✅ Users data extracted successfully:', response.data.length, 'users');
        return response.data;
      }),
      catchError(error => {
        console.error('❌ Error in getAllUsers:', error);
        return of([]);
      })
    );
  }
}
