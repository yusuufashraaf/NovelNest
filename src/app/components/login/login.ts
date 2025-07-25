import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../services/user-info';
import { environment } from '../../../environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
      private rootUrl = `${environment.apiUrl}`;
  
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userdata: UserInfo
  ) {}

  ngOnInit(): void {
    this.initGoogleSignIn();
    this.handleOAuthTokenRedirect();
  }

  private initGoogleSignIn(): void {
    if (isPlatformBrowser(this.platformId) && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: '164201127750-so6g0tbctntsgqu5777aavd0kq3gv8l0.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogle(response.credential),
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById('googleBtn')!,
        { theme: 'outline', size: 'large' }
      );
    }
  }

  private handleOAuthTokenRedirect(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (!token) return;

      const decoded: any = jwtDecode(token);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
      }

      this.userdata.setuserId(decoded.id);
      this.userdata.setToken(token);
      this.router.navigate(['/Browse']);
    });
  }

  private handleGoogle(credential: string): void {
    this.http
      .post(`${this.rootUrl}/api/v1/auth/google`, { token: credential })
      .subscribe({
        next: (res: any) => {
          if (res.token && res.data?.user) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
              localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            this.userdata.setuserId(res.data.user._id);
            this.userdata.setToken(res.token);
            this.router.navigate(['/Browse']);
          } else {
            this.errorMessage = 'Unexpected server response';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message;
        },
      });
  }

  loginWithGithub(): void {
    window.location.href = `${this.rootUrl}/api/v1/auth/github`;
  }

  onSubmit(): void {
    this.http
      .post(`${this.rootUrl}/api/v1/auth/login`, {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          if (res.token && res.data?.user) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
              localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            this.userdata.setuserId(res.data.user._id);
            this.userdata.setToken(res.token);
            this.router.navigate(['/Browse']);
          } else {
            this.errorMessage = 'Unexpected server response';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || err.message;
        },
      });
  }
}
