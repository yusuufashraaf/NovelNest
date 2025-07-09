import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './user-info';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private router:Router,private http:HttpClient,private userInfo:UserInfo){};


  initiatePayment(body:any) {
    
    const headers = new HttpHeaders({
      Authorization: `${this.userInfo.getToken()}`,
    });
  return this.http.post<any>('http://localhost:5000/buy/create-test-order', body,{headers})

}
}
