import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/v1/users';

  constructor(private http: HttpClient) {}

  loginUser(credentials: { email: string; password: string }) {
    return this.http
      .post<{ message: string; user: User }>(
        `${this.baseUrl}/login`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.user.token || '');
          }
        })
      );
  }

  /** Returns cached user, or null if not in browser or not logged in */
  getCachedUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as User) : null;
  }

  /** Returns whether token is present */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  /** Try to fetch user from server if in browser & logged in, else return null */
  getUser(): Observable<User | null> {
    if (typeof window === 'undefined') {
      return of(null);
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }
    return this.fetchLoggedInUser().pipe(
      map((response) => {
        const user = response.data.user || null;
        if (user && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      })
    );
  }

  /** Get fresh user data from `/me` */
  fetchLoggedInUser(): Observable<{ data: { user: User } }> {
    return this.http.get<{ data: { user: User } }>(`${this.baseUrl}/me`);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  updateUser(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return this.http.patch(`${this.baseUrl}/changePassword/${id}`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  }
}
