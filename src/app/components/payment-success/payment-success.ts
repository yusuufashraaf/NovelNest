import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


interface PaymentConfirmationResponse {
  success: boolean;
  message?: string;
  orderId?: string;
  transactionId?: string;
}
@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css'
})
export class PaymentSuccess implements OnInit {
 isLoading = true;
  paymentStatus: 'success' | 'error' | 'invalid' = 'invalid';
  successMessage = '';
  errorMessage = '';
  orderDetails: any = null;
  countdown = 5;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.processPaymentConfirmation();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private processPaymentConfirmation() {
    // Extract token and PayerID from URL parameters
    const token = this.route.snapshot.queryParamMap.get('token');
    const payerId = this.route.snapshot.queryParamMap.get('PayerID');

    // Validate required parameters
    if (!token || !payerId) {
      this.paymentStatus = 'invalid';
      this.isLoading = false;
      return;
    }

    // Make API call to confirm payment
    this.confirmPayment(token, payerId);
  }

  private confirmPayment(token: string, payerId: string) {
    this.http.get<PaymentConfirmationResponse>(
      `http://localhost:5000/buy/confirm?token=${token}&PayerID=${payerId}`
    ).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.paymentStatus = 'success';
          this.successMessage = response.message || 'Your payment has been processed successfully!';
          this.orderDetails = {
            orderId: response.orderId,
            transactionId: response.transactionId
          };
          this.startCountdown();
        } else {
          this.paymentStatus = 'error';
          this.errorMessage = response.message || 'Payment confirmation failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.paymentStatus = 'error';

        // Handle different error scenarios
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to payment service. Please check your connection.';
        } else if (error.status === 404) {
          this.errorMessage = 'Payment confirmation service not found.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error occurred during payment confirmation.';
        } else {
          this.errorMessage = error.error?.message || 'An unexpected error occurred during payment confirmation.';
        }

        console.error('Payment confirmation error:', error);
      }
    });
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.redirectToThankYou();
      }
    }, 1000);
  }

  redirectToThankYou() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.router.navigate(['/browse']);
  }

  redirectToPaymentError() {
    this.router.navigate(['/payment-error']);
  }

  retryPayment() {
    // Reset state and retry
    this.isLoading = true;
    this.paymentStatus = 'invalid';
    this.processPaymentConfirmation();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
