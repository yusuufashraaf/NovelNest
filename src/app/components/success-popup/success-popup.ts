import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-popup',
  template: `<p>Processing payment...</p>`,
})
export class SuccessPopupComponent implements OnInit {
  constructor(private route:ActivatedRoute){};


  ngOnInit(): void {
      const token = this.route.snapshot.queryParamMap.get('token');
    const payerId = this.route.snapshot.queryParamMap.get('PayerID');
    if (window.opener) {
      // notify parent (main window)
      window.opener.postMessage({
        paymentSuccess: true,
        token,
        payerId,
      }, '*');
      window.close();
    }
  }
}
