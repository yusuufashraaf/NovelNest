import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser,CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id:
          '164201127750-so6g0tbctntsgqu5777aavd0kq3gv8l0.apps.googleusercontent.com',
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
}
