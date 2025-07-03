import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private router:Router,private http:HttpClient){};

  initiatePayment(body:any) {
  return this.http.post<any>('http://localhost:5000/buy/create-test-order', body)

}
}
