import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.css',
})
export class VerifyCode {
  email = '';
  resetCode = '';
  message = '';
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onSubmit() {
    this.http
      .post('http://localhost:5000/api/v1/auth/verifyPasswordResetCode', {
        email: this.email,
        resetCode: this.resetCode,
      })
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.error = '';
          setTimeout(() => {
            this.router.navigate(['/reset-password']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error?.message || 'Something went wrong.';
          this.message = '';
        },
      });
  }
}
