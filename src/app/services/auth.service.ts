import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environment';

export interface User {
  pic: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private rootUrl = `${environment.apiUrl}`;
  private baseUrl = `${this.rootUrl}/api/v1/users`;

  constructor(private http: HttpClient, private router: Router) {}

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded._id || null;
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  loginUser(credentials: { email: string; password: string }) {
    return this.http
      .post<{ token: string; data: { user: User } }>(
        `${this.baseUrl}/login`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.token || '');
          }
        })
      );
  }

  getCachedUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as User) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) return of(null);
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

  fetchLoggedInUser(): Observable<{ data: { user: User } }> {
    return this.http.get<{ data: { user: User } }>(`${this.baseUrl}/me`);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  updateUser(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      throw new Error('User ID not found in token');
    }

    return this.http.patch(`${this.baseUrl}/changePassword/${userId}`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  }
}
