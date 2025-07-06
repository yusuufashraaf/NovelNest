import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
email = '';
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:5000/api/v1/auth/forgotPassword', { email: this.email }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/verify-code'], { queryParams: { email: this.email } });
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Something went wrong.';
        this.message = '';
      }
    });
  }
}