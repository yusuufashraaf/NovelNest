import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private router:Router,private http:HttpClient){};

  initiatePayment() {
  this.http.post<any>('http://localhost:3000/buy/create-test-order', {})
    .subscribe({
      next: (res) => {
        console.log(res);
        // window.location.href = res.approvalUrl; // Redirect to PayPal
      },
      error: (err) => {
        console.log(err);

        this.router.navigate(['/err']); // Handle error
      }
    });
}
}
