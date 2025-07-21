import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './user-info';
import { environment } from '../../environment';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private rootUrl = `${environment.apiUrl}`;

  tokenIdPaypal: string = '';
  payerId: string = '';

  setTokenPayerIdPaypal(tokenIdPaypal: string, payerId: string) {
    this.tokenIdPaypal = tokenIdPaypal;
    this.payerId = payerId;
  }

  getTokenPayerIdPaypal() {
    return {
      tokenId: this.tokenIdPaypal,
      payerId: this.payerId,
    };
  }
  constructor(
    private router: Router,
    private http: HttpClient,
    private userInfo: UserInfo
  ) {}

  initiatePayment(body: any) {
    const token = this.userInfo.getToken() || localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.post<any>(`${this.rootUrl}/buy/create-test-order`, body, {
      headers,
    });
  }
}
