import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initGoogleButton();
    this.handleOAuthTokenRedirect();
  }

  initGoogleButton() {
    if (isPlatformBrowser(this.platformId) && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: '164201127750-so6g0tbctntsgqu5777aavd0kq3gv8l0.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogle(response.credential),
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.http
      .post('http://localhost:5000/api/v1/auth/signup', userData)
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
          this.name = this.email = this.password = this.confirmPassword = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Signup failed';
          this.successMessage = '';
        },
      });
  }

  handleGoogle(credential: string) {
    this.http
      .post('http://localhost:5000/api/v1/auth/google', { token: credential })
      .subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      });
  }

  registerWithGithub(): void {
    window.location.href = 'http://localhost:5000/api/v1/auth/github';
  }

  handleOAuthTokenRedirect(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (!token) return;

      const decoded: any = jwtDecode(token);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
      }

      this.router.navigate(['/home']);
    });
  }
}
