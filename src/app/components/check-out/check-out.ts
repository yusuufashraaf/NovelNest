import { PaymentService } from './../../services/payment-service';
import { HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-check-out',
  imports: [],
  standalone:true,
  templateUrl: './check-out.html',
  styleUrl: './check-out.css'
})
export class CheckOut {

  constructor(private paymentServ:PaymentService){}

  createProduct(){
    console.log("sent the request");

    this.paymentServ.initiatePayment();
  }


}
