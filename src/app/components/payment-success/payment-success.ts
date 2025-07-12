import { PaymentService } from './../../services/payment-service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,  OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environment';

// interface PaymentConfirmationResponse {
//   success: boolean;
//   message?: string;
//   orderId?: string;
//   transactionId?: string;
// }
@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css'
})
export class PaymentSuccess implements OnInit {
      private rootUrl = `${environment.apiUrl}`;
  
 isLoading = true;
  paymentStatus: 'success' | 'error' | 'invalid' = 'invalid';
  successMessage = '';
  errorMessage = '';
  orderDetails: {
    orderId: string;
    transactionId: string;
    status: string;
  } | null = null;
  countdown = 5;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private paymentServ:PaymentService
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

    const {tokenId,payerId} = this.paymentServ.getTokenPayerIdPaypal();

    if (!tokenId || !payerId) {
      this.paymentStatus = 'invalid';
      this.isLoading = false;
      return;
    }


    this.confirmPayment(tokenId, payerId);
  }

  private confirmPayment(tokenId: string, payerId: string) {
    this.http.get<PaymentConfirmationResponse>(
      `${this.rootUrl}/buy/confirm?token=${tokenId}&PayerID=${payerId}`
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log("heeeeeeeeeeeeeeeeeey",response);

        if (response.success  && response.data) {
          this.paymentStatus = 'success';
          this.successMessage = response.message || 'Your payment has been processed successfully!';
          this.orderDetails = {
            orderId: response.data.orderId,
            transactionId: response.data.captureId,
            status: response.data.status
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
        this.goHome();
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
    this.isLoading = true;
    this.paymentStatus = 'invalid';
    this.processPaymentConfirmation();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
