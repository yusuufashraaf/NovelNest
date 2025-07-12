import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
      private rootUrl = `${environment.apiUrl}`;
  
  password = '';
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http
      .patch(`${this.rootUrl}/api/v1/auth/resetPassword`, {
        password: this.password,
      })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Password has been reset!';
          this.error = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to reset password.';
          this.message = '';
        },
      });
  }
}
