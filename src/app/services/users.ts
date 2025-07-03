import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

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
  return this.http.get<ApiResponse>(this.baseUrl).pipe(
    map(response => response.data), // Extract the data array
    tap(data => console.log('Users data:', data))
  );
}
}