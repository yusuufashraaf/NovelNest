import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  email = '';
  password = '';

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
        document.getElementById('googleBtn')!,
        { theme: 'outline', size: 'large' }
      );
    }
  }

  handleGoogle(credential: string) {
    const decodedToken = jwtDecode(credential);
    console.log('Decoded Token:', decodedToken);

    this.http
      .post('http://localhost:5000/api/v1/auth/google', { token: credential })
      .subscribe((res: any) => {
        localStorage.setItem('token', res.token);
        console.log('Google login success', res.data.user);
        this.router.navigate(['/home']);
      });
  }

  onSubmit() {
    const credentials = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post('http://localhost:5000/api/v1/auth/login', credentials)
      .subscribe({
        next: (res: any) => {
          console.log('Login response:', res); // Debug to see the full response

          if (res.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/home']);
          } else {
            alert('Unexpected response from server. Please try again.');
          }
        },
        error: (err) => {
          console.error('Login failed', err.error?.message || err.message);
          alert('Login failed. Please check your credentials.');
        },
      });
  }
}
