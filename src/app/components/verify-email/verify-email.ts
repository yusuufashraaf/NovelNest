import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center mt-5">
      <h2 *ngIf="!errorMessage && !successMessage">Verifying your email...</h2>
      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <a href="/login" *ngIf="successMessage" class="btn btn-primary mt-3"
        >Go to Login</a
      >
    </div>
  `,
})
export class VerifyEmail implements OnInit {
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const otp = this.route.snapshot.paramMap.get('otp');

    this.http
      .get(`http://localhost:5000/api/v1/auth/verifyEmail/${otp}`)
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Verification failed';
        },
      });
  }
}
